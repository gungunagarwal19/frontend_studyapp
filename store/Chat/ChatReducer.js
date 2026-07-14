import { createSlice } from "@reduxjs/toolkit";
import { Chat } from "./ChatAction";

const initialState = {
    loading: false,
    error: false,
    success: false,
    message: "",
    chatMessages: [],
};

const chatSlice = createSlice({
    name: "Chat",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = false;
            state.message = "";
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearMessages: (state) => {
            state.chatMessages = [];
        },
        addMessage: (state, action) => {
            state.chatMessages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(Chat.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(Chat.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.message = action.payload.message || "";
                state.chatMessages.push({
                    type: "answer",
                    text: action.payload.answer || "",
                });
            })
            .addCase(Chat.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = true;
                state.message = action.payload?.message || "Error in chat operation";
            });
    },
});

export const {
    clearError,
    clearSuccess,
    clearMessages,
    addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
