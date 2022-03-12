import React from 'react';
import { PostListContainer, StyledPostCard } from './styled/PostList.styled';

function PostsList() {
    return (
        <PostListContainer>
            <StyledPostCard color="yes">post</StyledPostCard>
            {(() => {
                let cards = [];
                for (let i = 0; i < 50; i++) {
                    cards.push(<StyledPostCard>post</StyledPostCard>);
                }
                return cards;
            })()}
            <StyledPostCard color="yes">post</StyledPostCard>
        </PostListContainer>
    );
}

export default PostsList;