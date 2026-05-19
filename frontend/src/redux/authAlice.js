import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { navigateTo } from '../components/navigationService';
// import {login,logout} from '../security/auth';


// Async Login API Call
export const loginUser = createAsyncThunk(
  'auth/loginUser',  // Action type
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Fake API (replace with real API)
      try {
        // const response = await axios.post(
        //   `http://localhost:8081/todotask/api/user/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        // );
        // return response.data;
// login("dummy_token");
         return {"code":'200'};
      } catch (err) {

      }

    } catch (error) {
      return error.response.data;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(loginUser.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      //   toast.error('Something went wrong! 1');
      // })
      .addCase(loginUser.fulfilled, (state, action) => {
        // alert("called");
        // state.loading = false;
        state.token = "action.payload.token";
        // state.user = action.meta.arg.username; // username from payload
        console.log(action.payload);
        console.log(action.payload.code==200);
        if (action.payload.code == 200) {
          if (typeof navigateTo === 'function') {
            navigateTo('/dashboard');
          }
        } else {
         
        }
      })
    // .addCase(loginUser.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    //   console.log(action.payload);
    //   toast.error('Something went wrong! 2');
    // });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
