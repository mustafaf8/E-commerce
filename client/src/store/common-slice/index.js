// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoading: false,
//   featureImageList: [],
// };

// export const getFeatureImages = createAsyncThunk(
//   "/order/getFeatureImages",
//   async () => {
//     const response = await axios.get(
//       `http://localhost:5000/api/common/feature/get`
//     );

//     return response.data;
//   }
// );

// export const addFeatureImage = createAsyncThunk(
//   "/order/addFeatureImage",
//   async (image) => {
//     const response = await axios.post(
//       `http://localhost:5000/api/common/feature/add`,
//       { image }
//     );

//     return response.data;
//   }
// );

// const commonSlice = createSlice({
//   name: "commonSlice",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getFeatureImages.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getFeatureImages.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.featureImageList = action.payload.data;
//       })
//       .addCase(getFeatureImages.rejected, (state) => {
//         state.isLoading = false;
//         state.featureImageList = [];
//       });
//   },
// });

// export default commonSlice.reducer;

// client/src/store/common-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
  error: null, // Hata durumu ekleyelim
};

// Mevcut Thunk: Bannerları Getirme
export const getFeatureImages = createAsyncThunk(
  "commonFeature/getFeatureImages", // Action type prefix güncellendi (sliceName/thunkName)
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/common/feature/get`
      );
      if (response.data && response.data.success) {
        return response.data; // {success: true, data: [...]}
      } else {
        return rejectWithValue(
          response.data || { message: "Banner verisi alınamadı." }
        );
      }
    } catch (error) {
      console.error(
        "getFeatureImages API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Bannerlar getirilemedi." }
      );
    }
  }
);

// Güncellenmiş Thunk: Banner Ekleme (Başlık ve Link ile)
export const addFeatureImage = createAsyncThunk(
  "commonFeature/addFeatureImage",
  // Artık sadece image URL değil, bir obje bekliyor: { image, title, link }
  async (bannerData, { rejectWithValue }) => {
    try {
      // !!! Backend endpoint'inizin bu veriyi alacak şekilde güncellendiğini varsayıyoruz !!!
      const response = await axios.post(
        `http://localhost:5000/api/common/feature/add`,
        bannerData // { image: 'url', title: '...', link: '...' } gönderiliyor
      );
      if (response.data && response.data.success) {
        return response.data; // {success: true, data: { ...yeni banner... } }
      } else {
        return rejectWithValue(
          response.data || { message: "Banner eklenemedi." }
        );
      }
    } catch (error) {
      console.error(
        "addFeatureImage API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Banner eklenemedi." }
      );
    }
  }
);

// !!! YENİ THUNK: Banner Silme !!!
export const deleteFeatureImage = createAsyncThunk(
  "commonFeature/deleteFeatureImage",
  async (bannerId, { rejectWithValue }) => {
    try {
      // !!! BURAYI DEĞİŞTİRİN: Backend silme endpoint'inizin doğru adresini yazın !!!
      const response = await axios.delete(
        `http://localhost:5000/api/common/feature/delete/${bannerId}`
        // Yetkilendirme gerekebilir: { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.success) {
        // Başarılı silme sonrası ID'yi döndür
        return { success: true, data: { _id: bannerId } };
      } else {
        return rejectWithValue(
          response.data || { message: "Banner silinemedi." }
        );
      }
    } catch (error) {
      console.error(
        "deleteFeatureImage API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Banner silinemedi." }
      );
    }
  }
);

const commonSlice = createSlice({
  name: "commonFeature", // Slice adı düzeltildi
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getFeatureImages
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload?.data || [];
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
        state.featureImageList = [];
      })

      // addFeatureImage
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        // Yükleme durumunu ayrıca yönetmek isterseniz pending/rejected case'leri ekleyin
        if (action.payload?.success && action.payload?.data) {
          state.featureImageList.push(action.payload.data); // Yeni banner'ı listeye ekle
          state.error = null;
        }
      })
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
        console.error("Banner ekleme hatası (Redux):", state.error);
      })

      // !!! YENİ CASE'LER: deleteFeatureImage !!!
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        if (action.payload?.success && action.payload?.data?._id) {
          // Silinen banner'ı listeden çıkar
          state.featureImageList = state.featureImageList.filter(
            (banner) => banner._id !== action.payload.data._id
          );
          state.error = null;
        }
      })
      .addCase(deleteFeatureImage.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
        console.error("Banner silme hatası (Redux):", state.error);
      });
  },
});

export default commonSlice.reducer;
