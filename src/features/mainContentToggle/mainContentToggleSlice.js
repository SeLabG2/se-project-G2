import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: 'other'
};

export const mainContentToggleSlice = createSlice({
    name: 'mainContent',
    initialState,
    reducers: {
        toggleContent: (state, action) => {
            state.value = action.payload;
        },
        resetMainContent: (state) => {
            state.value = 'other';
        }
    },
});

// actions
export const { toggleContent, resetMainContent } = mainContentToggleSlice.actions;

// selector
export const selectMainContent = (state) => state.mainContent.value;

// reducer
export default mainContentToggleSlice.reducer;