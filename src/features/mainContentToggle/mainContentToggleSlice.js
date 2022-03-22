import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 'postDetails'
};

export const mainContentToggleSlice = createSlice({
    name: 'mainContent',
    initialState,
    reducers: {
        toggleContent: (state, action) => {
            state.value = action.payload;
        },
    },
});

// actions
export const { toggleContent } = mainContentToggleSlice.actions;

// selector
export const selectMainContent = (state) => state.mainContent.value;

// reducer
export default mainContentToggleSlice.reducer;