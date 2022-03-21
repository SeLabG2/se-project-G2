import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { logout, selectUser } from '../features/user/userSlice';
import { logoutUser, useAuth } from '../firebase/firebase';


function Navbar() {
    const navigate = useNavigate();
    const currentUser = useAuth();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        console.log('global user before logout : ', user);
        try {
            await logoutUser();
            console.log('user logged out : ', currentUser);
            dispatch(logout());
            console.log('global user after logout : ', user);
            navigate('/login');
        } catch (err) {
            console.log(err.message);
        }
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