import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Tüm kuponları getir
export const fetchCoupons = createAsyncThunk(
  "adminCoupons/fetchCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/coupons");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Yeni kupon oluştur
export const createCoupon = createAsyncThunk(
  "adminCoupons/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/coupons", couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Kupon güncelle
export const updateCoupon = createAsyncThunk(
  "adminCoupons/updateCoupon",
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/coupons/${id}`, couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Kupon sil
export const deleteCoupon = createAsyncThunk(
  "adminCoupons/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/coupons/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Kupon durumunu değiştir
export const toggleCouponStatus = createAsyncThunk(
  "adminCoupons/toggleCouponStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/coupons/${id}/toggle`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  coupons: [],
  isLoading: false,
  error: null,
};

const adminCouponSlice = createSlice({
  name: "adminCoupons",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload.data || [];
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Kuponlar yüklenemedi";
      })
      
      // Create Coupon
      .addCase(createCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons.unshift(action.payload.data);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Kupon oluşturulamadı";
      })
      
      // Update Coupon
      .addCase(updateCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.coupons.findIndex(
          (coupon) => coupon._id === action.payload.data._id
        );
        if (index !== -1) {
          state.coupons[index] = action.payload.data;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Kupon güncellenemedi";
      })
      
      // Delete Coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = state.coupons.filter(
          (coupon) => coupon._id !== action.payload.id
        );
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Kupon silinemedi";
      })
      
      // Toggle Coupon Status
      .addCase(toggleCouponStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(
          (coupon) => coupon._id === action.payload.data._id
        );
        if (index !== -1) {
          state.coupons[index] = action.payload.data;
        }
      })
      .addCase(toggleCouponStatus.rejected, (state, action) => {
        state.error = action.payload?.message || "Kupon durumu değiştirilemedi";
      });
  },
});

export const { clearError } = adminCouponSlice.actions;
export default adminCouponSlice.reducer; 