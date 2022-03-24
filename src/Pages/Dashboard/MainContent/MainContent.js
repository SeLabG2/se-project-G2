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
import { Route, Routes } from 'react-router-dom';
import Missing from '../../Missing/Missing';

function MainContent() {
    const user = useSelector(selectUser);
    const mainContent = useSelector(selectMainContent);

    return (
        <MainContentWrapper>
            {mainContent === 'new-post' && <NewPostForm />}
            {user.role === 'instructor' && mainContent === 'create-class' && <CreateClass />}
            {mainContent === 'join-class' && <JoinClass />}

            <Routes>
                {/* <Route path="/class/:c_id/*">
                </Route> */}
                <Route path="resources" element={<ResourcesTab />} />
                <Route path="statistics" element={<StatisticsTab />} />
                {
                    user.role === 'instructor'
                    &&
                    <Route path="manage-class" element={<ManageClassTab />} />
                }
            </Routes>
        </MainContentWrapper>
    );
}

export default MainContent;