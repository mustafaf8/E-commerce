import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  categoryList: [],
  isLoading: false,
  error: null,
};

export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/common/categories/list`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kategoriler getirilemedi." }
      );
    }
  }
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/categories/add`, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kategori eklenemedi." }
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/admin/categories/update/${id}`,
        categoryData
      );
      return response.data; // { success: true, data: updatedCategory }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kategori güncellenemedi." }
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/categories/delete/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kategori silinemedi." }
      );
    }
  }
);

export const fetchAllCategoriesAdmin = createAsyncThunk(
  "categories/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/categories/list`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kategoriler getirilemedi (admin)." }
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload?.data || [];
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Kategoriler alınamadı.";
        state.categoryList = [];
      })
      // addCategory
      .addCase(addCategory.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          state.categoryList.push(action.payload.data);
        }
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload?.message || "Kategori eklenemedi.";
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          const index = state.categoryList.findIndex(
            (cat) => cat._id === action.payload.data._id
          );
          if (index !== -1) {
            state.categoryList[index] = action.payload.data;
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload?.message || "Kategori güncellenemedi.";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data?._id) {
          state.categoryList = state.categoryList.filter(
            (cat) => cat._id !== action.payload.data._id // Silineni çıkar
          );
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload?.message || "Kategori silinemedi.";
      })
      .addCase(fetchAllCategoriesAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategoriesAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload?.data || [];
      })
      .addCase(fetchAllCategoriesAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Kategoriler alınamadı (admin).";
        state.categoryList = [];
      });
  },
});

export const { clearCategoryError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
