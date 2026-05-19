// src/redux/apiSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {success,fail} from "./WebTostar"
import Cookies from "js-cookie";

// 🔹 Single dynamic POST request thunk
export const MultipartPostRequest = createAsyncThunk(
  "api/MultipartPostRequest",
  async ({ url, data }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
         
      const response = await axios.post(url, data, {
          headers: { "Content-Type": "multipart/form-data",
         },
      });

      return response.data;        // Success
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
