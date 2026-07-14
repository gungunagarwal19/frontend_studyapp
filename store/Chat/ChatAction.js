import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const Chat = createAsyncThunk(
    'chat/askQuestions', async ({ question, sectionId }, {rejectWithValue}) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/upload/answer`,
                { question, sectionId },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            return {
                answer: response.data.answer,
                message: response.data.message
            };
        } catch (error) {
            return rejectWithValue(error.message || "Error in generating Response!")
        }
    }
)

export {Chat};