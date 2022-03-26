import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { resetDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { selectCurrentClass, selectJoinedClasses, updateCurrentClass } from '../features/classes/classSlice';
import { selectUser } from '../features/user/userSlice';

function ClassNavDropdown({ className }) {
    const user = useSelector(selectUser);
    const joinedClasses = useSelector(selectJoinedClasses);
    const currentClass = useSelector(selectCurrentClass);
    const dispatch = useDispatch();

    const handleClick = (cls) => {
        dispatch(resetDropdown());
        dispatch(updateCurrentClass(cls));
    };

    return (
        <ClassNavDropdownContainer>
            {
                joinedClasses.length !== 0
                    ? joinedClasses.map((cls) => (
                        <div key={cls.c_id}>
                            <Link onClick={() => { handleClick(cls) }} to={`/dashboard/${cls.c_id}`}>{cls.c_id}</Link>
                        </div>
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