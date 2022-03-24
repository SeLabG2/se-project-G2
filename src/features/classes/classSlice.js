import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDoc, getDocRefById } from '../../firebase/firebase-firestore';

// get user from local storage
const currentJoinedClasses = JSON.parse(localStorage.getItem('currentJoinedClasses'));

const initialState = {
    currentClass: null,
    joinedClasses: currentJoinedClasses ? currentJoinedClasses : null,
    createdClasses: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
};

export const getJoinedClasses = createAsyncThunk('class/getJoinedClasses', async (user, thunkAPI) => {
    if (user.class_joined.length === 0) {
        return null;
    } else {
        try {
            // get all info for joined classes of a given user from database

            const promises = user.class_joined.map(async (class_id) => {
                const classDocRef = getDocRefById(class_id, 'classes');
                const docSnap = await getDoc(classDocRef);
                return {
                    c_id: class_id,
                    ...docSnap.data()
                };
            });
            const joined_classes = await Promise.all(promises);
            localStorage.setItem('currentJoinedClasses', JSON.stringify(joined_classes));
            return joined_classes;
        }
        catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
                || error.message
                || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const classSlice = createSlice({
    name: 'classes',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // for getJoinedClasses
            .addCase(getJoinedClasses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJoinedClasses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.joinedClasses = action.payload;
            })
            .addCase(getJoinedClasses.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.joinedClasses = null;
            })

    }
});

// export synchronous actions
export const { reset } = classSlice.actions;

// selectors
export const selectCurrentClass = (state) => state.classes.currentClass;
export const selectJoinedClasses = (state) => state.classes.joinedClasses;
export const selectCreatedClasses = (state) => state.classes.createdClasses;
export const selectClassesStatus = (state) => ({
    isLoading: state.classes.isLoading,
    isError: state.classes.isError,
    isSuccess: state.classes.isSuccess,
    message: state.classes.message
});

// reducer
export default classSlice.reducer;