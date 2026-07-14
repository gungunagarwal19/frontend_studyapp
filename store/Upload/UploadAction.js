import { createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const uploadFile = createAsyncThunk(
    'upload/uploadfiles', async ({ file, sectionId }, {rejectWithValue}) => {
        try {

            const formData = new FormData();
            formData.append('file', file);
            formData.append('sectionId', sectionId); 

            const response = await axios.post(
                `${BASE_URL}/api/upload/uploadFile`,
                formData
            )

            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || "Error in uploading!")
        }
    }
)

export {uploadFile};