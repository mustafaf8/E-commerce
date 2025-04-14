// client/src/store/common-slice/promo-card-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  promoCardList: [],
  isLoading: false,
  error: null,
};

// --- Async Thunks ---

export const fetchPromoCards = createAsyncThunk(
  "promoCards/fetchPromoCards",
  async (_, { rejectWithValue }) => {
    // İlk parametreye ihtiyaç yoksa _ kullanın
    try {
      // Varsayımsal Backend Endpoint: Tüm promo kartlarını getirir
      const response = await axios.get(
        `http://localhost:5000/api/common/promo-cards/get`
      );
      // Yanıtın { success: true, data: [{ _id: '...', image: '...', title: '...', link: '...' }, ...] } formatında olduğunu varsayalım
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Promosyon kartları getirilemedi." }
      );
    }
  }
);

// Sadece Admin kullanacak
export const addPromoCard = createAsyncThunk(
  "promoCards/addPromoCard",
  async (promoData, { rejectWithValue }) => {
    // promoData = { image: 'url', title: '...', link: '...' }
    try {
      // Varsayımsal Backend Endpoint: Yeni promo kartı ekler
      const response = await axios.post(
        `http://localhost:5000/api/common/promo-cards/add`,
        promoData
        // Gerekirse admin yetkilendirmesi için header ekleyin
        // { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      return response.data; // { success: true, data: { ...yeni kart... } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Promosyon kartı eklenemedi." }
      );
    }
  }
);

// Sadece Admin kullanacak
export const deletePromoCard = createAsyncThunk(
  "promoCards/deletePromoCard",
  async (cardId, { rejectWithValue }) => {
    try {
      // Varsayımsal Backend Endpoint: Promo kartını siler
      const response = await axios.delete(
        `http://localhost:5000/api/common/promo-cards/delete/${cardId}`
        // { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      // Başarılı silme sonrası ID'yi döndürelim ki state'den çıkarabilelim
      return { success: true, data: { _id: cardId } }; // response.data yerine kendimiz oluşturduk
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Promosyon kartı silinemedi." }
      );
    }
  }
);

// --- Slice Definition ---
const promoCardSlice = createSlice({
  name: "promoCards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPromoCards
      .addCase(fetchPromoCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromoCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.promoCardList = action.payload?.data || [];
      })
      .addCase(fetchPromoCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
        state.promoCardList = [];
      })
      // addPromoCard
      .addCase(addPromoCard.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          state.promoCardList.push(action.payload.data); // Yeni kartı listeye ekle
          state.error = null; // Başarılı eklemede hatayı temizle
        }
        // Pending/Rejected durumları isteğe bağlı eklenebilir (örn. admin panelinde loading göstermek için)
      })
      .addCase(addPromoCard.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message; // Hata mesajını state'e yaz
        console.error("Promo kart ekleme hatası:", state.error);
      })
      // deletePromoCard
      .addCase(deletePromoCard.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data?._id) {
          // Silinen kartı listeden çıkar
          state.promoCardList = state.promoCardList.filter(
            (card) => card._id !== action.payload.data._id
          );
          state.error = null;
        }
      })
      .addCase(deletePromoCard.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
        console.error("Promo kart silme hatası:", state.error);
      });
  },
});

export default promoCardSlice.reducer;
