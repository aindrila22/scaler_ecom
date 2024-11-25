// src/features/authSlice.js
import { toast } from '@/hooks/use-toast';
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
      const errorMessage = error.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage); 
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
      const errorMessage = error.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage); 
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
        toast({
          title: "Signup Failed",
          description: action.payload || "An error occurred while initiating signup.",
          status: "error",
          variant: "destructive",
        });
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
        toast({
          title: "OTP Verification Failed",
          description: action.payload || "An error occurred while verifying the OTP.",
          status: "error",
          variant: "destructive",
        });
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;