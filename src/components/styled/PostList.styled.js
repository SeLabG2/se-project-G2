import styled from 'styled-components';

const PostListContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    /* border: 5px solid lightgreen; */
    background-color: var(--primary-color);

    & > * {
        flex: 0 0 var(--post-card-size);
        cursor: pointer;
    }

    &::-webkit-scrollbar-track {
        background-color: var(--primary-color);        
    }
`

const StyledPostCard = styled.div`
    background-color: var(--gray-color);
    margin: var(--post-card-margin);
    padding: var(--post-card-padding);
    border-radius: var(--div-border-radius);
    ${(props) => (props.color) ? "background-color: var(--white-color);" : ""}

    &:hover {
        background-color: var(--white-color);
    }
`

export { PostListContainer, StyledPostCard };