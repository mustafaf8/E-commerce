// client/src/store/common/categories-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  categoryList: [],
  isLoading: false,
  error: null,
};

// Tüm (aktif) kategorileri getirme (Mağaza ve Admin Kullanımı için)
export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      // Backend'de tüm aktif kategorileri listeleyen endpoint'i çağır
      // Bu endpoint hem admin ürün formu hem de gerekirse başka yerler için kullanılabilir
      const response = await axios.get(
        `http://localhost:5000/api/common/categories/list` // Backend rotasını kontrol et
      );
      return response.data; // { success: true, data: [...] } bekleniyor
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kategoriler getirilemedi." }
      );
    }
  }
);

// --- Admin için CRUD Thunk'ları ---

// Yeni Kategori Ekleme (Admin)
export const addCategory = createAsyncThunk(
  "categories/add",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/categories/add`, // Backend rotasını kontrol et
        categoryData
        // Gerekirse admin token header'ı ekle
      );
      return response.data; // { success: true, data: newCategory }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kategori eklenemedi." }
      );
    }
  }
);

// Kategori Güncelleme (Admin)
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/categories/update/${id}`, // Backend rotasını kontrol et
        categoryData
        // Gerekirse admin token header'ı ekle
      );
      return response.data; // { success: true, data: updatedCategory }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kategori güncellenemedi." }
      );
    }
  }
);

// Kategori Silme (Admin)
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/categories/delete/${id}` // Backend rotasını kontrol et
        // Gerekirse admin token header'ı ekle
      );
      return response.data; // { success: true, data: { _id: id } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kategori silinemedi." }
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
      // fetchAllCategories
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
          state.categoryList.push(action.payload.data); // Yeni kategoriyi ekle
        }
        // Pending/Rejected isteğe bağlı eklenebilir (admin loading için)
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload?.message || "Kategori eklenemedi.";
      })
      // updateCategory
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          const index = state.categoryList.findIndex(
            (cat) => cat._id === action.payload.data._id
          );
          if (index !== -1) {
            state.categoryList[index] = action.payload.data; // Güncellenmiş kategoriyi yerine koy
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload?.message || "Kategori güncellenemedi.";
      })
      // deleteCategory
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data?._id) {
          state.categoryList = state.categoryList.filter(
            (cat) => cat._id !== action.payload.data._id // Silineni çıkar
          );
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload?.message || "Kategori silinemedi.";
      });
  },
});

export const { clearCategoryError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
