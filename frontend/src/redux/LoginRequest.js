import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {success,fail} from "../redux/WebTostar"
import Cookies from "js-cookie";


export const loginRequest = createAsyncThunk(
  "api/postRequest",
  async ({ url, data }, { rejectWithValue }) => {
    try {
       const token = Cookies.get("token");
       
        const response = await axios.post(url, data, {
        headers: { "Content-Type": "application/json"
      },
      });

      return response.data; // ✅ success

    } catch (err) {
       return rejectWithValue(err.response?.data || err.message); 
    //   // 🔴 API responded with error (like 400, 500)
    //   if (err.response) {
    //        fail("Server Down, UP Time 2AM to 12 AM Daily");
    //     return rejectWithValue({
    //       type: "API_ERROR",
    //       data: err.response.data,
    //       status: err.response.status,
    //     });
    //   }

    //   // 🔴 Request sent but no response (network issue)
    //   else if (err.request) {
    //     return rejectWithValue({
    //       type: "NETWORK_ERROR",
    //       message: "Network error, please check your internet",
    //     });
    //   }

    //   // 🔴 Something else (code crash, config issue)
    //   else {
    //     return rejectWithValue({
    //       type: "EXCEPTION",
    //       message: err.message,
    //     });
    //   }
    // }
  }}
);
// // src/redux/apiSlice.js

// // 🔹 Single dynamic POST request thunk
// export const postRequest = createAsyncThunk(
//   "api/postRequest",
//   async ({ url, data }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(url, data, {
//         headers: { "Content-Type": "application/json" },
//       });

//       return response.data;        // Success
//     } catch (err) {
//        return err;// rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
