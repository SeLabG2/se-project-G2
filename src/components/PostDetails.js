import React from 'react';
import Comments from './Comments/Comments';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllPosts } from '../features/posts/postSlice';

function PostDetails() {
    const { p_id } = useParams();
    const allPosts = useSelector(selectAllPosts);
    const post = allPosts.filter(p => p.p_id === p_id)[0];

    return (
        <>
            <div>{`post id from params here : ${p_id}`}</div>
            <div>{`post details are : ${post?.details}`}</div>
            <Comments />
        </>
    );
}

export default PostDetails;