// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice'; 
import userReducer from './slice/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer
  },
});

export default store;