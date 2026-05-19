import { configureStore } from '@reduxjs/toolkit';
import apiReducer from './apiAlice';
import authReducer from './authAlice';


export const store = configureStore({
  reducer: {
    auth:authReducer,
    api:apiReducer
  },
});
