import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavbarContainer = styled.div`
    position: sticky;
    top: 0;
    background-color: var(--primary-color);
    padding: var(--div-padding);
    /* border: 5px solid orange; */
`

const LogoSection = styled.div`
    display: flex;
    justify-content: space-between;
`

const ButtonGroup = styled.div`
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

export {
    NavbarContainer,
    LogoSection,
    ButtonGroup,
    NavList,
    NavItem,
    NavigationLink
};