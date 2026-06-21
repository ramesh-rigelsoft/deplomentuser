import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

export const branchApiRequest = createAsyncThunk(
"api/postRequest",
async ({ domain, endpoint, data }, { rejectWithValue }) => {
try {
  const finalUrl = endpoint.replace(
    "http://localhost:8089",
    "http://localhost:8088"
  );
const token = Cookies.get("token");

  const response = await axios.post(
    finalUrl,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        multipleBranch: "false",
        branchCode: "",
      },
    }
  );

  return response.data;
} catch (err) {
  console.log(err);
  if (err.response) {
    return rejectWithValue({
      status: err.response.status,
      data: err.response.data,
    });
  }

  return rejectWithValue({
    message: err.message,
  });
}

}
);
