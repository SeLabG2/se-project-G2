import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../../features/user/userSlice';
import { getColRef } from '../../../firebase/firebase-firestore';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { toggleContent } from '../../../features/mainContentToggle/mainContentToggleSlice';
import { selectJoinedClasses } from '../../../features/classes/classSlice';
import { resetDropdown } from '../../../features/classDropdownToggle/classDropdownToggleSlice';
import { useNavigate } from 'react-router-dom';

function CreateClass() {
    const user = useSelector(selectUser);
    const joinedClasses = useSelector(selectJoinedClasses);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialFormData = {
        created_at: serverTimestamp(),
        uni_id: user.uni_id,
        c_name: '',
        c_num: '',
        c_size: '',
        c_term: '',
        access_code: '',
        total_posts: 0,
        total_contributions: 0,
        total_anonymous_contributions: 0,
        total_deleted_contributions: 0,
        created_by: user.email,
        discussions: [],
        joined_users: [user.email],
        instructors_list: [user.email],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [attendanceList, setAttendanceList] = useState('');

    const { c_name, c_num, c_size, c_term, access_code } = formData;

    const [isValidationComplete, setIsValidationComplete] = useState(false);
    const [readyToNavigate, setReadyToNavigate] = useState(false);

    useEffect(() => {
        if (isValidationComplete) {
            const createClass = () => {

                try {
                    const classColRef = getColRef('classes');
                    addDoc(classColRef, formData)
                        .then(() => {
                            console.log('class created in database.');
                            setIsLoading(false);
                            setReadyToNavigate(true);
                        })
                } catch (err) {
                    console.log(err.message);
                    setIsLoading(false);
                }
            }
            createClass();
        }
    }, [isValidationComplete]);

    useEffect(() => {
        if (readyToNavigate) {
            console.log('joinedClasses : ', joinedClasses);
            if (joinedClasses.length === 1) {
                console.log(`address is : /dashboard/${joinedClasses[0].c_id}`);
                dispatch(toggleContent('other'));
                dispatch(resetDropdown());
                navigate(`/dashboard/${joinedClasses[0].c_id}`);
            } else {
                console.log('I am here');
                dispatch(toggleContent('other'));
                dispatch(resetDropdown());
            }
        }
    }, [joinedClasses]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        // validate joined_users

        let test = [user.email];
        if (attendanceList?.length !== 0) {
            const regex = /[,;\s\r\n]/g;
            const attendance = attendanceList.split(regex);
            test = [...attendance.filter(String), user.email];
            console.log('attendance list is : ', test);
        }

        console.log('test value outside if is : ', test);
        // check if total class size exceeds
        if (test.length + 1 > c_size) {
            alert('Attendance list exceeds class size. Please remove some users from the list or change the class size.');
            return;
        }

        setFormData((prevState) => {
            const updatedFormData = {
                ...prevState,
                joined_users: [...test],
            };
            setIsValidationComplete(true);
            return updatedFormData;
        });

        // store class in database after validation

    }
    return (
        <>
            <div>CreateClass</div>
            <div className="create_class_form_wrapper">
                <form onSubmit={handleSubmit}>
                    <div>
                        <p>Class Name :</p>
                        <input
                            type="text"
                            name='c_name'
                            value={c_name}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <p>Class Number :</p>
                        <input
                            type="text"
                            name='c_num'
                            value={c_num}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <p>Class Size :</p>
                        <input
                            type="number"
                            name='c_size'
                            value={c_size}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <p>Class Term :</p>
                        <input
                            type="text"
                            name='c_term'
                            value={c_term}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div>
                        <p>Access Code (optional) :</p>
                        <input
                            type="text"
                            name='access_code'
                            value={access_code}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <p>Attendance list :</p>
                        <textarea
                            cols="30"
                            rows="10"
                            placeholder="(please write emails of class participants on new line)"
                            name="attendanceList"
                            value={attendanceList}
                            onChange={(e) => { setAttendanceList(e.target.value) }}
                        />
                    </div>
                    <button disabled={isLoading} type="submit">Create Class!</button>
                </form>
            </div>
        </>
    );
}

export default CreateClass;