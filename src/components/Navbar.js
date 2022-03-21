import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { logout, reset, selectUser, selectUserStatus } from '../features/user/userSlice';


function Navbar() {
    const user = useSelector(selectUser);
    const { isError, isSuccess, message } = useSelector(selectUserStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        dispatch(logout());
    }

    return (
        <NavbarContainer>
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

export default Navbar;