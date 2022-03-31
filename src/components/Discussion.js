import React, { useState } from 'react';

function Discussion({
    discussion,
    currentInput,
    setCurrentInput,
    handleEdit,
    handleDelete,
    resetEdit,
    isEditing,
}) {
    const [openEdit, setOpenEdit] = useState(false);
    const [editedName, setEditedName] = useState('');

    return (
        <>
            <div>{discussion}</div>
            <div onClick={() => {
                setOpenEdit(true);
                setCurrentInput(discussion);
                setEditedName(discussion);
            }}
            >
                Edit
            </div>
            {
                currentInput === discussion
                &&
                openEdit
                &&
                <form onSubmit={(e) => handleEdit(e, discussion, editedName)}>
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}

                    />
                    <div>{editedName}</div>
                    <button disabled={isEditing} type="submit">Update</button>
                    <button onClick={() => {
                        resetEdit();
                        setOpenEdit(false);
                    }}
                    >
                        Cancel
                    </button>
                </form>}
            <div onClick={() => { handleDelete(discussion) }}>Delete</div>
        </>
    );
}

export default Discussion;