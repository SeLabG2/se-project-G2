//src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import mainContentToggleReducer from '../features/mainContentToggle/mainContentToggleSlice';
import classDropdownToggleSlice from '../features/classDropdownToggle/classDropdownToggleSlice';
import classesReducer from '../features/classes/classSlice';
import postReducer from '../features/posts/postSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        classes: classesReducer,
        posts: postReducer,
        mainContent: mainContentToggleReducer,
        toggleClassDropdown: classDropdownToggleSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),
});
