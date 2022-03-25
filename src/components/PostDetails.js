import React from 'react';
import { StyledPostCard } from './styled/PostList.styled';
import Comments from './Comments';
import { useParams } from 'react-router-dom';

function PostDetails() {
    const { p_id } = useParams();
    return (
        <>
            <div>{`post id from params here : ${p_id}`}</div>
            <Comments />
        </>
    );
}

export default PostDetails;