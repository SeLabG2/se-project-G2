import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { resetDropdown } from '../features/classDropdownToggle/classDropdownToggleSlice';
import { selectCurrentClass, selectJoinedClasses } from '../features/classes/classSlice';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { updateCurrentDiscussion } from '../features/posts/postSlice';

const DiscussionListContainer = styled.div`
    background-color: var(--primary-color);
    /* border: 5px solid orange; */
    width: 100%;
    height: var(--navbar-height);
    display: flex;
    gap: 1em;
    overflow-x: scroll;
    overflow-y: hidden;

    &::-webkit-scrollbar,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
        display: none;
    }
`

function DiscussionList() {
    const joinedClasses = useSelector(selectJoinedClasses);
    const currentClass = useSelector(selectCurrentClass);
    const dispatch = useDispatch();

    const handleClick = (discussion) => {
        dispatch(updateCurrentDiscussion(discussion));
        dispatch(resetDropdown());
        dispatch(toggleContent('other'));
        console.log(discussion);
    }

    return (
        <DiscussionListContainer>
            <div onClick={() => { handleClick('') }}>All</div>
            {
                (joinedClasses.length !== 0 && currentClass?.discussions.length !== 0)
                    ?
                    currentClass?.discussions.map(discussion => (
                        <div onClick={() => { handleClick(discussion) }} key={discussion}>{discussion}</div>
                    ))
                    :
                    (
                        <></>
                    )
            }
        </DiscussionListContainer>
    );
}

export default DiscussionList;