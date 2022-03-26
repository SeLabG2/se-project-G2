import React, { useEffect, useState } from 'react';
import ContentArea from './ContentArea';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar';
import { DashboardMainWrapper, PostAndContentWrapper } from '../../components/styled/Dashboard.styled';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentClass, selectJoinedClasses, updateCurrentClass, updateJoinedClasses } from '../../features/classes/classSlice';
import { selectUser } from '../../features/user/userSlice';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { toggleContent } from '../../features/mainContentToggle/mainContentToggleSlice';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getColRef } from '../../firebase/firebase-firestore';

function Dashboard() {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isCurrentClassLoading, setIsCurrentClassLoading] = useState(true);
    const joinedClasses = useSelector(selectJoinedClasses);
    const currentClass = useSelector(selectCurrentClass);

    useEffect(() => {
        console.log('current class at local storage at component mount is : ', JSON.parse(localStorage.getItem('currentClass')));
        const classColRef = getColRef('classes');
        const joinedClassQuery = query(
            classColRef,
            where('joined_users', 'array-contains', user.email),
            where('uni_id', '==', user.uni_id),
            orderBy('created_at', 'desc')
        );
        const unsubscribe = onSnapshot(joinedClassQuery, (snapshot) => {
            const promises = snapshot.docs.map((doc) => {
                return { ...doc.data(), c_id: doc.id };
            });
            Promise.all(promises)
                .then((joined_classes) => {
                    dispatch(updateJoinedClasses(joined_classes));
                    const localCurrentClass = JSON.parse(localStorage.getItem('currentClass'));
                    if (joined_classes.length !== 0) {
                        if (localCurrentClass === null || localCurrentClass == undefined) {
                            dispatch(updateCurrentClass(joined_classes[0]));
                        } else {
                            // check if the current class exists in joined class list
                            const currCls = joined_classes.filter(cls => cls.c_id === currentClass.c_id);
                            if (currCls.length === 0) {
                                dispatch(updateCurrentClass(joined_classes[0]));
                            }
                        }
                    }
                    setIsCurrentClassLoading(false);
                }).catch((err) => {
                    console.log(err.message);
                })
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!isCurrentClassLoading) {

            console.log('the joinedClasses are : ', joinedClasses);
            console.log('the current class is : ', currentClass);
            if (currentClass != undefined && currentClass !== null) {
                navigate(currentClass?.c_id);
            }
        }
    }, [isCurrentClassLoading]);

    useEffect(() => {
        dispatch(toggleContent('other'));
    }, [navigate])

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