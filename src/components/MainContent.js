import React from 'react';
import PostDetails from './PostDetails';
import NewPostForm from './NewPostForm';
import CreateClass from './CreateClass';
import JoinClass from './JoinClass';
import NavTabs from './NavTabs';
import { MainContentWrapper } from './styled/MainContent.styled';

function MainContent() {
    return (
        <MainContentWrapper>
            <PostDetails />
            <NewPostForm />
            <CreateClass />
            <JoinClass />
            <NavTabs />
        </MainContentWrapper>
    );
}

export default MainContent;