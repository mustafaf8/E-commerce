// client/src/store/common/home-sections-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  homeSections: [], // Tüm bölümler (Admin için)
  activeHomeSections: [], // Aktif bölümler (Mağaza ana sayfası için)
  isLoading: false,
  error: null,
};

// Aktif Ana Sayfa Bölümlerini Getirme (Mağaza Kullanımı İçin)
export const fetchActiveHomeSections = createAsyncThunk(
  "homeSections/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/home-sections/active` // Backend rotasını kontrol et
      );
      return response.data; // { success: true, data: [...] } bekleniyor
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Ana sayfa bölümleri getirilemedi." }
      );
    }
  }
);

// --- Admin için CRUD Thunk'ları ---

// Tüm Ana Sayfa Bölümlerini Getirme (Admin Yönetimi İçin)
export const fetchAllHomeSections = createAsyncThunk(
  "homeSections/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/home-sections/list` // Backend rotasını kontrol et
        // Gerekirse admin token header'ı ekle
      );
      return response.data; // { success: true, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Yönetim için ana sayfa bölümleri getirilemedi.",
        }
      );
    }
  }
);

// Yeni Bölüm Ekleme (Admin)
export const addHomeSection = createAsyncThunk(
  "homeSections/add",
  async (sectionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/home-sections/add`, // Backend rotasını kontrol et
        sectionData
        // Gerekirse admin token header'ı ekle
      );
      return response.data; // { success: true, data: newSection }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Ana sayfa bölümü eklenemedi." }
      );
    }
  }
);

// Bölüm Güncelleme (Admin)
export const updateHomeSection = createAsyncThunk(
  "homeSections/update",
  async ({ id, sectionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/home-sections/update/${id}`, // Backend rotasını kontrol et
        sectionData
        // Gerekirse admin token header'ı ekle
      );
      return response.data; // { success: true, data: updatedSection }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Ana sayfa bölümü güncellenemedi." }
      );
    }
  }
);

// Bölüm Silme (Admin)
export const deleteHomeSection = createAsyncThunk(
  "homeSections/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/home-sections/delete/${id}` // Backend rotasını kontrol et
        // Gerekirse admin token header'ı ekle
      );
      return response.data; // { success: true, data: { _id: id } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Ana sayfa bölümü silinemedi." }
      );
    }
  }
);

// Bölüm Sıralamasını Güncelleme (Admin - Opsiyonel ama kullanışlı)
export const updateHomeSectionsOrder = createAsyncThunk(
  "homeSections/reorder",
  async (orderedIds, { rejectWithValue }) => {
    // orderedIds: ['id1', 'id3', 'id2'] gibi bir dizi
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/home-sections/reorder`, // Backend rotasını kontrol et
        { orderedIds } // Backend'e sıralanmış ID listesini gönder
        // Gerekirse admin token header'ı ekle
      );
      return response.data; // { success: true, data: updatedSections }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Bölüm sıralaması güncellenemedi." }
      );
    }
  }
);

const homeSectionsSlice = createSlice({
  name: "homeSections",
  initialState,
  reducers: {
    clearHomeSectionsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchActiveHomeSections (Mağaza için)
      .addCase(fetchActiveHomeSections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveHomeSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeHomeSections = action.payload?.data || [];
      })
      .addCase(fetchActiveHomeSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Aktif bölümler alınamadı.";
        state.activeHomeSections = [];
      })
      // fetchAllHomeSections (Admin için)
      .addCase(fetchAllHomeSections.pending, (state) => {
        state.isLoading = true; // Genel loading kullanılabilir veya admin için ayrı
        state.error = null;
      })
      .addCase(fetchAllHomeSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.homeSections = action.payload?.data || [];
      })
      .addCase(fetchAllHomeSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Admin için bölümler alınamadı.";
        state.homeSections = [];
      })
      // addHomeSection (Admin)
      .addCase(addHomeSection.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          state.homeSections.push(action.payload.data); // Admin listesine ekle
          // İsteğe bağlı: Eğer yeni eklenen aktifse activeHomeSections'a da ekle (ama sıralama?)
          // En iyisi listeyi tekrar çekmek olabilir.
        }
      })
      .addCase(addHomeSection.rejected, (state, action) => {
        state.error = action.payload?.message || "Bölüm eklenemedi.";
      })
      // updateHomeSection (Admin)
      .addCase(updateHomeSection.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          const index = state.homeSections.findIndex(
            (sec) => sec._id === action.payload.data._id
          );
          if (index !== -1) {
            state.homeSections[index] = action.payload.data;
          }
          // Aktif listeyi de güncellemek gerekebilir
          const activeIndex = state.activeHomeSections.findIndex(
            (sec) => sec._id === action.payload.data._id
          );
          if (activeIndex !== -1) {
            if (action.payload.data.isActive) {
              state.activeHomeSections[activeIndex] = action.payload.data;
            } else {
              state.activeHomeSections.splice(activeIndex, 1); // Aktif değilse çıkar
            }
          } else if (action.payload.data.isActive) {
            state.activeHomeSections.push(action.payload.data); // Yeni aktifleştiyse ekle (sıralama?)
          }
          // Sıralama için listeyi tekrar çekmek daha garanti olabilir.
        }
      })
      .addCase(updateHomeSection.rejected, (state, action) => {
        state.error = action.payload?.message || "Bölüm güncellenemedi.";
      })
      // deleteHomeSection (Admin)
      .addCase(deleteHomeSection.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data?._id) {
          state.homeSections = state.homeSections.filter(
            (sec) => sec._id !== action.payload.data._id
          );
          state.activeHomeSections = state.activeHomeSections.filter(
            (sec) => sec._id !== action.payload.data._id
          );
        }
      })
      .addCase(deleteHomeSection.rejected, (state, action) => {
        state.error = action.payload?.message || "Bölüm silinemedi.";
      })
      // updateHomeSectionsOrder (Admin)
      .addCase(updateHomeSectionsOrder.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          // Genellikle bu işlem sonrası listeyi tekrar çekmek en sağlıklısıdır.
          // Veya backend güncellenmiş tüm listeyi dönebilir ve onu state'e yazabiliriz.
          state.homeSections = action.payload.data; // Backend'den güncel liste geldiğini varsayalım
          state.activeHomeSections = action.payload.data.filter(
            (sec) => sec.isActive
          );
        }
      })
      .addCase(updateHomeSectionsOrder.rejected, (state, action) => {
        state.error = action.payload?.message || "Sıralama güncellenemedi.";
      });
  },
});

export const { clearHomeSectionsError } = homeSectionsSlice.actions;
export default homeSectionsSlice.reducer;
