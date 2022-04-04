import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import styled from 'styled-components';
import { getColRef, getDocRefById } from '../../../firebase/firebase-firestore';
import { deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../../firebase/firebase-config';
import { deleteObject, ref } from 'firebase/storage';
import { selectAllPosts } from '../../../features/posts/postSlice';

function ManageGeneralSettings() {
    const navigate = useNavigate();
    const currentClass = useSelector(selectCurrentClass);
    const initialFormData = {
        c_name: currentClass.c_name,
        c_num: currentClass.c_num,
        c_size: currentClass.c_size,
        c_term: currentClass.c_term,
        access_code: currentClass.access_code
    };
    const [formData, setFormData] = useState(initialFormData);
    const { c_name, c_num, c_size, c_term, access_code } = formData;
    const [isLoading, setIsLoading] = useState(false);
    const allPosts = useSelector(selectAllPosts);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleDelete = () => {
        const isOkayToDelete = window.confirm("Are you sure you want to delete the class?\n",
            "You and all the joined users will lose all the data for this class.");
        if (isOkayToDelete) {
            const class_id = currentClass?.c_id;
            const classDocRef = getDocRefById(class_id, 'classes');
            const resourceColRef = getColRef(`classes/${class_id}/resources`);
            const deleteClass = async () => {
                try {
                    // delete resources collection from db
                    const resourceSnapshot = await getDocs(resourceColRef);
                    const resourcePaths = await Promise.all(resourceSnapshot.docs.map(async (resource) => {
                        const resourceDocRef = getDocRefById(resource.id, `classes/${class_id}/resources`);
                        await deleteDoc(resourceDocRef);
                        return `/resources/${class_id}/${resource.data().name}`
                    }));

                    // after this delete individual stats
                    const individualStatsColRef = getColRef(`classes/${class_id}/individual_stats`);
                    const individualStatsSnapshot = await getDocs(individualStatsColRef);

                    // if snapshot exists, delete all documents
                    if (individualStatsSnapshot.docs.length > 0) {
                        await Promise.all(individualStatsSnapshot.docs.map(async (doc) => {
                            const individualStatsDocRef = getDocRefById(doc.id, `classes/${class_id}/individual_stats`);
                            await deleteDoc(individualStatsDocRef);
                        }));
                    }

                    const postIds = allPosts.map(post => post.p_id);
                    // delete comments collection
                    if (postIds.length > 0) {

                        await Promise.all(postIds.map(async (postId) => {
                            // get each post id, and for that id, delete all comments inside the post
                            const commentsColRef = getColRef(`classes/${class_id}/posts/${postId}/comments`);
                            const commentsSnapshot = await getDocs(commentsColRef);
                            if (commentsSnapshot.docs.length > 0) {
                                await Promise.all(commentsSnapshot.docs.map(async (doc) => {
                                    const commentsDocRef = getDocRefById(doc.id, `classes/${class_id}/posts/${postId}/comments`);
                                    await deleteDoc(commentsDocRef);
                                }));
                            }
                            // after deleting all comments of the post, delete the given post as well
                            const postDocRef = getDocRefById(postId, `classes/${class_id}/posts`);
                            await deleteDoc(postDocRef);
                        }));
                    }

                    // now delete all the resources from the storage bucket
                    const promises = resourcePaths.map(async (path) => {
                        const resourceRef = ref(storage, path);
                        await deleteObject(resourceRef);
                    });
                    await Promise.all(promises);

                    // now delete the class
                    deleteDoc(classDocRef)
                        .then(() => {
                            navigate('/');
                        })
                        .catch(err => console.log(err.message))

                } catch (err) {
                    console.log(err.message);
                }
            };
            deleteClass();
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (c_size < currentClass.size) {
            alert('Class size is less than number of joined users.. please drop some users and then try updating the class size');
            return;
        }

        setIsLoading(true);

        const classDocRef = getDocRefById(currentClass.c_id, 'classes');
        updateDoc(classDocRef, {
            c_name: formData.c_name,
            c_num: formData.c_num,
            c_size: formData.c_size,
            c_term: formData.c_term,
            access_code: formData.access_code,
        })
            .then(() => {
                console.log('class updated.');
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err.message);
                setIsLoading(false);
            })
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    <p>Class Name :</p>
                    <input
                        type="text"
                        name='c_name'
                        value={c_name}
                        onChange={(onChange)}
                        required
                    />
                </div>
                <div>
                    <p>Class Number :</p>
                    <input
                        type="text"
                        name='c_num'
                        value={c_num}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <p>Class Size :</p>
                    <input
                        type="number"
                        name='c_size'
                        value={c_size}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <p>Class Term :</p>
                    <input
                        type="text"
                        name='c_term'
                        value={c_term}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <p>Access Code (optional) :</p>
                    <input
                        type="text"
                        name='access_code'
                        value={access_code}
                        onChange={onChange}
                    />
                </div>
                <button disabled={isLoading} type="submit">Update</button>
            </form>
            <strong onClick={handleDelete}>Delete Class!</strong>
        </div>
    );
}

const StyledGeneralSettingsContainer = styled.div`
`

const StyledGeneralSettingsForm = styled.form`
`

export default ManageGeneralSettings;