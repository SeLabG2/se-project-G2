import React, { useEffect } from 'react';
import PostDetails from './PostDetails';
import NewPostForm from './NewPostForm';
import CreateClass from './CreateClass';
import JoinClass from './JoinClass';
import NavTabs from './NavTabs';
import { MainContentWrapper } from './styled/MainContent.styled';
import { useSelector } from 'react-redux';
import { selectMainContent } from '../features/mainContentToggle/mainContentToggleSlice';

function MainContent() {
    const mainContent = useSelector(selectMainContent);

    useEffect(() => {
        console.log(mainContent);
    }, [mainContent]);

    return (
        <MainContentWrapper>
            {mainContent === 'postDetails' && <PostDetails />}
            {mainContent === 'newPost' && <NewPostForm />}
            {mainContent === 'newClass' && <CreateClass />}
            {mainContent === 'joinClass' && <JoinClass />}
            {mainContent === 'navTabs' && <NavTabs />}
        </MainContentWrapper>
    );
}

export default MainContent;