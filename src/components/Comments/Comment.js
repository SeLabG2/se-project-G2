import React from 'react';
import { useSelector } from 'react-redux';
import { StyledPostCard } from '../styled/PostList.styled';
import { selectUser } from '../../features/user/userSlice';
import CommentForm from './CommentForm';

function Comment({ comment, replies, addComment, deleteComment, updateComment, activeComment, setActiveComment, parentId = null, }) {
    const user = useSelector(selectUser);
    const canReply = Boolean(user?.uid);
    const canEdit = user.email === comment.created_by;
    const canDelete = user.email === comment.created_by;
    const isReplying = activeComment && activeComment.type === 'replying' && activeComment.id === comment.id;
    const isEditing = activeComment && activeComment.type === 'editing' && activeComment.id === comment.id;
    const replyId = parentId ? parentId : comment.id;

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
                {canReply && <div onClick={() => { setActiveComment({ id: comment.id, type: "replying" }) }}>Reply</div>}
                {canEdit && <div onClick={() => { setActiveComment({ id: comment.id, type: "editing" }) }}>Edit</div>}
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