import { addDoc, setDoc, deleteDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
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

    const addComment = (text, parentId = null) => {
        // add to database
        const commentData = {
            body: text,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            created_by: user.email,
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
            }
            )
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
                handleSubmit={addComment}
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