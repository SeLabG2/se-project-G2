import React, { useEffect } from 'react';
import PostDetails from '../../../components/PostDetails';
import NewPostForm from './NewPostForm';
import CreateClass from './CreateClass';
import JoinClass from './JoinClass';
import NavTabs from '../../../components/NavTabs';
import { MainContentWrapper } from '../../../components/styled/MainContent.styled';
import { useSelector } from 'react-redux';
import { selectMainContent } from '../../../features/mainContentToggle/mainContentToggleSlice';
import { selectUser } from '../../../features/user/userSlice';
import ResourcesTab from './ResourcesTab';
import StatisticsTab from './StatisticsTab';
import ManageClassTab from './ManageClassTab';

function MainContent() {
    const user = useSelector(selectUser);
    const mainContent = useSelector(selectMainContent);

    useEffect(() => {
        console.log(mainContent);
    }, [mainContent]);

    return (
        <MainContentWrapper>
            {mainContent === 'postDetails' && <PostDetails />}
            {mainContent === 'newPost' && <NewPostForm />}
            {user.role === 'instructor' && mainContent === 'newClass' && <CreateClass />}
            {mainContent === 'joinClass' && <JoinClass />}
            {mainContent === 'navTabs' && <NavTabs />}

            {/* Below stuff is temporary, only to check if my implementation works */}
            {mainContent === 'navTabs/resourcesTab' && <ResourcesTab />}
            {mainContent === 'navTabs/statisticsTab' && <StatisticsTab />}
            {user.role === 'instructor' && mainContent === 'navTabs/manageClassTab' && <ManageClassTab />}
        </MainContentWrapper>
    );
}

export default MainContent;