import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { PostListContainer, StyledPostCard } from './styled/PostList.styled';

function PostsList() {
    const dispatch = useDispatch();
    return (
        <PostListContainer>
            <StyledPostCard color="yes" onClick={() => { dispatch(toggleContent('postDetails')) }}>post</StyledPostCard>
            {(() => {
                let cards = [];
                for (let i = 0; i < 50; i++) {
                    cards.push(
                        <StyledPostCard
                            onClick={() => { dispatch(toggleContent('postDetails')) }}
                        >
                            post
                        </StyledPostCard>
                    );
                }
                return cards;
            })()}
            <StyledPostCard color="yes" onClick={() => { dispatch(toggleContent('postDetails')) }}>post</StyledPostCard>
        </PostListContainer>
    );
}

export default PostsList;