import { arrayRemove, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { getDocRefById } from '../../../firebase/firebase-firestore';

function ManageDiscussions() {
    const currentClass = useSelector(selectCurrentClass);
    const discussionList = [...currentClass.discussions];
    const [openEdit, setOpenEdit] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [newDiscussion, setNewDiscussion] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleEdit = (e, discussion) => {
        e.preventDefault();

        setIsEditing(true);

        const newDiscussionList = [editedName, ...discussionList.filter(dis => dis !== discussion)];
        console.log(newDiscussionList);

        const classDocRef = getDocRefById(currentClass.c_id, 'classes');
        updateDoc(classDocRef, {
            discussions: [...newDiscussionList]
        })
            .then(() => {
                setIsEditing(false);
                resetEdit();
            })
            .catch(err => {
                console.log(err.message);
                setIsEditing(false);
                resetEdit();
            })

        resetEdit();
    };

    const handleDelete = (discussion) => {
        const classDocRef = getDocRefById(currentClass.c_id, 'classes');
        updateDoc(classDocRef, {
            discussions: arrayRemove(discussion)
        })
            .then(() => {
                resetEdit();
            })
            .catch(err => {
                console.log(err.message);
                resetEdit();
            })
    };

    const createDiscussion = (e) => {
        e.preventDefault();

        if (discussionList.includes(newDiscussion)) {
            alert(`You've already created a discussion with same name.`);
            return;
        }

        setIsCreating(true);

        const newDiscussionList = [...discussionList, newDiscussion];
        const classDocRef = getDocRefById(currentClass.c_id, 'classes');
        updateDoc(classDocRef, {
            discussions: [...newDiscussionList]
        })
            .then(() => {
                setIsCreating(false);
                setNewDiscussion('');
                resetEdit();
            })
            .catch(err => {
                console.log(err.message);
                setIsCreating(false);
                setNewDiscussion('');
                resetEdit();
            })

    };

    const resetEdit = () => {
        setEditedName('');
        setOpenEdit(false);
    }

    return (
        <div>
            {
                discussionList.length > 0
                    ? discussionList.map(discussion => (
                        <div key={discussion}>
                            <div>{discussion}</div>
                            <div onClick={() => {
                                setOpenEdit(true);
                                setEditedName(discussion);
                            }}
                            >
                                Edit
                            </div>
                            {openEdit && <form onSubmit={(e) => handleEdit(e, discussion)}>
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                />
                                <div>{editedName}</div>
                                <button disabled={isEditing} type="submit">Update</button>
                                <button onClick={() => { resetEdit() }}>Cancel</button>
                            </form>}
                            <div onClick={() => { handleDelete(discussion) }}>Delete</div>
                        </div>
                    ))
                    : (
                        <div>No created discussions. Create some discussions below!</div>
                    )
            }
            <form onSubmit={createDiscussion}>
                <input
                    type="text"
                    value={newDiscussion}
                    onChange={(e) => setNewDiscussion(e.target.value)}
                    onFocus={() => { resetEdit() }}
                />
                <button disabled={isCreating} type="submit">Create Discussion</button>
            </form>
        </div>
    );
}

export default ManageDiscussions;