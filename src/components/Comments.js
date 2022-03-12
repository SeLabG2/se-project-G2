import React from 'react';
import { StyledPostCard } from './styled/PostList.styled';

function Comments() {
    return (
        <>
            {(() => {
                let cards = [];
                for (let i = 0; i < 50; i++) {
                    cards.push(<StyledPostCard>comment</StyledPostCard>);
                }
                return cards;
            })()}
        </>
    );
}

export default Comments;