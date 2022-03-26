import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../../features/user/userSlice';
import { getColRef } from '../../../firebase/firebase-firestore';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { toggleContent } from '../../../features/mainContentToggle/mainContentToggleSlice';

function CreateClass() {
    const user = useSelector(selectUser);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const initialFormData = {
        created_at: serverTimestamp(),
        uni_id: user.uni_id,
        c_name: '',
        c_num: '',
        c_size: '',
        c_term: '',
        access_code: '',
        created_by: user.uid,
        discussions: [],
        joined_users: [user.email],
        instructors_list: [user.email],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [attendanceList, setAttendanceList] = useState('');

    const { c_name, c_num, c_size, c_term, access_code, joined_users } = formData;

    const [isValidationComplete, setIsValidationComplete] = useState(false);

    useEffect(() => {
        if (isValidationComplete) {
            const createClass = () => {

                try {
                    const classColRef = getColRef('classes');
                    addDoc(classColRef, formData)
                        .then(console.log('class created in database.'))

                    setIsLoading(false);
                    dispatch(toggleContent('other'));
                } catch (err) {
                    console.log(err.message);
                    setIsLoading(false);
                }
            }
            createClass();
        }
    }, [isValidationComplete]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = async () => {

    }

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