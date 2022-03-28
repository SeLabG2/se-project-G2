import React, { useState } from 'react';

function CommentForm({ submitLabel, handleSubmit, hasCancelButton = false, initialText = '', handleCancel }) {
    const [text, setText] = useState(initialText);
    const isTextareaDisabled = text.length === 0;
    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(text);
        setText('');
    };
    return <form onSubmit={onSubmit}>
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
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
