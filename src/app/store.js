//src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import mainContentToggleReducer from '../features/mainContentToggle/mainContentToggleSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        mainContent: mainContentToggleReducer
    },
});
