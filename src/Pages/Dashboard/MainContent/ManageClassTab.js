import React from 'react';
import ManageDiscussions from './ManageDiscussions';
import ManageEnrollment from './ManageEnrollment';
import ManageGeneralSettings from './ManageGeneralSettings';
import ManageQnA from './ManageQnA';

function ManageClassTab() {
    return (
        <>
            <div>ManageClassTab</div>
            <ManageGeneralSettings />
            <ManageDiscussions />
            <ManageQnA />
            <ManageEnrollment />
        </>
    );
}

export default ManageClassTab;