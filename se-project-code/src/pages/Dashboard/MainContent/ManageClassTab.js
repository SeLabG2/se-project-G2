import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleManageClass, selectManageClass } from '../../../features/mainContentToggle/mainContentToggleSlice';
import ManageDiscussions from './ManageDiscussions';
import ManageEnrollment from './ManageEnrollment';
import ManageGeneralSettings from './ManageGeneralSettings';
import ManageQnA from './ManageQnA';

function ManageClassTab() {
    const manageClassToggle = useSelector(selectManageClass);
    const dispatch = useDispatch();

    return (
        <>
            <strong onClick={() => { dispatch(toggleManageClass('general')) }}>ManageGeneralSettings</strong>
            <strong onClick={() => { dispatch(toggleManageClass('QnA')) }}>ManageQnA</strong>
            <strong onClick={() => { dispatch(toggleManageClass('discussions')) }}>ManageDiscussions</strong>
            <strong onClick={() => { dispatch(toggleManageClass('enrollment')) }}>ManageEnrollment</strong>

            {manageClassToggle === 'general' && <ManageGeneralSettings />}
            {manageClassToggle === 'QnA' && <ManageQnA />}
            {manageClassToggle === 'discussions' && <ManageDiscussions />}
            {manageClassToggle === 'enrollment' && <ManageEnrollment />}
        </>
    );
}

export default ManageClassTab;