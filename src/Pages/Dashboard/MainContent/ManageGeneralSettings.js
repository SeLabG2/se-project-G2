import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import styled from 'styled-components';
import { getDocRefById } from '../../../firebase/firebase-firestore';
import { deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function ManageGeneralSettings() {
    const navigate = useNavigate();
    const currentClass = useSelector(selectCurrentClass);

    const handleDelete = () => {
        const isOkayToDelete = window.confirm("Are you sure you want to delete the class?\n",
            "You and all the joined users will lose all the data for this class.");
        if (isOkayToDelete) {
            const classDocRef = getDocRefById(currentClass?.c_id, 'classes');
            deleteDoc(classDocRef)
                .then(() => {
                    navigate('/');
                })
                .catch(err => console.log(err.message))
        }
    }

    return (
        <div>ManageGeneralSettings
            <div onClick={handleDelete}>Delete Class!</div>
        </div>
    );
}

const StyledGeneralSettingsContainer = styled.div`
`

const StyledGeneralSettingsForm = styled.form`
`

export default ManageGeneralSettings;