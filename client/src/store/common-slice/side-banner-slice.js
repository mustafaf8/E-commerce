// client/src/store/common-slice/side-banner-slice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  sideBannerList: [],
  isLoading: false,
  error: null,
};

// --- Async Thunks ---

// Yan banner'ları getirme (Mevcut Thunk)
export const fetchSideBanners = createAsyncThunk(
  "sideBanners/fetchSideBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/common/side-banners/get` // Endpoint'i kontrol edin
      );
      if (response.data && response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data || { message: "Yan banner verisi alınamadı." }
        );
      }
    } catch (error) {
      console.error(
        "fetchSideBanners API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Yan bannerlar getirilemedi." }
      );
    }
  }
);

// !!! YENİ THUNK: Yan banner ekleme !!!
export const addSideBanner = createAsyncThunk(
  "sideBanners/addSideBanner",
  async (bannerData, { rejectWithValue }) => {
    // bannerData = { image: 'url', title: '...', link: '...' }
    try {
      // !!! BURAYI DEĞİŞTİRİN: Backend API endpoint'inizin doğru adresini yazın !!!
      const response = await axios.post(
        `http://localhost:5000/api/common/side-banners/add`,
        bannerData
        // Gerekirse admin yetkilendirmesi için header ekleyin
        // { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      // Başarılı yanıt: { success: true, data: { ...yeni banner... } }
      if (response.data && response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(
          response.data || { message: "Yan banner eklenemedi." }
        );
      }
    } catch (error) {
      console.error(
        "addSideBanner API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Yan banner eklenemedi." }
      );
    }
  }
);

// !!! YENİ THUNK: Yan banner silme !!!
export const deleteSideBanner = createAsyncThunk(
  "sideBanners/deleteSideBanner",
  async (bannerId, { rejectWithValue }) => {
    try {
      // !!! BURAYI DEĞİŞTİRİN: Backend API endpoint'inizin doğru adresini yazın !!!
      const response = await axios.delete(
        `http://localhost:5000/api/common/side-banners/delete/${bannerId}`
        // { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      // Başarılı yanıt: { success: true } (veya silinen ID'yi dönebilir)
      if (response.data && response.data.success) {
        // Başarılı silme sonrası ID'yi döndürelim ki state'den çıkarabilelim
        return { success: true, data: { _id: bannerId } };
      } else {
        return rejectWithValue(
          response.data || { message: "Yan banner silinemedi." }
        );
      }
    } catch (error) {
      console.error(
        "deleteSideBanner API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Yan banner silinemedi." }
      );
    }
  }
);

// --- Slice Definition ---
const sideBannerSlice = createSlice({
  name: "sideBanners",
  initialState,
  reducers: {
    /* ... */
  },
  extraReducers: (builder) => {
    builder
      // fetchSideBanners Cases (Mevcut)
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

      // !!! YENİ CASE'LER: addSideBanner !!!
      .addCase(addSideBanner.fulfilled, (state, action) => {
        // Başarılı eklemede gelen yeni banner'ı listeye ekle
        if (action.payload?.success && action.payload?.data) {
          state.sideBannerList.push(action.payload.data);
          state.error = null; // Hata varsa temizle
        }
        // Pending/rejected durumları isteğe bağlı olarak eklenebilir (UI'da loading göstermek için)
      })
      .addCase(addSideBanner.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message; // Hata mesajını state'e yaz
        console.error("Yan banner ekleme hatası:", state.error);
      })

      // !!! YENİ CASE'LER: deleteSideBanner !!!
      .addCase(deleteSideBanner.fulfilled, (state, action) => {
        // Başarılı silme sonrası ilgili banner'ı listeden çıkar
        if (action.payload?.success && action.payload?.data?._id) {
          state.sideBannerList = state.sideBannerList.filter(
            (banner) => banner._id !== action.payload.data._id
          );
          state.error = null; // Hata varsa temizle
        }
      })
      .addCase(deleteSideBanner.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
        console.error("Yan banner silme hatası:", state.error);
      });
  },
});

export default sideBannerSlice.reducer;

// Thunk'ları da export edebilirsiniz (opsiyonel)
// export { fetchSideBanners, addSideBanner, deleteSideBanner };
