import React from 'react';
import ContentArea from './ContentArea';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar';
import { DashboardMainWrapper, PostAndContentWrapper } from '../../components/styled/Dashboard.styled';

function Dashboard() {
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