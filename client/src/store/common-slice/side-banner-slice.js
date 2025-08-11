import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  sideBannerList: [],
  isLoading: false,
  error: null,
};

export const fetchSideBanners = createAsyncThunk(
  "sideBanners/fetchSideBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/common/side-banners/get`);
      if (response.data && response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data || { message: "Yan banner verisi alınamadı." }
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Yan bannerlar getirilemedi." }
      );
    }
  }
);

export const addSideBanner = createAsyncThunk(
  "sideBanners/addSideBanner",
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/common/side-banners/add`, bannerData);
      if (response.data && response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data || { message: "Yan banner eklenemedi." }
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Yan banner eklenemedi." }
      );
    }
  }
);
export const updateSideBanner = createAsyncThunk(
  "sideBanners/updateSideBanner",
  async ({ bannerId, bannerData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/common/side-banners/update/${bannerId}`, bannerData);
      if (response.data && response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data || { message: "Yan banner güncellenemedi." }
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Yan banner güncellenemedi." }
      );
    }
  }
);

export const deleteSideBanner = createAsyncThunk(
  "sideBanners/deleteSideBanner",
  async (bannerId, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/common/side-banners/delete/${bannerId}`
      );
      if (response.data && response.data.success) {
        return { success: true, data: { _id: bannerId } };
      } else {
        return rejectWithValue(
          response.data || { message: "Yan banner silinemedi." }
        );
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Yan banner silinemedi." }
      );
    }
  }
);
const sideBannerSlice = createSlice({
  name: "sideBanners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSideBanners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSideBanners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sideBannerList = action.payload?.data || [];
      })
      .addCase(fetchSideBanners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
        state.sideBannerList = [];
      })
      .addCase(addSideBanner.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          state.sideBannerList.push(action.payload.data);
          state.error = null;
        }
      })
      .addCase(addSideBanner.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateSideBanner.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          const index = state.sideBannerList.findIndex(
            (banner) => banner._id === action.payload.data._id
          );
          if (index !== -1) {
            state.sideBannerList[index] = action.payload.data;
          }
          state.error = null;
        }
      })
      .addCase(updateSideBanner.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(deleteSideBanner.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data?._id) {
          state.sideBannerList = state.sideBannerList.filter(
            (banner) => banner._id !== action.payload.data._id
          );
          state.error = null;
        }
      })
      .addCase(deleteSideBanner.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default sideBannerSlice.reducer;


