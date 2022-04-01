import { arrayRemove, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { getDocRefById } from '../../../firebase/firebase-firestore';

function ManageEnrollment() {
    const currentClass = useSelector(selectCurrentClass);
    const [joinedUsersList, setJoinedUsersList] = useState(currentClass.joined_users);
    const [attendanceList, setAttendanceList] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setJoinedUsersList([...currentClass.joined_users]);
    }, [currentClass]);

    const handleDrop = (joined_user_list) => {
        const classDocRef = getDocRefById(currentClass.c_id, 'classes');
        console.log('joined_user_list : ', joined_user_list);
        updateDoc(classDocRef, {
            joined_users: arrayRemove(...joined_user_list)
        })
            .then(() => {
                console.log('removed the user successfully.');
            })
            .catch(err => console.log(err.message))
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        // validate joined_users

        let test = [];
        if (attendanceList?.length !== 0) {
            const regex = /[,;\s\r\n]/g;
            const attendance = attendanceList.split(regex);
            test = [...attendance.filter(String)];
            console.log('attendance list is : ', test);
        }

        console.log('test value outside if is : ', test);
        // check if total class size exceeds
        if (test.length + 1 > currentClass.c_size) {
            alert('Attendance list exceeds class size. Please remove some users from the list or change the class size.');
            setIsLoading(false);
            return;
        }
        // no email in attendance list is present in current class joined user list
        if (test.every((email) => !joinedUsersList.includes(email))) {
            const newJoinedUsers = [...joinedUsersList, ...test];
            console.log('new joined users are : ', newJoinedUsers);

            const classDocRef = getDocRefById(currentClass.c_id, 'classes');
            updateDoc(classDocRef, {
                joined_users: [...newJoinedUsers]
            })
                .then(() => {
                    console.log('updated attendance list successfully.');
                    setAttendanceList('');
                    setIsLoading(false);
                })
                .catch(err => {
                    console.log(err.message);
                    setIsLoading(false);
                })
        }
    }

    return (
        <div>JOINED USERS :
            <div>
                {joinedUsersList.map((joinedUser) => (
                    <div key={joinedUser}>
                        <div>{joinedUser}</div>
                        <div onClick={() => handleDrop([joinedUser])}>Drop</div>
                    </div>
                ))}
            </div>
            ENROLL STUDENTS :
            <div>
                <form onSubmit={handleSubmit}>

                    <textarea
                        cols="30"
                        rows="10"
                        placeholder="(please write emails of class participants on new line)"
                        name="attendanceList"
                        value={attendanceList}
                        onChange={(e) => { setAttendanceList(e.target.value) }}
                    />
                    <button disabled={isLoading} type="submit">Enroll</button>
                </form>
            </div>
        </div>
    );
}

export default ManageEnrollment;