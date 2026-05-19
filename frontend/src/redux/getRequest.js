// src/redux/apiSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// 🔹 Dynamic GET request thunk
export const getRequest = createAsyncThunk(
  "api/getRequest",
  async ({ url, params }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      // ✅ GET request with optional query parameters
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" ,
        Authorization: `Bearer ${token}` 
        },
        params: params || {}, // optional query parameters
        responseType: "blob"
      });

      return response.data; // Success

    } catch (err) {

      // 🔴 API responded with error (like 400, 500)
      if (err.response) {
        return rejectWithValue({
          type: "API_ERROR",
          data: err.response.data,
          status: err.response.status,
        });
      }

      // 🔴 Request sent but no response (network issue)
      else if (err.request) {
        return rejectWithValue({
          type: "NETWORK_ERROR",
          message: "Network error, please check your internet",
        });
      }

      // 🔴 Something else (code crash, config issue)
      else {
        return rejectWithValue({
          type: "EXCEPTION",
          message: err.message,
        });
      }
    }
  }
);