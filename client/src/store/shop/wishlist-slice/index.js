import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axiosInstance";
import { logoutUser } from "../../auth-slice";

const initialState = {
  wishlistItems: [],
  isLoading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/wishlist/get/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Favoriler getirilemedi." }
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/shop/wishlist/add`,
        { userId, productId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Favorilere eklenemedi." }
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/shop/wishlist/remove/${userId}/${productId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Favorilerden çıkarılamadı." }
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.wishlistItems = [];
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("wishlist/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("wishlist/") &&
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.isLoading = false;
          if (action.type === fetchWishlist.fulfilled.type) {
            state.wishlistItems =
              action.payload?.data?.map((item) => item.productId) || [];
          }
          if (
            action.type === addToWishlist.fulfilled.type &&
            action.payload?.data?.productId
          ) {
            if (!state.wishlistItems.includes(action.payload.data.productId)) {
              state.wishlistItems.push(action.payload.data.productId);
            }
          }
          if (
            action.type === removeFromWishlist.fulfilled.type &&
            action.payload?.data?.productId
          ) {
            state.wishlistItems = state.wishlistItems.filter(
              (id) => id !== action.payload.data.productId
            );
          }
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("wishlist/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.payload?.message ||
            action.error.message ||
            "Bir hata oluştu.";
        }
      );
  },
});

export default wishlistSlice.reducer;
