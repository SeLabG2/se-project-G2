import React from 'react';

function CreateClass() {
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    return (
        <>
            <div>CreateClass</div>
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
                        <p>Class Size :</p>
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
                    <div>
                        <p>Attendance list :</p>
                        <textarea name="class_attendance" cols="30" rows="10" placeholder="(please write comma separated email of class participants)" />
                    </div>
                    <button type="submit">Create Class!</button>
                </form>
            </div>
        </>
    );
}

export default CreateClass;