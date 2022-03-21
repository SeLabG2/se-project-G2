// features/userSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// get user from local storage
// const user = JSON.parse.(localStorage.getItem('user'));

const initialState = {
    user: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;

        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { login, logout } = userSlice.actions;

// selectors
export const selectUser = (state) => state.user.user;
export const selectUserStatus = (state) => ({
    isLoading: state.user.isLoading,
    isError: state.user.isError,
    isSuccess: state.user.isSuccess,
    message: state.user.message
});

// reducer
export default userSlice.reducer;
