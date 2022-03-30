import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import styled from 'styled-components';
import { getColRef, getDocRefById } from '../../../firebase/firebase-firestore';
import { deleteDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../../firebase/firebase-config';
import { deleteObject, ref } from 'firebase/storage';

function ManageGeneralSettings() {
    const navigate = useNavigate();
    const currentClass = useSelector(selectCurrentClass);

    const handleDelete = () => {
        const isOkayToDelete = window.confirm("Are you sure you want to delete the class?\n",
            "You and all the joined users will lose all the data for this class.");
        if (isOkayToDelete) {
            const class_id = currentClass?.c_id;
            const classDocRef = getDocRefById(class_id, 'classes');
            const resourceColRef = getColRef(`classes/${class_id}/resources`);
            const deleteClass = async () => {
                try {
                    const resourceSnapshot = await getDocs(resourceColRef);
                    const resourcePaths = resourceSnapshot.docs.map(resource => {
                        return `/resources/${class_id}/${resource.data().name}`
                    })
                    // now delete the class
                    await deleteDoc(classDocRef);

                    // now delete all the resources from the storage bucket
                    const promises = resourcePaths.map(async (path) => {
                        const resourceRef = ref(storage, path);
                        await deleteObject(resourceRef);
                    })
                    await Promise.all(promises);
                    console.log('class deleted.');
                    navigate('/');
                } catch (err) {
                    console.log(err.message);
                }
            };
            deleteClass();
            deleteDoc(classDocRef)
                .then(() => {
                    const resourcesRef = ref(storage, `/resources/${class_id}`);
                    deleteObject(resourcesRef)
                        .then(() => {
                            // Class Resources deleted successfully
                            console.log('class deleted.');
                            navigate('/');
                        })
                })
                .catch(err => console.log(err.message))
        }
    }

    return (
        <div>ManageGeneralSettings
            <strong onClick={handleDelete}>Delete Class!</strong>
        </div>
    );
}

const StyledGeneralSettingsContainer = styled.div`
`

const StyledGeneralSettingsForm = styled.form`
`

export default ManageGeneralSettings;