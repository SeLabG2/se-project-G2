import React from 'react';

function JoinClass() {
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <>
            <div>JoinClass</div>
            <div className="create_class_form_wrapper">
                <form onSubmit={handleSubmit}>
                    <div>
                        <p>Class Name :</p>
                        <input type="text" />
                    </div>
                    <div>
                        <p>Class Number :</p>
                        <input type="text" />
                    </div>
                    <div>
                        <p>Class Term :</p>
                        <input type="text" />
                    </div>
                    <div>
                        <p>Access Code (optional) :</p>
                        <input type="text" />
                    </div>
                    <button type="submit">Join Class!</button>
                </form>
            </div>
        </>
    );
}

export default JoinClass;