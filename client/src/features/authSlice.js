import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
}

const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        userLoggedOut: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});

export const { userLoggedIn, userLoggedOut, setLoading } = authSlice.actions;
export default authSlice.reducer;
// export const selectUser = (state) => state.authSlice.user;   