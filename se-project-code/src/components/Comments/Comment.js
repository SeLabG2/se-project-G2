import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { StyledPostCard } from '../styled/PostList.styled';
import { selectUser } from '../../features/user/userSlice';
import CommentForm from './CommentForm';
import { useParams } from 'react-router-dom';
import { selectCurrentClass } from '../../features/classes/classSlice';
import { getDocRefById } from '../../firebase/firebase-firestore';
import { arrayRemove, arrayUnion, increment, updateDoc } from 'firebase/firestore';

function Comment({
    comment,
    postType,
    replies,
    addComment,
    deleteComment,
    updateComment,
    activeComment,
    setActiveComment,
    parentId = null,
}) {
    const user = useSelector(selectUser);
    const { p_id } = useParams();
    const currentClass = useSelector(selectCurrentClass);
    const canReply = Boolean(user?.uid);
    const canEdit = user.email === comment.created_by;
    const canDelete = user.email === comment.created_by;
    const isReplying = activeComment && activeComment.type === 'replying' && activeComment.id === comment.id;
    const isEditing = activeComment && activeComment.type === 'editing' && activeComment.id === comment.id;
    const replyId = parentId ? parentId : comment.id;

    const isLikedByMe = comment.liked_by.includes(user.email);
    const [isLiked, setIsLiked] = useState(isLikedByMe);
    const [isUpdatingLikes, setIsUpdatingLikes] = useState(false);

    const likeComment = () => {
        const commentDocRef = getDocRefById(comment.id, `classes/${currentClass.c_id}/posts/${p_id}/comments`);
        setIsUpdatingLikes(true);
        if (!isLiked) {
            const likeIt = async () => {
                // increment comment's like count by 1 and store user's email in comment's liked_by array
                await updateDoc(commentDocRef, {
                    likes: increment(1),
                    liked_by: arrayUnion(user.email)
                });
                setIsLiked(true);
                setIsUpdatingLikes(false);
            }
            likeIt();
        } else if (isLiked) {
            const unLikeIt = async () => {
                // decrement comment's like count by 1 and remove user's email from comment's liked_by array
                await updateDoc(commentDocRef, {
                    likes: increment(-1),
                    liked_by: arrayRemove(user.email)
                });
                setIsLiked(false);
                setIsUpdatingLikes(false);
            }
            unLikeIt();
        }
    };

    return (
        <>
            <StyledPostCard>
                {!isEditing &&
                    <div>
                        created by : {comment?.show_name_as}
                        <br />
                        body : {comment.body}
                        <br />
                        parentId : {comment.parent_id}
                        <br />
                        commentId : {comment.id}
                        <br />
                        <strong
                            disabled={isUpdatingLikes}
                            onClick={likeComment}
                        >
                            Like : {comment.likes}
                        </strong>
                    </div>
                }
                {isEditing && (
                    <CommentForm
                        submitLabel={'Update'}
                        hasCancelButton
                        initialText={comment.body}
                        handleSubmit={(showName, text) => updateComment(showName, text, comment.id)}
                        handleCancel={() => setActiveComment(null)}
                    />
                )}
                <br />
                {
                    postType !== 'note'
                    &&
                    <>
                        {canReply && <div onClick={() => { setActiveComment({ id: comment.id, type: "replying" }) }}>Reply</div>}
                        {canEdit && <div onClick={() => { setActiveComment({ id: comment.id, type: "editing" }) }}>Edit</div>}
                    </>
                }

                {canDelete && <div onClick={() => { deleteComment(comment.id) }}>Delete</div>}
            </StyledPostCard>
            {isReplying && (
                <CommentForm
                    submitLabel={'Reply'}
                    handleSubmit={(showName, text) => addComment(showName, text, replyId)}
                />
            )}
            {replies.length > 0 && (
                <div>
                    {replies.map(reply => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            postType={postType}
                            replies={[]}
                            addComment={addComment}
                            deleteComment={deleteComment}
                            updateComment={updateComment}
                            parentId={comment.id}
                            activeComment={activeComment}
                            setActiveComment={setActiveComment}
                        />
                    ))}
                </div>
            )}
        </>
    );
}


export default Comment;