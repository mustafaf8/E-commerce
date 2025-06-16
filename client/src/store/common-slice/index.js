import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  isLoading: false,
  featureImageList: [],
  error: null,
};

export const getFeatureImages = createAsyncThunk(
  "commonFeature/getFeatureImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/common/feature/get`);
      if (response.data && response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data || { message: "Banner verisi alınamadı." }
        );
      }
    } catch (error) {
      console.error(
        "getFeatureImages API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Bannerlar getirilemedi." }
      );
    }
  }
);

export const addFeatureImage = createAsyncThunk(
  "commonFeature/addFeatureImage",
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/common/feature/add`, bannerData);
      if (response.data && response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data || { message: "Banner eklenemedi." }
        );
      }
    } catch (error) {
      console.error(
        "addFeatureImage API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Banner eklenemedi." }
      );
    }
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "commonFeature/deleteFeatureImage",
  async (bannerId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/common/feature/delete/${bannerId}`);
      if (response.data && response.data.success) {
        return { success: true, data: { _id: bannerId } };
      } else {
        return rejectWithValue(
          response.data || { message: "Banner silinemedi." }
        );
      }
    } catch (error) {
      console.error(
        "deleteFeatureImage API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Banner silinemedi." }
      );
    }
  }
);

const commonSlice = createSlice({
  name: "commonFeature",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload?.data || [];
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
        state.featureImageList = [];
      })

      .addCase(addFeatureImage.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          state.featureImageList.push(action.payload.data);
          state.error = null;
        }
      })
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
        console.error("Banner ekleme hatası (Redux):", state.error);
      })

      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data?._id) {
          state.featureImageList = state.featureImageList.filter(
            (banner) => banner._id !== action.payload.data._id
          );
          state.error = null;
        }
      })
      .addCase(deleteFeatureImage.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
        console.error("Banner silme hatası (Redux):", state.error);
      });
  },
});

export default commonSlice.reducer;
