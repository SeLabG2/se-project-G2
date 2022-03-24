//src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import mainContentToggleReducer from '../features/mainContentToggle/mainContentToggleSlice';
import classDropdownToggleSlice from '../features/classDropdownToggle/classDropdownToggleSlice';
import classesReducer from '../features/classes/classSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        classes: classesReducer,
        mainContent: mainContentToggleReducer,
        toggleClassDropdown: classDropdownToggleSlice
    },
});
