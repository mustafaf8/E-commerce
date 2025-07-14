import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const fetchCampaignCoupons = createAsyncThunk(
  "campaignCoupons/fetchCampaignCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/shop/coupons/campaigns");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

const initialState = {
  coupons: [],
  isLoading: false,
  error: null,
};

const campaignCouponsSlice = createSlice({
  name: "campaignCoupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaignCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaignCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload.data || [];
      })
      .addCase(fetchCampaignCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Kampanya kuponları yüklenemedi";
      });
  },
});

export default campaignCouponsSlice.reducer;
