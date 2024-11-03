// src/redux/slice/loginSlice.js
import { backendUrl } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initiate login to get OTP
export const initiateLogin = createAsyncThunk("login/initiateLogin", async ({ email }) => {
  const response = await axios.post(`${backendUrl}/auth/login`, { email });
  console.log(response.data)
  return response.data;
});

// Verify OTP to complete login
export const verifyLoginOtp = createAsyncThunk("login/verifyLoginOtp", async ({ email, otp }) => {
  const response = await axios.post(`${backendUrl}/auth/verify-login-otp`, { email, otp });
  return response.data;
});

const loginSlice = createSlice({
  name: "login",
  initialState: {
    userInfo: null,
    loading: false,
    message: "",
    isOtpSent: false,
  },
  reducers: {
    resetLoginState: (state) => {
      state.userInfo = null;
      state.loading = false;
      state.message = "";
      state.isOtpSent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateLogin.pending, (state) => {
        state.loading = true;
        state.message = "";
      })
      .addCase(initiateLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.isOtpSent = true;
      })
      .addCase(initiateLogin.rejected, (state, action) => {
        state.loading = false;
        state.message = action.error.message;
      })
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.message = action.error.message;
      });
  },
});

export const { resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;