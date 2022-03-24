import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { reset } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { selectUser } from '../features/user/userSlice';

function ClassNavDropdown({ className }) {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(reset());
    };

    const testClasses = [
        { c_id: 1, c_name: 'CS 321' },
    ];

    return (
        <ClassNavDropdownContainer>
            {/* user.class_joined.length !== 0 */}
            {
                testClasses.length !== 0
                    ? <Link onClick={handleClick} to={`class/${testClasses[0].c_id}`}>you joined some classes!</Link>
                    : <Link onClick={handleClick} to="#">you have no classes yet.</Link>
            }
        </ClassNavDropdownContainer>
    )
}

const ClassNavDropdownContainer = styled.div`
`

export default ClassNavDropdown;