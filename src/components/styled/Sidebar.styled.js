import styled from 'styled-components';
import { media } from '../../common/helpers/mediaQuery';

const SidebarContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    position: relative;
    /* border: 10px solid var(--secondary-color); */
    
    ${media.mobile} {
        position: fixed;
        inset: 0 30% 0 0;
        z-index: 9999;
        background-color: white;
        width: 75vw;
        border-right: 5px solid var(--gray-color);
        
        ${media.mobileSmall} {
            width: 100vw;
        }

        &.sidebar-is-closed {
            display: none;
        }
    }

    ${media.desktop} {
        flex: 0.3;
    }
`

const OpenMenuIcon = styled.svg`
    ${media.desktop} {   
        display: none;
    }

    position: fixed;
    top: 0;
    left: 0;
    width: 2em;
    cursor: pointer;
    z-index: 99999;
    
    &:hover {
        color: var(--secondary-color);
    }
`

const CloseMenuIcon = styled(OpenMenuIcon)`

`

export { SidebarContainer, OpenMenuIcon, CloseMenuIcon };