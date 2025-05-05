// client/src/store/common/brands-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  brandList: [],
  isLoading: false, // Genel listeleme yüklenmesi için
  isProcessing: false, // Ekleme/Güncelleme/Silme işlemleri için ayrı loading state'i
  error: null,
};

// --- Public/Common Thunk ---

// Aktif Markaları Getirme (Frontend Kullanımı)
export const fetchAllBrands = createAsyncThunk(
  "brands/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/common/brands/list`
      );
      return response.data; // { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Markalar getirilemedi." }
      );
    }
  }
);

// --- Admin için CRUD Thunk'ları ---

// Yeni Marka Ekleme (Admin)
export const addBrand = createAsyncThunk(
  "brands/add",
  async (brandData, { rejectWithValue }) => {
    try {
      // brandData: { name: '...', slug: '...', isActive: ... }
      const response = await axios.post(
        `http://localhost:5000/api/admin/brands/add`, // Admin endpoint'ini kullan
        brandData
        // Gerekirse admin token header'ı eklenecek (axios interceptor ile?)
      );
      return response.data; // { success: true, data: newBrand }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Marka eklenemedi." }
      );
    }
  }
);

// Marka Güncelleme (Admin)
export const updateBrand = createAsyncThunk(
  "brands/update",
  async ({ id, brandData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/brands/update/${id}`, // Admin endpoint'ini kullan
        brandData
        // Gerekirse admin token header'ı eklenecek
      );
      return response.data; // { success: true, data: updatedBrand }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Marka güncellenemedi." }
      );
    }
  }
);

// Marka Silme (Admin)
export const deleteBrand = createAsyncThunk(
  "brands/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/brands/delete/${id}` // Admin endpoint'ini kullan
        // Gerekirse admin token header'ı eklenecek
      );
      return response.data; // { success: true, data: { _id: id } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Marka silinemedi." }
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
      // fetchAllBrands (Listeleme)
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

      // addBrand (Admin İşlemi)
      .addCase(addBrand.pending, (state) => {
        state.isProcessing = true; // İşlem başlıyor
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.isProcessing = false;
        if (action.payload?.success && action.payload?.data) {
          state.brandList.push(action.payload.data); // Yeni markayı listeye ekle
          // Listeyi isim sırasına göre tekrar sıralayabiliriz (opsiyonel)
          state.brandList.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          // Backend success:false döndürdüyse hatayı state'e yaz
          state.error =
            action.payload?.message || "Marka eklenemedi (backend).";
        }
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.isProcessing = false;
        state.error =
          action.payload?.message || "Marka eklenirken bir hata oluştu.";
      })

      // updateBrand (Admin İşlemi)
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
            state.brandList[index] = action.payload.data; // Güncellenmiş markayı yerine koy
            state.brandList.sort((a, b) => a.name.localeCompare(b.name)); // Sıralamayı koru
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

      // deleteBrand (Admin İşlemi)
      .addCase(deleteBrand.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.isProcessing = false;
        if (action.payload?.success && action.payload?.data?._id) {
          state.brandList = state.brandList.filter(
            (brand) => brand._id !== action.payload.data._id // Silineni listeden çıkar
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
      });
  },
});

export const { clearBrandError } = brandsSlice.actions;
export default brandsSlice.reducer;
