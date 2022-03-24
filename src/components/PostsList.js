import React from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { PostListContainer, StyledPostCard } from './styled/PostList.styled';

function PostsList() {
    const dispatch = useDispatch();
    return (
        <PostListContainer>
            <StyledPostCard onClick={() => { dispatch(toggleContent('postDetails')) }}>post</StyledPostCard>
            <StyledPostCard onClick={() => { dispatch(toggleContent('postDetails')) }}>post</StyledPostCard>
            {/* <Routes>
                <Route path="/dashboard"/>
            </Routes> */}
        </PostListContainer>
    );
}

export default PostsList;