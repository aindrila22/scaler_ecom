// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice'; 
import userReducer from './slice/userSlice';
import modalReducer from './slice/modalSlice';
import loginReducer from './slice/loginSlice';


const store = configureStore({
  reducer: {
    login:loginReducer,
    auth: authReducer,
    user: userReducer,
    modal: modalReducer,
  },
});

export default store;