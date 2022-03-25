import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { logout, reset, selectUser, selectUserStatus } from '../features/user/userSlice';
import ClassNavDropdown from './ClassNavDropdown';
import { selectShowDropdown, toggleDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { selectJoinedClasses } from '../features/classes/classSlice';


function Navbar() {
    const user = useSelector(selectUser);
    const joinedClasses = useSelector(selectJoinedClasses);
    const { isError, isSuccess, message } = useSelector(selectUserStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { c_id } = useParams();
    const showClassDropdown = useSelector(selectShowDropdown);
    const [classId, setClassId] = useState();

    // useEffect(() => {
    //     if (c_id == undefined) {
    //         setClassId('');
    //     } else {
    //         setClassId(c_id);
    //     }
    // }, [])


    useEffect(() => {
        if (isError) {
            toast(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }

        if (isSuccess || !user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);


    const handleLogout = async () => {
        localStorage.removeItem('currentClass');
        dispatch(logout());
    }

    const resetMainContent = () => {
        dispatch(toggleContent(null));
    }

    return (
        <NavbarContainer>
            <NavigationLink className='logo' to="/">Logo</NavigationLink>
            {
                user.role === "instructor"
                &&
                <button onClick={() => { dispatch(toggleContent('create-class')) }}>New Class</button>
            }
            <button onClick={() => { dispatch(toggleContent('join-class')) }}>Join Class</button>

            <NavList>
                <NavItem onClick={() => { dispatch(toggleDropdown()) }}>My Classes</NavItem>
                {showClassDropdown && <ClassNavDropdown />}
                {
                    joinedClasses.length !== 0
                    &&
                    (
                        <>
                            <NavItem>
                                <NavigationLink
                                    onClick={() => { dispatch(toggleContent('other')) }} to={`resources`}
                                >
                                    Resources
                                </NavigationLink>
                            </NavItem>
                            <NavItem>
                                <NavigationLink
                                    onClick={() => { dispatch(toggleContent('other')) }} to={`statistics`}
                                >
                                    Statistics
                                </NavigationLink>
                            </NavItem>
                            {
                                user.role === "instructor"
                                &&
                                <NavItem>
                                    <NavigationLink
                                        onClick={() => { dispatch(toggleContent('other')) }} to={`manage-class`}
                                    >
                                        Manage Class
                                    </NavigationLink>
                                </NavItem>
                            }
                        </>
                    )
                }
            </NavList>
            <button onClick={handleLogout}>Logout</button>
        </NavbarContainer>
    );
}

const NavbarContainer = styled.div`
    position: sticky;
    top: 0;
    background-color: var(--primary-color);
    padding: var(--div-padding);
    /* border: 5px solid orange; */
`

const NavList = styled.ul`
    list-style: none;
`

const NavItem = styled.li`
    font-weight: var(--fw-bold);
    cursor: pointer;
`

const NavigationLink = styled(Link)`
    text-decoration: none;
    color: var(--black-color);

    &:hover {
        border-bottom: 1px solid var(--secondary-color);
    }

    &:visited {
        decoration: none;
    }

    &.logo {
        font-weight: var(--fw-extra-bold);
    }
`

export default Navbar;