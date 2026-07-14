import { createSlice } from "@reduxjs/toolkit";
import {addSection, getSections, deleteSection} from './SectionAction';

const sectionSlice = createSlice({
    name: "Section",
    initialState: {
        loading: false,
        success: false,
        error: false,
        message: "",
        sections: [],
        currentSection: null,
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
        },
        clearSections: (state) => {  // Add this new reducer
            state.sections = [];
            state.currentSection = null;
            state.error = false;
            state.success = false;
            state.message = "";
        }
    }, 

    extraReducers: (builder) => {
        builder

            .addCase(addSection.pending, (state)=> {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(addSection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.message = action.payload.message;
                state.sections.push(action.payload.section);
                state.currentSection = action.payload.section;
            })
            .addCase(addSection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = true;
                state.message = action.payload;
            })

            .addCase(getSections.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(getSections.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.message = action.payload.message;
                state.sections = action.payload.sections;
            })
            .addCase(getSections.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload;
                state.error = true;
                state.success = false;
            })

            .addCase(deleteSection.pending, (state) => {
                state.loading = true;
                state.error = false;
                state.success = false;
                state.message = "";
            })
            .addCase(deleteSection.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.message = action.payload.message;
                state.sections = state.sections.filter(
                    section => (section._id || section.id) !== action.payload.id
                );
            })
            .addCase(deleteSection.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = true;
                state.message = action.payload;
            })
    }
});



export const {
    clearError,
    clearLoading,
    clearSuccess, 
    clearSections
} = sectionSlice.actions;

export default sectionSlice.reducer;