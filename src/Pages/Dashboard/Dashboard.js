import React, { useEffect } from 'react';
import ContentArea from './ContentArea';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar';
import { DashboardMainWrapper, PostAndContentWrapper } from '../../components/styled/Dashboard.styled';
import { useDispatch, useSelector } from 'react-redux';
import { getJoinedClasses, selectClassesStatus, selectCurrentClass, updateCurrentClass } from '../../features/classes/classSlice';
import { selectUser } from '../../features/user/userSlice';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { getAllPosts, selectAllPosts, selectPostStatus } from '../../features/posts/postSlice';
import { toggleContent } from '../../features/mainContentToggle/mainContentToggleSlice';

function Dashboard() {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentClass = useSelector(selectCurrentClass);
    const { isLoading: isJoinedClassesLoading } = useSelector(selectClassesStatus);
    const { isLoading: arePostsLoading } = useSelector(selectPostStatus);

    const allPosts = useSelector(selectAllPosts);

    useEffect(() => {
        if (user.class_joined.length === 0) {
            console.log('you have no joined classes yet!');
        } else {
            console.log('congrats you have some joined classes!');
            dispatch(getJoinedClasses(user));
        }
    }, []);

    useEffect(() => {
        console.log('current class changed : ', currentClass);
        dispatch(getAllPosts(currentClass?.c_id));
    }, [currentClass]);

    useEffect(() => {
        dispatch(toggleContent('other'));
    }, [navigate])


    useEffect(() => {
        if (currentClass != undefined && currentClass !== null) {
            if (!isJoinedClassesLoading && !arePostsLoading) {
                console.log('all posts are : ', allPosts);
                navigate(currentClass?.c_id);
            }
        }
    }, [arePostsLoading]);


    return (
        <>
            <DashboardMainWrapper>
                <Routes>
                    <Route path="/:c_id/*" element={<Navbar />} />
                    <Route path="*" element={<Navbar />} />
                </Routes>
                <PostAndContentWrapper>
                    <Routes>
                        <Route path="/:c_id/*" element={<Sidebar />} />
                        <Route path="*" element={<Sidebar />} />
                    </Routes>
                    <Routes>
                        <Route path="/:c_id/*" element={<ContentArea />} />
                        <Route path="*" element={<ContentArea />} />
                    </Routes>
                </PostAndContentWrapper>
            </DashboardMainWrapper>
            {/* <Routes>
                <Route path="*" element={<Missing />} />
            </Routes> */}
        </>
    );
}

export default Dashboard;