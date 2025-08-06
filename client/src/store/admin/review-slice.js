import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";

// Async thunks
export const fetchAllReviewsAdmin = createAsyncThunk(
  "adminReviews/fetchAllReviewsAdmin",
  async (status = "all", { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/reviews${status !== "all" ? `?status=${status}` : ""}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Yorumlar getirilemedi");
    }
  }
);

export const updateReviewStatusAdmin = createAsyncThunk(
  "adminReviews/updateReviewStatusAdmin",
  async ({ reviewId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/reviews/${reviewId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Yorum durumu güncellenemedi");
    }
  }
);

export const deleteReviewAdmin = createAsyncThunk(
  "adminReviews/deleteReviewAdmin",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/reviews/${reviewId}`);
      return { reviewId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Yorum silinemedi");
    }
  }
);

const initialState = {
  reviews: [],
  isLoading: false,
  error: null,
  currentFilter: "all"
};

const adminReviewSlice = createSlice({
  name: "adminReviews",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentFilter: (state, action) => {
      state.currentFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    // fetchAllReviewsAdmin
    builder
      .addCase(fetchAllReviewsAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllReviewsAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.result;
        state.error = null;
      })
      .addCase(fetchAllReviewsAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // updateReviewStatusAdmin
    builder
      .addCase(updateReviewStatusAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReviewStatusAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedReview = action.payload.result;
        const index = state.reviews.findIndex(review => review._id === updatedReview._id);
        if (index !== -1) {
          state.reviews[index] = updatedReview;
        }
        state.error = null;
      })
      .addCase(updateReviewStatusAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // deleteReviewAdmin
    builder
      .addCase(deleteReviewAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReviewAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedReviewId = action.payload.reviewId;
        state.reviews = state.reviews.filter(review => review._id !== deletedReviewId);
        state.error = null;
      })
      .addCase(deleteReviewAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setCurrentFilter } = adminReviewSlice.actions;
export default adminReviewSlice.reducer; 