import { getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getColRef, getDocRefById } from '../../../firebase/firebase-firestore';
import { selectJoinedClasses } from '../../../features/classes/classSlice';
import { selectUser } from '../../../features/user/userSlice';
import { toggleContent } from '../../../features/mainContentToggle/mainContentToggleSlice';
import { resetDropdown } from '../../../features/classDropdownToggle/classDropdownToggleSlice';

function JoinClass() {
    const [formData, setFormData] = useState({
        c_name: '',
        c_num: '',
        c_term: '',
        access_code: ''
    });
    const { c_name, c_num, c_term, access_code } = formData;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const joinedClasses = useSelector(selectJoinedClasses);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = () => {
        if (joinedClasses.length === 0) {
            return true;
        } else {
            for (let i = 0; i < joinedClasses?.length; i++) {
                if (
                    joinedClasses[i].c_name === c_name &&
                    joinedClasses[i].c_num === c_num &&
                    joinedClasses[i].c_term === c_term &&
                    joinedClasses[i].access_code === access_code

                ) {
                    // this means you already joined this class
                    return false;
                }
            }
            return true;
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        const isSafeToJoin = validate();

        setIsSubmitting(true);
        if (isSafeToJoin) {
            const joinTheClass = async () => {
                try {
                    const classColRef = getColRef('classes');
                    const joinClassQuery = query(classColRef,
                        where('uni_id', '==', `${user.uni_id}`),
                        where('c_name', '==', `${c_name}`),
                        where('c_num', '==', `${c_num}`),
                        where('c_term', '==', `${c_term}`),
                        where('access_code', '==', `${access_code}`),
                        orderBy('created_at', 'desc')
                    )
                    const querySnapshot = await getDocs(joinClassQuery);
                    const class_id = querySnapshot.docs[0]?.id;

                    // now update the class

                    let new_joined_users = querySnapshot.docs[0]?.data().joined_users;
                    new_joined_users.push(user.email);
                    const classDocRef = getDocRefById(class_id, 'classes');
                    await updateDoc(classDocRef, {
                        joined_users: [...new_joined_users]
                    });

                    toast(`You've successfully joined this class... check your classes.`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setIsSubmitting(true);

                    dispatch(toggleContent('other'));
                    dispatch(resetDropdown());


                } catch (error) {
                    console.log(error.message);
                }
            }
            joinTheClass();

        } else {
            toast(`You've already joined this class! Or the access code might be incorrect...`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
    return (
        <>
            <div>JoinClass</div>
            <div className="create_class_form_wrapper">
                <form onSubmit={handleSubmit}>
                    <div>
                        <p>Class Name :</p>
                        <input
                            type="text"
                            name='c_name'
                            value={c_name}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <p>Class Number :</p>
                        <input
                            type="text"
                            name='c_num'
                            value={c_num}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <p>Class Term :</p>
                        <input
                            type="text"
                            name='c_term'
                            value={c_term}
                            onChange={onChange}
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
                    <button disabled={isSubmitting} type="submit">Join Class!</button>
                </form>
            </div>
        </>
    );
}

export default JoinClass;