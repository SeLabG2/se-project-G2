import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { resetDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { selectCurrentClass } from '../features/classes/classSlice';
import { selectUser } from '../features/user/userSlice';

function ClassNavDropdown({ className }) {
    const user = useSelector(selectUser);
    const currentClass = useSelector(selectCurrentClass);
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(resetDropdown());
    };

    return (
        <ClassNavDropdownContainer>
            {
                user.class_joined.length !== 0
                    ? user.class_joined.map((class_id) => (
                        <Link onClick={handleClick} key={class_id} to={`/dashboard/${class_id}`}>{class_id}</Link>
                    ))
                    : <Link onClick={handleClick} to="#">you have no classes yet.</Link>
            }
        </ClassNavDropdownContainer>
    )
}

const ClassNavDropdownContainer = styled.div`
    height: 200px;
    width: 200px;
    overflow-y: auto;
`

export default ClassNavDropdown;