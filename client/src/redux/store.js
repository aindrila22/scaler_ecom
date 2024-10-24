// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice'; 
import userReducer from './slice/userSlice';
import modalReducer from './slice/modalSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    modal: modalReducer,
  },
});

export default store;