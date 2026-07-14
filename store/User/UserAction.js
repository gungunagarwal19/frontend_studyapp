import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const initiateSignup = createAsyncThunk(
    "user/initiateSignup",
    async (data, { rejectWithValue }) => {
        try {
            const config = { 
                headers: { 
                    "Content-Type": "application/json"
                },
                withCredentials: true 
            };
            const response = await axios.post(
                `${BASE_URL}/api/user/signup/initiate`,
                data,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const verifyOtp = createAsyncThunk(
    "user/verifyOtp",
    async (data, { rejectWithValue }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };
            const response = await axios.post(
                `${BASE_URL}/api/user/signup/verify-otp`,
                data,
                config
            );
            
            if (response.data.success) {
                return {
                    message: response.data.message,
                    token: response?.data?.token
                };
            } else {
                return rejectWithValue("Invalid OTP verification response");
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const saveUser = createAsyncThunk(
    "user/saveUser",
    async (data, { rejectWithValue }) => {
        try {
            if (!data.token) {
                return rejectWithValue("Verification token is required");
            }

            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            };

            const response = await axios.post(
                `${BASE_URL}/api/user/signup/save-user`,
                data,
                config
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const logIn = createAsyncThunk("user/logIn",
    async (data, {rejectWithValue}) => {
        try {
            const config = {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            }

            const response = await axios.post(
                `${BASE_URL}/api/user/logIn`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || "Error in Logging In");
        }
    }
)

const logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/user/logout`,
                {},
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || "Error during logout");
        }
    }
);

const getCurrentUser = createAsyncThunk(
    "user/getCurrentUser",
    async (_, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true,
        };
        const response = await axios.get(`${BASE_URL}/api/user/getProfile`, config);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Error fetching user");
      }
    }
  );

export { initiateSignup, verifyOtp, saveUser, logIn, logout, getCurrentUser };
