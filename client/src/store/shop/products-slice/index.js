import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/axiosInstance";

const initialState = {
  productList: [],
  productDetails: null,
  isLoading: false,
  isDetailsLoading: false,
  error: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }, { rejectWithValue }) => {
    try {
      const params = {};
      Object.keys(filterParams || {}).forEach((key) => {
        const value = filterParams[key];
        if (Array.isArray(value)) {
          if (value.length > 0) params[key] = value.join(",");
        } else if (value !== undefined && value !== "") {
          params[key] = value;
        }
      });
      params.sortBy = sortParams;

      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/shop/products/get?${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Ürünler getirilemedi." }
      );
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/products/get/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Ürün detayı alınamadı." }
      );
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success) {
          state.productList = action.payload.data;
        } else {
          state.productList = [];
          state.error = action.payload?.message || "Ürünler alınamadı.";
        }
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload?.message || "Bir hata oluştu.";
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.isDetailsLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        if (action.payload?.success) {
          state.productDetails = action.payload.data;
        } else {
          state.productDetails = null;
          state.error = action.payload?.message || "Detaylar alınamadı.";
        }
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.productDetails = null;
        state.error = action.payload?.message || "Bir hata oluştu.";
      });
  },
});

export const { setProductDetails, clearProductError } =
  shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
