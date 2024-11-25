import { backendUrl } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

export const initiateLogin = createAsyncThunk(
  "login/initiateLogin",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, { email });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyLoginOtp = createAsyncThunk(
  "login/verifyLoginOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/verify-login-otp`, {
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
        state.message = action.payload || "An unexpected error occurred.";

        toast({
          title: "Login Failed",
          description:
            action.payload || "An error occurred while initiating login.",
          status: "error",
          variant: "destructive",
        });
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
        toast({
          title: "OTP Verification Failed",
          description:
            action.payload || "An error occurred while verifying the OTP.",
          status: "error",
          variant: "destructive",
        });
      });
  },
});

export const { resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;
