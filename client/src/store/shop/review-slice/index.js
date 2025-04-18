// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isLoading: false,
//   reviews: [],
// };

// export const addReview = createAsyncThunk(
//   "/order/addReview",
//   async (formdata) => {
//     const response = await axios.post(
//       `http://localhost:5000/api/shop/review/add`,
//       formdata
//     );

//     return response.data;
//   }
// );

// export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
//   const response = await axios.get(
//     `http://localhost:5000/api/shop/review/${id}`
//   );

//   return response.data;
// });

// const reviewSlice = createSlice({
//   name: "reviewSlice",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getReviews.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getReviews.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.reviews = action.payload.data;
//       })
//       .addCase(getReviews.rejected, (state) => {
//         state.isLoading = false;
//         state.reviews = [];
//       });
//   },
// });

// export default reviewSlice.reducer;

// client/src/store/shop/review-slice/index.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  // addReview için de durum ekleyebiliriz (opsiyonel ama önerilir)
  isAddingReview: false,
  addReviewError: null,
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  // Thunk API'sini (ikinci argüman) kullanarak rejectWithValue'a erişin
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/shop/review/add`,
        formdata
      );
      // Başarılı ise backend'den dönen veriyi döndür ({success: true, data: ...})
      return response.data;
    } catch (error) {
      // Eğer axios hata fırlatırsa (4xx, 5xx durum kodları vb.)
      if (error.response && error.response.data) {
        // Backend'den gelen JSON payload'ını ({success: false, message: "..."})
        // rejectWithValue ile gönder.
        return rejectWithValue(error.response.data);
      } else {
        // Başka bir hata türü varsa (network hatası vb.) genel bir mesaj gönder
        return rejectWithValue({ success: false, message: error.message });
      }
    }
  }
);

export const getReviews = createAsyncThunk(
  "/order/getReviews",
  async (id, { rejectWithValue }) => {
    // getReviews için de ekleyebiliriz
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/review/${id}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ success: false, message: error.message });
      }
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getReviews cases (Mevcut)
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state, action) => {
        // action eklendi
        state.isLoading = false;
        state.reviews = [];
        // İsteğe bağlı: getReviews hatasını state'e yazdır
        console.error("Get reviews failed:", action.payload || action.error);
      })

      // addReview cases (Opsiyonel ama önerilir)
      .addCase(addReview.pending, (state) => {
        state.isAddingReview = true;
        state.addReviewError = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isAddingReview = false;
        // Başarılı olursa bir şey yapmaya gerek yok, yorumlar getReviews ile güncellenecek
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isAddingReview = false;
        // action.payload burada rejectWithValue ile gönderilen değeri içerir
        state.addReviewError =
          action.payload?.message ||
          action.error.message ||
          "Unknown error adding review";
        console.error("Add review failed:", action.payload || action.error);
      });
  },
});

export default reviewSlice.reducer;
