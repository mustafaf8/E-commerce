// client/src/store/shop/wishlist-slice/index.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  wishlistItems: [], // Favori ürünlerin ID'lerini veya tüm ürün nesnelerini tutabiliriz. Şimdilik ID'leri tutalım.
  isLoading: false,
  error: null,
};

// --- Async Thunks ---

// Kullanıcının favori listesini getirme
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      // Varsayımsal Backend Endpoint: Kullanıcının favorilerini getirir
      const response = await axios.get(
        `http://localhost:5000/api/shop/wishlist/get/${userId}`,
        { withCredentials: true }
      );
      // Yanıtın { success: true, data: [{ productId: '...', ... }, ...] } formatında olduğunu varsayalım
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Favoriler getirilemedi." }
      );
    }
  }
);

// Ürünü favorilere ekleme
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      // Varsayımsal Backend Endpoint: Ürünü favorilere ekler
      const response = await axios.post(
        `http://localhost:5000/api/shop/wishlist/add`,
        { userId, productId },
        { withCredentials: true }
      );
      // Yanıtın { success: true, data: { productId: '...' } } formatında olduğunu varsayalım
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Favorilere eklenemedi." }
      );
    }
  }
);

// Ürünü favorilerden çıkarma
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      // Varsayımsal Backend Endpoint: Ürünü favorilerden çıkarır
      const response = await axios.delete(
        `http://localhost:5000/api/shop/wishlist/remove/${userId}/${productId}`,
        { withCredentials: true }
      );
      // Yanıtın { success: true, data: { productId: '...' } } formatında olduğunu varsayalım
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Favorilerden çıkarılamadı." }
      );
    }
  }
);

// --- Slice Definition ---
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // İsterseniz buraya senkron reducer'lar ekleyebilirsiniz (örn. state'i manuel temizleme)
    clearWishlistOnLogout: (state) => {
      state.wishlistItems = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        // Backend'den gelen favori ürün ID'lerini state'e yazıyoruz
        state.wishlistItems =
          action.payload?.data?.map((item) => item.productId) || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
        state.wishlistItems = [];
      })
      // addToWishlist
      .addCase(addToWishlist.pending, (state) => {
        // İsteğe bağlı: Ekleme sırasında loading state'i gösterebilirsiniz
        // state.isLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // state.isLoading = false;
        if (action.payload?.success && action.payload?.data?.productId) {
          // Eğer ürün zaten listede değilse ekle
          if (!state.wishlistItems.includes(action.payload.data.productId)) {
            state.wishlistItems.push(action.payload.data.productId);
          }
        } else {
          // Backend success=false dönerse veya data eksikse hata yönetimi yapılabilir
          console.error(
            "Favorilere ekleme başarılı ama data eksik:",
            action.payload
          );
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        // state.isLoading = false;
        console.error(
          "Favorilere ekleme hatası:",
          action.payload?.message || action.error.message
        );
        // Hata state'ini güncelleyebilirsiniz: state.error = ...
      })
      // removeFromWishlist
      .addCase(removeFromWishlist.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        // state.isLoading = false;
        if (action.payload?.success && action.payload?.data?.productId) {
          // Ürünü listeden çıkar
          state.wishlistItems = state.wishlistItems.filter(
            (id) => id !== action.payload.data.productId
          );
        } else {
          console.error(
            "Favorilerden çıkarma başarılı ama data eksik:",
            action.payload
          );
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        // state.isLoading = false;
        console.error(
          "Favorilerden çıkarma hatası:",
          action.payload?.message || action.error.message
        );
        // state.error = ...
      });
    // Opsiyonel: Kullanıcı logout olduğunda favorileri temizle
    // Eğer logoutUser action'ı varsa:
    // .addCase(logoutUser.fulfilled, (state) => { // logoutUser action'ını import etmelisiniz
    //     state.wishlistItems = [];
    //     state.isLoading = false;
    //     state.error = null;
    // })
  },
});

export const { clearWishlistOnLogout } = wishlistSlice.actions;

export default wishlistSlice.reducer;
