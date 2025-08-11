import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axiosInstance";

const initialState = {
  isLoading: false,
  reviews: [],
  isAddingReview: false,
  addReviewError: null,
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await api.post(`/shop/review/add`, formdata);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ success: false, message: error.message });
      }
    }
  }
);

export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/review/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ success: false, message: error.message });
      }
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
      })

      .addCase(addReview.pending, (state) => {
        state.isAddingReview = true;
        state.addReviewError = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isAddingReview = false;
        if (action.payload?.success && action.payload?.data) {
          state.reviews.push(action.payload.data);
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isAddingReview = false;
        state.addReviewError =
          action.payload?.message ||
          action.error.message ||
          "Unknown error adding review";

      });
  },
});

export default reviewSlice.reducer;
