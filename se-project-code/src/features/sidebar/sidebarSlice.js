import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    show: false
}

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.show = !state.show;
        },
        showSidebar: (state) => {
            state.show = true;
        },
        hideSidebar: (state) => {
            state.show = false;
        }
    },
});

// actions
export const { toggleSidebar, showSidebar, hideSidebar } = sidebarSlice.actions;

// selector
export const selectSidebarStatus = (state) => state.sidebar.show;

// reducer
export default sidebarSlice.reducer;
