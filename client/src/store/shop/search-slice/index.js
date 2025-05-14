// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoading: false,
//   searchResults: [],
// };

// export const getSearchResults = createAsyncThunk(
//   "/order/getSearchResults",
//   async (keyword) => {
//     const response = await axios.get(
//       `http://localhost:5000/api/shop/search/${keyword}`
//     );

//     return response.data;
//   }
// );

// const searchSlice = createSlice({
//   name: "searchSlice",
//   initialState,
//   reducers: {
//     resetSearchResults: (state) => {
//       state.searchResults = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getSearchResults.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getSearchResults.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.searchResults = action.payload.data;
//       })
//       .addCase(getSearchResults.rejected, (state) => {
//         state.isLoading = false;
//         state.searchResults = [];
//       });
//   },
// });

// export const { resetSearchResults } = searchSlice.actions;

// export default searchSlice.reducer;

// client/src/store/shop/search-slice/index.js (Güncellenmiş Hali)
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
  error: null, // Hata durumunu eklemek iyi bir pratik
};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults", // Action type prefix güncellendi
  async (keyword, { rejectWithValue }) => {
    // rejectWithValue eklendi
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/search`, // Ana endpoint
        { params: { keyword } } // keyword'ü query parametresi olarak gönder
      );
      // Başarılı yanıtı kontrol et (opsiyonel ama önerilir)
      if (response.data && response.data.success) {
        return response.data; // { success: true, data: [...] }
      } else {
        // Backend success:false döndürürse veya data beklenmedikse
        return rejectWithValue(
          response.data || { message: "Arama sonuçları alınamadı." }
        );
      }
    } catch (error) {
      // Network hatası veya diğer axios hataları
      return rejectWithValue(
        error.response?.data || {
          message: error.message || "Arama sırasında bir hata oluştu.",
        }
      );
    }
  }
);

const searchSlice = createSlice({
  name: "shopSearch", // Slice adını kontrol edin, muhtemelen "shopSearch" olmalı (store.js'deki gibi)
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.isLoading = false; // reset olduğunda loading'i de kapat
      state.error = null; // Hatayı da temizle
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Yeni arama başlarken hatayı temizle
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data; // Backend'den gelen datayı al
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResults = [];
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Arama başarısız oldu."; // Hata mesajını kaydet
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
