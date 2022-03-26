import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentClass } from '../../../features/classes/classSlice';
import { selectUser } from '../../../features/user/userSlice';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { getColRef } from '../../../firebase/firebase-firestore';
import { toggleContent } from '../../../features/mainContentToggle/mainContentToggleSlice';
import { resetDropdown } from '../../../features/classDropdownToggle/classDropdownToggleSlice'

function NewPostForm() {
    const dispatch = useDispatch();
    const currentClass = useSelector(selectCurrentClass);
    const user = useSelector(selectUser);
    const discussions = currentClass?.discussions.map(discussion => ({
        value: discussion,
        label: discussion,
    }));
    const [discussionList, setDiscussionList] = useState([]);
    const nameOptions = [
        { value: user.email, label: user.email },
        { value: 'Anonymous', label: 'Anonymous' }
    ];
    const [showName, setShowName] = useState('');
    const [isValidationComplete, setIsValidationComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        c_id: currentClass?.c_id,
        created_by: user.email,
        type: '',
        summary: '',
        details: '',
        discussion_list: [],
        instructor_ans: '',
        student_ans: '',
        likes: 0,
        show_name_as: '',
    });

    const { summary, details } = formData;


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (isValidationComplete) {
            // console.log('validation complete. database path is : ', `classes/${currentClass?.c_id}/posts`);
            const createPost = () => {
                try {
                    const postColRef = getColRef(`classes/${currentClass?.c_id}/posts`);
                    addDoc(postColRef, formData)
                        .then(console.log('post created in database.'))
                    setIsLoading(false);
                    dispatch(toggleContent('other'));
                    dispatch(resetDropdown());
                } catch (err) {
                    console.log(err.message);
                    setIsLoading(false);
                }
            }
            createPost();
        }

    }, [isValidationComplete, currentClass, dispatch, formData])


    const handleSubmit = (e) => {
        e.preventDefault();

        // do some validation
        setIsLoading(true);
        const finalDiscussions = discussionList?.map(discussion => discussion.value);
        console.log('finalDiscussions : ', finalDiscussions);
        setFormData((prevState) => {
            const newFormData = {
                ...prevState,
                show_name_as: showName.value,
                discussion_list: finalDiscussions,
            };
            // console.log('post to submit : ', newFormData);
            setIsValidationComplete(true);
            return newFormData;
        });

    }
    return (
        <>
            <div>NewPostForm</div>
            <div className='newpost_form_wrapper'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <p>Post type : </p>
                        <input type="radio" id="question"
                            name="type"
                            value="question"
                            onChange={onChange}
                        />
                        <label htmlFor="question">Question</label>

                        {/* <input type="radio" id="poll" name="type" value="question" />
                        <label htmlFor="poll">Poll</label> */}

                        <input type="radio" id="note"
                            name="type"
                            value="note"
                            onChange={onChange}
                        />
                        <label htmlFor="note">Note</label>
                    </div>
                    <div>
                        <p>Select Discussion : </p>
                        <Select
                            components={makeAnimated()}
                            options={discussions}
                            onChange={setDiscussionList}
                            placeholder='Please select discussion(s)'
                            noOptionsMessage={() => 'No discussions to select...'}
                            isMulti
                            isSearchable
                        />
                    </div>
                    <div>
                        <p>Summary : </p>
                        <input
                            type="text"
                            placeholder="Enter the summary here"
                            name="summary"
                            value={summary}
                            onChange={onChange}
                        />
                    </div>
                    <div>
                        <p>Details : </p>
                        <textarea
                            cols="30"
                            rows="10"
                            placeholder="Enter the details here"
                            name="details"
                            value={details}
                            onChange={onChange}
                        >
                        </textarea>
                    </div>
                    <div>
                        <p>Show my name as : </p>
                        <Select
                            options={nameOptions}
                            onChange={setShowName}
                            placeholder='Please select show name(s)'
                        />
                    </div>
                    <button disabled={isLoading} type="submit">Submit</button>
                </form>
            </div>
        </>
    );
}

export default NewPostForm;