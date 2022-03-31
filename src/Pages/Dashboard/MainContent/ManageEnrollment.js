import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';

function ManageEnrollment() {
    const currentClass = useSelector(selectCurrentClass);
    const handleDrop = () => {

    };

    return (
        <div>ManageEnrollment
            <div>
                {currentClass.joined_users.map((joinedUser) => (
                    <div key={joinedUser}>
                        <div>{joinedUser}</div>
                        <div onClick={handleDrop}>Drop</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageEnrollment;