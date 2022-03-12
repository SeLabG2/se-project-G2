import React from 'react';
import styled from 'styled-components';

const DiscussionListContainer = styled.div`
    background-color: var(--primary-color);
    /* border: 5px solid orange; */
    width: 100%;
    height: var(--navbar-height);
`

function DiscussionList() {
    return (
        <DiscussionListContainer>
            <div>DiscussionList</div>
        </DiscussionListContainer>
    );
}

export default DiscussionList;