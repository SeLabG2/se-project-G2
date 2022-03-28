import { addDoc, deleteDoc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { selectUser } from '../../../features/user/userSlice';
import { storage } from '../../../firebase/firebase-config';
import { getColRef, getDocRefById } from '../../../firebase/firebase-firestore';


function ResourcesTab() {
    const currentClass = useSelector(selectCurrentClass);
    const user = useSelector(selectUser);
    const [uploading, setUploading] = useState(false);
    // const MAX_FILE_SIZE_IN_BYTES = 100000; // 100KB
    const MAX_FILE_SIZE_IN_BYTES = 1000000; // 1MB
    // const MAX_FILE_SIZE_IN_BYTES = 10000000; // 10MB
    const [progress, setProgress] = useState(0);
    const [resourceList, setResourceList] = useState([]);

    useEffect(() => {
        if (currentClass) {
            const resourcesColRef = getColRef(`/classes/${currentClass.c_id}/resources`);
            getDocs(resourcesColRef)
                .then((snapshot) => {
                    const promises = snapshot.docs.map((doc) => {
                        return { ...doc.data(), id: doc.id };
                    });
                    Promise.all(promises)
                        .then(resources => setResourceList(resources))
                })
                .catch(err => console.log(err.message))
        }

    }, [currentClass]);

    const checkFileInDB = (file) => {
        let isFileInDB;
        const resourcesColRef = getColRef(`/classes/${currentClass.c_id}/resources`);
        const doesResourceExistsQuery = query(resourcesColRef, where('name', '==', file.name));
        getDocs(doesResourceExistsQuery)
            .then((snapshot) => {
                if (snapshot.docs.length > 0) {
                    isFileInDB = true;
                } else {
                    isFileInDB = false;

                }
                console.log('is file in db? ', isFileInDB);
                if (!isFileInDB) {
                    uploadFile(file);
                } else {
                    alert('This same file already exists in class resources.',
                        '\nPlease delete existing one or rename the new file.');
                    return
                }
            })
            .catch(err => console.log(err.message))
        return isFileInDB;
    }

    const onFileChange = (e) => {
        if (!uploading) {
            const file = e.target.files[0];
            // clear input tag value
            e.target.value = null;
            if (file) {
                if (file.size > MAX_FILE_SIZE_IN_BYTES) {
                    alert('file too big. Can not upload');
                    return
                }
                checkFileInDB(file);
            }
        } else {
            console.log('uploading of another file is in progress... please wait till its over.');
            // clear input tag value
            e.target.value = null;
        }
    };

    const uploadFile = (file) => {
        const resourcesRef = ref(storage, `/resources/${currentClass.c_id}/${file.name}`);
        const uploadTask = uploadBytesResumable(resourcesRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(prog);
            },
            (err) => {
                console.log(err.message)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((url) => {
                        const resource = {
                            url: url,
                            name: file.name,
                            created_at: serverTimestamp()
                        };
                        const resourcesColRef = getColRef(`/classes/${currentClass.c_id}/resources`);
                        addDoc(resourcesColRef, resource)
                            .then((data) => {
                                const newResource = { ...resource, id: data.id }
                                console.log('new resource is : ', resource);
                                setResourceList([...resourceList, newResource]);
                            })
                        setProgress(0);
                    })
            }
        );
    }

    const deleteResource = (resource) => {
        const resourcesRef = ref(storage, `/resources/${currentClass.c_id}/${resource.name}`);
        deleteObject(resourcesRef)
            .then(() => {
                // File deleted successfully
                console.log('resource deleted : ', resource.id);
                const resourceDocRef = getDocRefById(resource.id, `/classes/${currentClass.c_id}/resources`);
                deleteDoc(resourceDocRef)
                    .then(() => {
                        console.log('doc deleted.');
                        setResourceList(resourceList.filter((listItem) => listItem.id !== resource.id));
                    })
            })
            .catch(err => console.log(err.message))

    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('file uploaded.');
    };

    return (
        <div>
            {user.role === 'instructor' && <form onSubmit={onSubmit}>
                <label htmlFor="fileInput">
                    Upload File!
                    <input
                        style={{ opacity: 0, position: "absolute", left: "-999999px" }}
                        type="file"
                        id="fileInput"
                        onChange={onFileChange}
                    />
                </label>
            </form>}
            {progress > 0 && <div>
                upload progress : {progress} %
            </div>}
            {resourceList.length > 0 && resourceList.map((resource) => (
                <div key={resource.id}>
                    <a href={resource.url} target="_blank">{resource.name}</a>
                    {user.role === 'instructor' && currentClass.instructors_list.includes(user.email) &&
                        <div onClick={() => { deleteResource(resource) }}>Delete</div>
                    }
                </div>
            ))}
        </div>
    );
}

export default ResourcesTab;