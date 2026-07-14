import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const addSection = createAsyncThunk(
    'section/add-section', async(data, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
            const response = await axios.post(
                `${BASE_URL}/api/section/add-section`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error in Creating Section");
        }
    }
)

const getSections = createAsyncThunk(
    'section/get-sections', async(_, {rejectWithValue}) => {
        try{
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }

            const response = await axios.get(
                `${BASE_URL}/api/section/get-sections`,
                config
            )
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error in Fetching Sections");
        }
    }
)

const deleteSection = createAsyncThunk(
    'section/deleteSection', async(id, {rejectWithValue}) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
            const response = await axios.delete(
                `${BASE_URL}/api/section/delete-section/${id}`,
                config
            )
            return{ ...response.data, id};
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error in deleting section");
        }
    }
)

export { addSection, getSections, deleteSection };