import React, { useEffect, useState } from 'react';
import ContentArea from './ContentArea';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar';
import { DashboardMainWrapper, PostAndContentWrapper } from '../../components/styled/Dashboard.styled';
import { useDispatch, useSelector } from 'react-redux';
import { getJoinedClasses, selectJoinedClasses } from '../../features/classes/classSlice';
import { toast } from 'react-toastify';
import { selectUser } from '../../features/user/userSlice';
import { getDoc } from 'firebase/firestore';
import { getDocRefById } from '../../firebase/firebase-firestore';

function Dashboard() {
    // const currentClass = useSelector(selectCurrentClass);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const joinedClasses = useSelector(selectJoinedClasses);

    useEffect(() => {

        if (user.class_joined.length === 0) {
            // if user has no joined classes then
            // show no posts yet message or no classes joined message
        } else {
            // if user has some joined class, then check if you have them in local storage
            if (joinedClasses === null) {
                // if you don't have them in local storage, just make API call to database
                // this will save some billing in case you have bigger apps (i.e. making API calls only when you need)
                dispatch(getJoinedClasses(user));
            }

            // after grabbing the current class, get all posts and current post and current discussion

        }
    }, []);

    useEffect(() => {
        try {
            if (joinedClasses === null) {
                console.log('waiting for data...');
            } else {
                console.log('current class info : ', joinedClasses[0]);
            }
        } catch (error) {
            console.log(error.message);
        }
    }, [joinedClasses]);


    return (
        <DashboardMainWrapper>
            <Navbar />
            <PostAndContentWrapper>
                <Sidebar />
                <ContentArea />
            </PostAndContentWrapper>
        </DashboardMainWrapper>
    );
}

export default Dashboard;