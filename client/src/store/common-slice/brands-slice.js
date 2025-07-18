import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  brandList: [],
  isLoading: false,
  isProcessing: false,
  error: null,
};

export const fetchAllBrands = createAsyncThunk(
  "brands/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/common/brands/list`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Markalar getirilemedi." }
      );
    }
  }
);

export const addBrand = createAsyncThunk(
  "brands/add",
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/brands/add`, brandData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Marka eklenemedi." }
      );
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brands/update",
  async ({ id, brandData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/brands/update/${id}`, brandData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Marka güncellenemedi." }
      );
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brands/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/brands/delete/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Marka silinemedi." }
      );
    }
  }
);

export const fetchAllBrandsAdmin = createAsyncThunk(
  "brands/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/brands/list`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Markalar getirilemedi (admin)." }
      );
    }
  }
);

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    clearBrandError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandList = action.payload?.data || [];
      })
      .addCase(fetchAllBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Markalar alınamadı.";
        state.brandList = [];
      })

      .addCase(addBrand.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.isProcessing = false;
        if (action.payload?.success && action.payload?.data) {
          state.brandList.push(action.payload.data);
          state.brandList.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          state.error =
            action.payload?.message || "Marka eklenemedi (backend).";
        }
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.isProcessing = false;
        state.error =
          action.payload?.message || "Marka eklenirken bir hata oluştu.";
      })

      .addCase(updateBrand.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.isProcessing = false;
        if (action.payload?.success && action.payload?.data) {
          const index = state.brandList.findIndex(
            (brand) => brand._id === action.payload.data._id
          );
          if (index !== -1) {
            state.brandList[index] = action.payload.data;
            state.brandList.sort((a, b) => a.name.localeCompare(b.name));
          }
        } else {
          state.error =
            action.payload?.message || "Marka güncellenemedi (backend).";
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.isProcessing = false;
        state.error =
          action.payload?.message || "Marka güncellenirken bir hata oluştu.";
      })

      .addCase(deleteBrand.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.isProcessing = false;
        if (action.payload?.success && action.payload?.data?._id) {
          state.brandList = state.brandList.filter(
            (brand) => brand._id !== action.payload.data._id
          );
        } else {
          state.error =
            action.payload?.message || "Marka silinemedi (backend).";
        }
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.isProcessing = false;
        state.error =
          action.payload?.message || "Marka silinirken bir hata oluştu.";
      })

      .addCase(fetchAllBrandsAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBrandsAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandList = action.payload?.data || [];
      })
      .addCase(fetchAllBrandsAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Markalar alınamadı (admin).";
        state.brandList = [];
      });
  },
});

export const { clearBrandError } = brandsSlice.actions;
export default brandsSlice.reducer;
