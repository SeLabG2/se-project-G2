import React from 'react';
import styled from 'styled-components';


const NavbarContainer = styled.div`
    position: sticky;
    top: 0;
    background-color: var(--primary-color);
    padding: var(--div-padding);
    /* border: 5px solid orange; */
`


function Navbar() {
    return (
        <NavbarContainer>
            <div>Navbar</div>
        </NavbarContainer>
    );
}

export default Navbar;