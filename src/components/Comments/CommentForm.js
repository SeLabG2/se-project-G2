import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { selectUser } from '../../features/user/userSlice';

function CommentForm({ submitLabel, handleSubmit, hasCancelButton = false, initialText = '', handleCancel }) {
    const [text, setText] = useState(initialText);
    const user = useSelector(selectUser);
    const nameOptions = [
        { value: user.email, label: user.email },
        { value: 'Anonymous', label: 'Anonymous' }
    ];
    const [showName, setShowName] = useState('');
    const isTextareaDisabled = text.length === 0 || showName.length === 0;
    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(showName.value, text);
        setText('');
    };
    return <form onSubmit={onSubmit}>
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
        <Select
            options={nameOptions}
            onChange={setShowName}
            placeholder='Please select show name(s)'
            isClearable
        />
        <button disabled={isTextareaDisabled}>{submitLabel}</button>
        {hasCancelButton && (
            <button
                type="button"
                onClick={handleCancel}
            >
                Cancel
            </button>
        )}
    </form>;
}

export default CommentForm;
