// src/features/authSlice.js
import { backendUrl } from '@/lib/utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ fullName, email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/signup`, {
        fullName,
        email,
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/verify-otp`, {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    message: '',
    isOtpSent: false,
  },
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.message = '';
      state.isOtpSent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isOtpSent = true; // Set OTP sent state
        state.message = action.payload.message;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;