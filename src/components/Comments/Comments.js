import { addDoc, setDoc, deleteDoc, getDocs, orderBy, query, serverTimestamp, increment, where, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectUser } from '../../features/user/userSlice';
import { getColRef, getDocRefById } from '../../firebase/firebase-firestore';
import Comment from './Comment';
import CommentForm from './CommentForm';


function Comments() {
    const user = useSelector(selectUser);
    const { c_id, p_id } = useParams();
    const [backendComments, setBackendComments] = useState([]);
    const rootComments = backendComments.filter((backendComment) => backendComment.parent_id === null);
    const [activeComment, setActiveComment] = useState(null);

    useEffect(() => {
        // get all comments from backend
        const loadComments = async () => {
            const commentsColRef = getColRef(`classes/${c_id}/posts/${p_id}/comments`);
            const commentsQuery = query(
                commentsColRef,
                orderBy('created_at')
            );
            const commentsColSnapshot = await getDocs(commentsQuery);
            const promises = commentsColSnapshot.docs.map((doc) => {
                return { ...doc.data(), id: doc.id };
            });
            const allComments = await Promise.all(promises);
            setBackendComments(allComments);
        }
        loadComments();
    }, [p_id]);

    const getReplies = commentId => {
        const replies = backendComments.filter(backendComment => backendComment?.parent_id === commentId);
        return replies;
    }

    const addComment = (showName, text, parentId = null) => {
        // add to database
        const commentData = {
            body: text,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: user.email,
            show_name_as: showName,
            liked_by: [],
            likes: 0,
            parent_id: parentId,
            post_id: p_id,
        };

        const commentsColRef = getColRef(`classes/${c_id}/posts/${p_id}/comments`);
        addDoc(commentsColRef, commentData)
            .then((docRef) => {
                const newComment = { ...commentData, id: docRef.id }
                setBackendComments([...backendComments, newComment]);

                const individualStatsColRef = getColRef(`classes/${c_id}/individual_stats`);
                const queryIndividualStats = query(individualStatsColRef, where('user', '==', user.email));
                const updateStats = async () => {
                    // update individual contributions
                    const individualStatsSnapshot = await getDocs(queryIndividualStats);
                    const id = individualStatsSnapshot.docs.at(0).id;
                    const individualStatsDocRef = getDocRefById(id, `classes/${c_id}/individual_stats`);
                    await setDoc(individualStatsDocRef, {
                        total_contributions: increment(1)
                    }, { merge: true });

                    // update post comment count
                    const postRef = getDocRefById(p_id, `classes/${c_id}/posts`);
                    await updateDoc(postRef, {
                        total_comments: increment(1)
                    });

                    // update class contributions
                    const classDocRef = getDocRefById(c_id, 'classes');
                    if (showName === 'Anonymous') {
                        await updateDoc(classDocRef, {
                            total_anonymous_contributions: increment(1)
                        });
                    } else {
                        await updateDoc(classDocRef, {
                            total_contributions: increment(1)
                        });
                    }
                }
                updateStats();
            })
            .catch(err => console.log(err.message));

        setActiveComment(null);
    }

    const deleteComment = (commentId) => {
        // delete from database
        const commentsColRef = getColRef(`classes/${c_id}/posts/${p_id}/comments`);
        const deleteCommentDocRef = getDocRefById(commentId, `classes/${c_id}/posts/${p_id}/comments`);
        deleteDoc(deleteCommentDocRef)
            .then(() => {
                const commentListAfterDeleting = backendComments.filter((backendComment) => backendComment.id !== commentId);
                setBackendComments([...commentListAfterDeleting]);
            })
            .catch(err => console.log(err.message));
    }

    const updateComment = (text, commentId) => {
        // update comment in database

        console.log('comment updated.');
        // const commentData = backendComments.filter((backendComment) => backendComment.id === commentId)[0];
        // const updatedComment = {
        //     ...commentData,
        //     body: text,
        //     updated_at: serverTimestamp(),
        // };
        // const updateCommentDocRef = getDocRefById(commentId, `classes/${c_id}/posts/${p_id}/comments`);
        // setDoc(updateCommentDocRef, updatedComment)
        //     .then(() => {
        //         const updatedBackendComments = backendComments.map((backendComment) => {
        //             if (backendComment.id === commentId) {
        //                 return updatedComment;
        //             }
        //         });
        //         setBackendComments(updatedBackendComments);
        //     })
        //     .catch(err => console.log(err.message));

        setActiveComment(null);
    }

    return (
        <>
            <strong>Comments</strong>
            <br />
            <div>Comment Form</div>
            <CommentForm
                submitLabel={"COMMENT"}
                handleSubmit={(showName, text) => addComment(showName, text)}
            />
            {rootComments.map((rootComment) => (
                <Comment
                    key={rootComment.id}
                    comment={rootComment}
                    replies={getReplies(rootComment.id)}
                    addComment={addComment}
                    deleteComment={deleteComment}
                    updateComment={updateComment}
                    activeComment={activeComment}
                    setActiveComment={setActiveComment}
                />
            ))}
        </>
    );
}

export default Comments;