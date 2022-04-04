import styled from 'styled-components';

const MainContentWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    /* border: 5px solid lightgreen; */
    /* margin: 0.75em; */
    background-color: var(--primary-color);
    
    /* &::-webkit-scrollbar-track {
        background-color: var(--white-color);        
    } */
`

export { MainContentWrapper };