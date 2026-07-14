import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchReviewCards = createAsyncThunk(
  'flashcard/fetchReviewCards',
  async ({ sectionId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/flashcards/review`,
        { sectionId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch review cards');
    }
  }
);

export const swipeFlashCard = createAsyncThunk(
  'flashcard/swipeFlashCard',
  async ({ currentCardId, swipe, sectionId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/flashcards/swipeCard`,
        { currentCardId, swipe, sectionId },
        { 
            headers: { 
                    'Content-Type': 'application/json' 
            } 
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to swipe card');
    }
  }
);
