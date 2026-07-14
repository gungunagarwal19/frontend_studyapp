import { createSlice } from "@reduxjs/toolkit";
import { uploadFile } from "./UploadAction";

const uploadSlice = createSlice({
    name: "Upload",
    initialState: {
        loading: false,
        success: false,
        error: false,
        message: "",
        uploadedFile: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = false;
            state.message = "";
        },
        clearSuccess: (state) => {
            state.success = false;
            state.message = "";
        },
        clearLoading: (state) => {
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.message = action.payload.message || "File uploaded successfully";
                state.uploadedFile = action.payload.file || action.payload;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = true;
                state.message = action.payload || "Error in uploading!";
            });
    }
});

export const { clearError, clearSuccess, clearLoading } = uploadSlice.actions;
export default uploadSlice.reducer;