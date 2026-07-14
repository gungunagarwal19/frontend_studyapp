import { createSlice } from "@reduxjs/toolkit";
import { fetchReviewCards, swipeFlashCard } from "./FlashCardAction";

const initialState = {
  loading: false,
  error: false,
  success: false,
  message: "",
  reviewCards: [],
  currentCard: null,
  remainingCardIds: [],
};

const flashCardSlice = createSlice({
  name: "FlashCard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = false;
      state.message = "";
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetReview: (state) => {
      state.reviewCards = [];
      state.currentCard = null;
      state.remainingCardIds = [];
      state.success = false;
      state.error = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewCards.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.message = "";
      })
      .addCase(fetchReviewCards.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.message = action.payload.message || "";
        state.reviewCards = action.payload.flashcards || [];
        state.currentCard = action.payload.flashcards?.[0] || null;
        state.remainingCardIds = (action.payload.flashcards || []).map(card => card._id).slice(1);
      })
      .addCase(fetchReviewCards.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message = action.payload || "Error fetching review cards";
      })
      .addCase(swipeFlashCard.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(swipeFlashCard.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = false;
        state.message = action.payload.message || "";

     
        if (state.reviewCards && state.reviewCards.length > 0) {
          state.reviewCards = state.reviewCards.slice(1);
        }

        if (action.payload.nextCard) {
          state.reviewCards.push(action.payload.nextCard);
          state.currentCard = action.payload.nextCard;
        } else {
          state.currentCard = null;
        }

      })
      .addCase(swipeFlashCard.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        state.message = action.payload || "Error swiping card";
      });
  },
});

export const { clearError, clearSuccess, resetReview } = flashCardSlice.actions;
export default flashCardSlice.reducer;
