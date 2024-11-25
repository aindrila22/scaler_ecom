import { backendUrl } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async () => {
    const response = await axios.get(`${backendUrl}/auth/user`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    //console.log(response.data)
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    status: "idle",
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
        state.status = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
