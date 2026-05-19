import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 First API call
export const loginApi = createAsyncThunk("data/loginApi", async () => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  return res.data;
});

export const logoutApi = createAsyncThunk("data/logoutApi", async () => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  return res.data;
});


// 🔹 Second API call
export const signupApi = createAsyncThunk("data/signupApi",async (requestedData, { rejectWithValue }) => {
    try {
      // userData will be the payload passed from component
      const res = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        requestedData, // 👈 this is the POST body
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Third API call
export const fetchComments = createAsyncThunk("data/fetchComments", async () => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/comments");
  return res.data;
});

const apiAlice = createSlice({
  name: "data",
  initialState: {
    users: [],
    posts: [],
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🧠 Users //login
      .addCase(loginApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginApi.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(loginApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

       // 🧠 Users //logout
      .addCase(logoutApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutApi.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(logoutApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🧠 Posts
      .addCase(signupApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupApi.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(signupApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 🧠 Comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default apiAlice.reducer;
