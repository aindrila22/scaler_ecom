// slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk('user/fetchUserDetails', async () => {
    const response = await axios.get('http://localhost:5000/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log(response.data)
    return response.data; // Assuming your backend sends back user data
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
        },
        clearUser: (state) => {
            state.userInfo = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userInfo = action.payload; // Store user info
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;