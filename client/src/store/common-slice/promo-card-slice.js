import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  promoCardList: [],
  isLoading: false,
  error: null,
};

export const fetchPromoCards = createAsyncThunk(
  "promoCards/fetchPromoCards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/common/promo-cards/get`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Promosyon kartları getirilemedi." }
      );
    }
  }
);

export const addPromoCard = createAsyncThunk(
  "promoCards/addPromoCard",
  async (promoData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/common/promo-cards/add`, promoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Promosyon kartı eklenemedi." }
      );
    }
  }
);

export const deletePromoCard = createAsyncThunk(
  "promoCards/deletePromoCard",
  async (cardId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/common/promo-cards/delete/${cardId}`);
      return { success: true, data: { _id: cardId } };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Promosyon kartı silinemedi." }
      );
    }
  }
);

const promoCardSlice = createSlice({
  name: "promoCards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(addPromoCard.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data) {
          state.promoCardList.push(action.payload.data);
          state.error = null;
        }
      })
      .addCase(addPromoCard.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
        console.error("Promo kart ekleme hatası:", state.error);
      })
      // deletePromoCard
      .addCase(deletePromoCard.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data?._id) {
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
