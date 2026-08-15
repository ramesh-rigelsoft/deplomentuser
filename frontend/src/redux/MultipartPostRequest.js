// src/redux/apiSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {success,fail} from "./WebTostar"
import Cookies from "js-cookie";
export const MultipartPostRequest = createAsyncThunk(
  "api/MultipartPostRequest",
  async ({ url, data }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      if (token && token !== "undefined" && token !== "null") {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(url, data, {
        headers,
      });

      return response.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: err.message
        }
      );
    }
  }
);

// 🔹 Single dynamic POST request thunk
// export const MultipartPostRequest = createAsyncThunk(
//   "api/MultipartPostRequest",
//   async ({ url, data }, { rejectWithValue }) => {
//     try {
//       const token = Cookies.get("token");
         
//       const response = await axios.post(url, data, {
//           headers: { "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}` 
//          },
         
         
//       });

//       return response.data;        // Success
//     } catch (err) {
//       return rejectWithValue(err.response || err.message);
//     }
//   }
// );
