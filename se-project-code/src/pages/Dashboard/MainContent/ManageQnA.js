import { updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { getDocRefById } from '../../../firebase/firebase-firestore';

function ManageQnA() {
    const currentClass = useSelector(selectCurrentClass);
    const anonymity = currentClass.anonymity;
    const [anonymous, setAnonymous] = useState(anonymity);
    const isAnonymous = (anonymous) ? true : false;

    const handleRadioClick = () => {
        setAnonymous(prev => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // update class anonymity
        const classDocRef = getDocRefById(currentClass.c_id, 'classes');
        updateDoc(classDocRef, {
            anonymity: anonymous
        })
            .then(() => {
                console.log('anonymity is successfully changed.');
            })
            .catch(err => console.log(err.message))
    };

    return (
        <div>ManageQnA
            <form onSubmit={handleSubmit}>
                Class Anonymity :
                <div>
                    <label htmlFor="manage-anonymity-true">
                        <input
                            type="radio"
                            id='manage-anonymity-true'
                            name='anonymity'
                            value={anonymous}
                            checked={isAnonymous}
                            onChange={handleRadioClick}
                        />
                        TRUE
                    </label>
                </div>
                <div>
                    <label htmlFor="manage-anonymity-false">
                        <input
                            type="radio"
                            id='manage-anonymity-false'
                            name='anonymity'
                            value={anonymous}
                            checked={!isAnonymous}
                            onChange={handleRadioClick}
                        />
                        FALSE
                    </label>
                </div>
                <button type='submit'>Save</button>
            </form>
        </div>
    );
}

export default ManageQnA;