import React, { useEffect, useState } from 'react';
import Comments from './Comments/Comments';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllPosts } from '../features/posts/postSlice';
import { getColRef, getDocRefById } from '../firebase/firebase-firestore';
import { deleteDoc, getDocs, increment, serverTimestamp, updateDoc } from 'firebase/firestore';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { selectCurrentClass } from '../features/classes/classSlice';
import { selectUser } from '../features/user/userSlice';

function PostDetails() {
    const { c_id, p_id } = useParams();
    const allPosts = useSelector(selectAllPosts);
    const post = allPosts.filter(p => p.p_id === p_id)[0];
    const navigate = useNavigate();
    const [openEdit, setOpenEdit] = useState(false);
    const currentClass = useSelector(selectCurrentClass);
    const user = useSelector(selectUser);

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
        value: post.show_name_as,
        label: post.show_name_as
    };
    const [showName, setShowName] = useState(initialShowName);
    const [isValidationComplete, setIsValidationComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initialFormData = {
        updated_at: serverTimestamp(),
        type: post.type,
        summary: post.summary,
        details: post.details,
        discussion_list: [],
        show_name_as: post.show_name_as,
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
                await updateDoc(postDocRef, formData);
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

    return (
        <>
            {
                !openEdit
                &&
                <>
                    <div>{`post id from params here : ${p_id}`}</div>
                    <div>{`post details are : ${post?.details}`}</div>
                    <br />
                    <strong onClick={() => setOpenEdit(true)}>Edit</strong>
                    <br />
                    <strong onClick={handleDelete}>Delete Post!</strong>
                    <br />
                    <Comments />
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