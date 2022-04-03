import React, { useEffect, useState } from 'react';
import Comments from './Comments/Comments';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllPosts } from '../features/posts/postSlice';
import { getColRef, getDocRefById } from '../firebase/firebase-firestore';
import { arrayRemove, arrayUnion, deleteDoc, getDocs, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { selectCurrentClass } from '../features/classes/classSlice';
import { selectUser } from '../features/user/userSlice';

function PostDetails() {

    useEffect(() => {
        // in case the posts aren't fetched
        // then to prevent app from crashing, just navigate back to dashboard
        // after that all posts will be loaded and you can view all of them successfully
        // but the downside is that if you were already doing something, it won't be saved
        if (allPosts == undefined || allPosts.length === 0) {
            navigate('/');
        }
    }, []);

    // variables below
    const { c_id, p_id } = useParams();
    const allPosts = useSelector(selectAllPosts);
    const post = allPosts?.filter(p => p.p_id === p_id)[0];
    const navigate = useNavigate();
    const [openEdit, setOpenEdit] = useState(false);
    const currentClass = useSelector(selectCurrentClass);
    const user = useSelector(selectUser);
    const isLikedByMe = post?.liked_by.includes(user.email);
    const [isLiked, setIsLiked] = useState(isLikedByMe);
    const [isUpdatingLikes, setIsUpdatingLikes] = useState(false);
    const [studAns, setStudAns] = useState(post?.student_ans)
    const [instructorAns, setInstructorAns] = useState(post?.instructor_ans)
    const isInstructor = currentClass?.instructors_list?.includes(user.email);
    const [updatingStudAns, setUpdatingStudAns] = useState(false);
    const [updatingInstructorAns, setUpdatingInstructorAns] = useState(false);
    const [showSaveBtn, setShowSaveBtn] = useState(false);

    const discussions = currentClass?.discussions.map(discussion => ({
        value: discussion,
        label: discussion,
    }));

    const initialFormDiscussionList = post?.discussion_list.map((dis) => ({
        value: dis,
        label: dis
    }));
    const [discussionList, setDiscussionList] = useState(initialFormDiscussionList);

    let nameOptions = [
        { value: user.email, label: user.email },
    ];
    // if current class has anonymity on
    if (currentClass?.anonymity) {
        nameOptions.push({ value: 'Anonymous', label: 'Anonymous' });
    }

    const initialShowName = {
        value: post?.show_name_as,
        label: post?.show_name_as
    };
    const [showName, setShowName] = useState(initialShowName);
    const [isValidationComplete, setIsValidationComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initialFormData = {
        updated_at: serverTimestamp(),
        type: post?.type,
        summary: post?.summary,
        details: post?.details,
        discussion_list: [],
        show_name_as: post?.show_name_as,
    };
    const [formData, setFormData] = useState(initialFormData);

    const { type, summary, details } = formData;
    const isChecked = (postType) => {
        if (postType === type) {
            return true;
        } else {
            return false;
        }
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleDelete = () => {
        const isOkayToDelete = window.confirm('Are you sure you want to delete?\n',
            'All the comments will also be gone.');
        if (isOkayToDelete) {
            console.log('post is : ', post);
            const totalDeletedContributions = post.total_comments + 1;

            const postDocRef = getDocRefById(p_id, `classes/${c_id}/posts`);

            // delete all the comments
            const deleteComments = async () => {
                const commentsColRef = getColRef(`classes/${c_id}/posts/${p_id}/comments`);
                const snapshot = await getDocs(commentsColRef);
                if (snapshot.docs.length > 0) {
                    const promises = snapshot.docs.map(async (doc) => {
                        const commentDocRef = getDocRefById(doc.id, `classes/${c_id}/posts/${p_id}/comments`);
                        await deleteDoc(commentDocRef);
                        return doc.id;
                    });
                    const deletedCommentsId = await Promise.all(promises);
                }
            };
            deleteComments()
                .then(() => {
                    // now delete the post
                    deleteDoc(postDocRef)
                        .then(() => {
                            const classDocRef = getDocRefById(c_id, 'classes');
                            updateDoc(classDocRef, {
                                total_posts: increment(-1),
                                total_deleted_contributions: increment(totalDeletedContributions)
                            })
                                .then(navigate('/'))
                        })
                        .catch(err => console.log(err.message))
                })
                .catch(err => console.log(err.message))
        }
    };

    useEffect(() => {
        if (isValidationComplete) {
            const editPost = async () => {
                const postDocRef = getDocRefById(post.p_id, `classes/${currentClass.c_id}/posts`);
                if (formData.type === 'note' && post?.type === 'question') {
                    const newData = { ...formData, student_ans: '', instructor_ans: '' };
                    await updateDoc(postDocRef, newData);
                } else {
                    await updateDoc(postDocRef, formData);
                }
                setIsLoading(false);
                // setDiscussionList(initialFormDiscussionList);
                // setShowName(initialShowName);
                // setFormData(initialFormData);
                setOpenEdit(false);
                setIsValidationComplete(false);
            }
            editPost();
        }
    }, [isValidationComplete]);

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);
        const finalDiscussions = discussionList?.map(discussion => discussion.value);

        setFormData((prevState) => {
            const newFormData = {
                ...prevState,
                show_name_as: showName.value,
                discussion_list: finalDiscussions,
            };
            setIsValidationComplete(true);
            return newFormData;
        });
    };

    const likePost = () => {
        const postDocRef = getDocRefById(post.p_id, `classes/${currentClass.c_id}/posts`);
        setIsUpdatingLikes(true);
        if (!isLiked) {
            const likeIt = async () => {
                // increment post's like count by 1 and store user's email in post's liked_by array
                await updateDoc(postDocRef, {
                    likes: increment(1),
                    liked_by: arrayUnion(user.email)
                });
                setIsLiked(true);
                setIsUpdatingLikes(false);
            }
            likeIt();
        } else if (isLiked) {
            const unLikeIt = async () => {
                // decrement post's like count by 1 and remove user's email from post's liked_by array
                await updateDoc(postDocRef, {
                    likes: increment(-1),
                    liked_by: arrayRemove(user.email)
                });
                setIsLiked(false);
                setIsUpdatingLikes(false);
            }
            unLikeIt();
        }
    };

    const submitStudAns = (e) => {
        e.preventDefault();
        setUpdatingStudAns(true);
        const postDocRef = getDocRefById(post.p_id, `classes/${currentClass.c_id}/posts`);
        const updateIt = async () => {
            await updateDoc(postDocRef, {
                student_ans: studAns,
            });
            setUpdatingStudAns(false);
            setShowSaveBtn(false);
        }
        updateIt();
    };

    const submitInstructorAns = (e) => {
        e.preventDefault();
        setUpdatingInstructorAns(true);
        const postDocRef = getDocRefById(post.p_id, `classes/${currentClass.c_id}/posts`);
        const updateIt = async () => {
            await updateDoc(postDocRef, {
                instructor_ans: instructorAns,
            });
            setUpdatingInstructorAns(false);
            setShowSaveBtn(false);
        }
        updateIt();
    };

    return (
        <>
            {
                !openEdit
                &&
                <>
                    <div>{`post details are : ${post?.details}`}</div>
                    <br />
                    <strong
                        aria-disabled={isUpdatingLikes}
                        onClick={likePost}
                    >
                        Like : {post?.likes}
                    </strong>
                    <br />
                    {
                        post?.created_by === user.email
                        &&
                        <>
                            <strong onClick={() => setOpenEdit(true)}>Edit</strong>
                            <br />
                            <strong onClick={handleDelete}>Delete Post!</strong>
                            <br />
                        </>
                    }
                    {
                        post?.type === 'question'
                        &&
                        <>
                            <form onSubmit={submitStudAns}>
                                <div>
                                    <textarea
                                        disabled={(isInstructor)}
                                        cols="30"
                                        rows="10"
                                        placeholder="Students answer here!"
                                        name="stud_ans"
                                        value={studAns}
                                        onChange={(e) => setStudAns(e.target.value)}
                                        onFocus={() => setShowSaveBtn(true)}
                                    >
                                    </textarea>
                                </div>
                                {
                                    !isInstructor && showSaveBtn
                                    &&
                                    <>
                                        <button disabled={updatingStudAns} type='submit'>Save</button>
                                        <button onClick={() => setShowSaveBtn(false)}>Cancel</button>
                                    </>
                                }
                            </form>
                            <form onSubmit={submitInstructorAns}>
                                <div>
                                    <textarea
                                        disabled={(!isInstructor)}
                                        cols="30"
                                        rows="10"
                                        placeholder="Instructors answer here!"
                                        name="inst_ans"
                                        value={instructorAns}
                                        onChange={(e) => setInstructorAns(e.target.value)}
                                        onFocus={() => setShowSaveBtn(true)}
                                    >
                                    </textarea>
                                </div>
                                {
                                    isInstructor && showSaveBtn
                                    &&
                                    <>
                                        <button disabled={updatingInstructorAns} type='submit'>Save</button>
                                        <button onClick={() => setShowSaveBtn(false)}>Cancel</button>
                                    </>
                                }
                            </form>
                        </>
                    }
                    <Comments postType={post?.type} />
                </>
            }
            {
                openEdit
                &&
                <>
                    <div>EditPostForm</div>
                    <div className='edit-post_form_wrapper'>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <p>Post type : </p>
                                <input type="radio" id="question"
                                    name="type"
                                    value="question"
                                    checked={isChecked('question')}
                                    onChange={onChange}
                                />
                                <label htmlFor="question">Question</label>

                                {/* <input type="radio" id="poll" name="type" value="question" />
                        <label htmlFor="poll">Poll</label> */}

                                <input type="radio" id="note"
                                    name="type"
                                    value="note"
                                    checked={isChecked('note')}
                                    onChange={onChange}
                                />
                                <label htmlFor="note">Note</label>
                            </div>
                            <div>
                                <p>Select Discussion : </p>
                                <Select
                                    components={makeAnimated()}
                                    value={discussionList}
                                    options={discussions}
                                    onChange={setDiscussionList}
                                    placeholder='Please select discussion(s)'
                                    noOptionsMessage={() => 'No discussions to select...'}
                                    isMulti
                                    isSearchable
                                />
                            </div>
                            <div>
                                <p>Summary : </p>
                                <input
                                    type="text"
                                    placeholder="Enter the summary here"
                                    name="summary"
                                    value={summary}
                                    onChange={onChange}
                                />
                            </div>
                            <div>
                                <p>Details : </p>
                                <textarea
                                    cols="30"
                                    rows="10"
                                    placeholder="Enter the details here"
                                    name="details"
                                    value={details}
                                    onChange={onChange}
                                >
                                </textarea>
                            </div>
                            <div>
                                <p>Show my name as : </p>
                                <Select
                                    value={showName}
                                    options={nameOptions}
                                    onChange={setShowName}
                                    placeholder='Please select show name(s)'
                                />
                            </div>
                            <button disabled={isLoading} type="submit">Save</button>
                            <button
                                onClick={() => {
                                    setDiscussionList(initialFormDiscussionList);
                                    setShowName(initialShowName);
                                    setFormData(initialFormData);
                                    setOpenEdit(false);
                                }}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </>
            }
        </>
    );
}

export default PostDetails;