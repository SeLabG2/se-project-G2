import React from 'react';
import {
    SearchBarContainer,
    SearchBox,
    SearchInput,
    AddPostButton,
    SearchIcon
} from './styled/DashboardSearch.styled';
import { toggleContent } from '../features/mainContentToggle/mainContentToggleSlice';
import { useDispatch } from 'react-redux';

function DashboardSearch() {
    const dispatch = useDispatch();
    return (
        <SearchBarContainer>
            <SearchBox>
                <SearchInput type="" placeholder="Search" />
                <SearchIcon xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </SearchIcon>
            </SearchBox>
            <div className="add-post-btn">
                <AddPostButton onClick={() => { dispatch(toggleContent('newPost')) }}>New Post</AddPostButton>
            </div>
        </SearchBarContainer>
    );
}

export default DashboardSearch;