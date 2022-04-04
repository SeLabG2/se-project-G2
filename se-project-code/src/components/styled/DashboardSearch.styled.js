import styled from 'styled-components';
import { media } from '../../common/helpers/mediaQuery';

const SearchBarContainer = styled.div`
    /* border: 5px solid red; */
    height: calc(2 * var(--navbar-height));
    background-color: var(--primary-color);
    padding: var(--post-card-margin);
    display: flex;
    flex-wrap: nowrap;
    gap: var(--post-card-margin);
    
    ${media.mobile} {
        flex-direction: column;
    }

    /* child 1 is search box */
    & > *:nth-child(1) {
        flex: 0.5;
    }

    /* child 2 is new-post-btn div*/
    & > *:nth-child(2) {
        flex: 0.5;
    }
    
    ${media.desktop} {
        height: var(--navbar-height);

        & > *:nth-child(1) {
            flex: 0.7;
        }
    
        /* child 2 is new-post-btn div*/
        & > *:nth-child(2) {
            flex: 0.3;
        }
    }

`

const SearchBox = styled.div`
    height: 100%;
    position: relative;
`

const SearchInput = styled.input`
    position: absolute;
    width: 100%;
    height: 100%;
    font-family: inherit;
    border: 0.1rem solid var(--input-color);
    border-radius: calc(2 * var(--div-border-radius));
    outline: none;
    padding-left: calc(6 * var(--post-card-padding));
    background-color: var(--white-color);

    &:hover,
    &:focus {
        border: 0.1rem solid var(--secondary-color);
    }
`

const SearchIcon = styled.svg`
    position: absolute;
    width: var(--div-margin);
    /* top: var(--post-card-margin); */
    top: 0.5rem;
    /* left: var(--post-card-margin); */
    left: 1rem;
    color: var(--black-color);
    cursor: text;
`

const AddPostButton = styled.button`
    font-family: inherit;
    font-size: var(--small-font-size);
    width: 100%;
    height: 100%;
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: var(--div-border-radius);
    padding: var(--post-card-padding);
    background-color: var(--secondary-color);
    color: var(--white-color);

    
    max-width:90%;
    display:inline-block;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;

    &:hover {
        background-color: var(--dark-secondary-color);
    }
`

export {
    SearchBarContainer,
    SearchBox,
    SearchInput,
    AddPostButton,
    SearchIcon
};