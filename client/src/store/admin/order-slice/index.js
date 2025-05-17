import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [], // Mevcut (Artık genel liste yerine seçili kullanıcının listesi olacak)
  userList: [], // <<< YENİ: Siparişi olan kullanıcıların listesi
  selectedUserOrders: [], // <<< YENİ: Seçilen kullanıcının siparişleri
  orderDetails: null, // Mevcut
  isLoading: false, // <<< YENİ: Genel yüklenme durumu
  isUserListLoading: false, // <<< YENİ
  isUserOrdersLoading: false, // <<< YENİ
  isDetailsLoading: false, // <<< YENİ
  error: null, // <<< YENİ: Hata yönetimi için
  guestOrderList: [], // YENİ: Misafir siparişleri için liste
  isGuestOrdersLoading: false,
};

export const fetchAllGuestOrdersForAdmin = createAsyncThunk(
  "adminOrder/fetchAllGuestOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      // Backend'de bu endpoint'i oluşturmanız gerekecek.
      // Bu endpoint, Order modelinde isGuestOrder: true olan tüm siparişleri dönmeli.
      const response = await axios.get(
        `http://localhost:5000/api/admin/orders/guest-orders`
      );
      return response.data; // { success: true, data: [...] } bekleniyor
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/orders/get`
    );

    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/orders/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/orders/update/${id}`,
      {
        orderStatus,
      }
    );

    return response.data;
  }
);

export const fetchUsersWithOrders = createAsyncThunk(
  "adminOrder/fetchUsersWithOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/orders/users-list`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchOrdersByUserIdForAdmin = createAsyncThunk(
  "adminOrder/fetchOrdersByUserIdForAdmin",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/orders/user/${userId}`
        // Gerekirse admin token'ını header ile gönder
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// const adminOrderSlice = createSlice({
//   name: "adminOrderSlice",
//   initialState,
//   reducers: {
//     resetOrderDetails: (state) => {
//       console.log("resetOrderDetails");
//       state.orderDetails = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllOrdersForAdmin.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.orderList = action.payload.data;
//       })
//       .addCase(getAllOrdersForAdmin.rejected, (state) => {
//         state.isLoading = false;
//         state.orderList = [];
//       })
//       .addCase(getOrderDetailsForAdmin.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.orderDetails = action.payload.data;
//       })
//       .addCase(getOrderDetailsForAdmin.rejected, (state) => {
//         state.isLoading = false;
//         state.orderDetails = null;
//       });
//   },
// });

// export const { resetOrderDetails } = adminOrderSlice.actions;

const adminOrderSlice = createSlice({
  name: "adminOrderSlice", // Slice adını kontrol et (genelde store'daki key ile aynı)
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");
      state.orderDetails = null;
    },
    // <<< YENİ: Seçili kullanıcı siparişlerini temizle (kullanıcı listesine geri dönünce)
    clearSelectedUserOrders: (state) => {
      state.selectedUserOrders = [];
    },
    clearAdminOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsersWithOrders
      .addCase(fetchUsersWithOrders.pending, (state) => {
        state.isUserListLoading = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersWithOrders.fulfilled, (state, action) => {
        state.isUserListLoading = false;
        state.isLoading = false;
        state.userList = action.payload?.data || [];
      })
      .addCase(fetchUsersWithOrders.rejected, (state, action) => {
        state.isUserListLoading = false;
        state.isLoading = false;
        state.userList = [];
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Kullanıcı listesi alınamadı.";
      })

      // fetchOrdersByUserIdForAdmin
      .addCase(fetchOrdersByUserIdForAdmin.pending, (state) => {
        state.isUserOrdersLoading = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUserIdForAdmin.fulfilled, (state, action) => {
        state.isUserOrdersLoading = false;
        state.isLoading = false;
        state.selectedUserOrders = action.payload?.data || [];
        // Bu thunk başarılı olduğunda orderList'i GÜNCELLEME! Ayrı state kullanıyoruz.
        // state.orderList = action.payload.data; // <<< BU SATIRI KALDIR/YORUMLA
      })
      .addCase(fetchOrdersByUserIdForAdmin.rejected, (state, action) => {
        state.isUserOrdersLoading = false;
        state.isLoading = false;
        state.selectedUserOrders = [];
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Kullanıcı siparişleri alınamadı.";
      })

      // getOrderDetailsForAdmin
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isDetailsLoading = true; // Detaylar için ayrı loading
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.isLoading = false;
        state.orderDetails = action.payload?.data || null;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.isLoading = false;
        state.orderDetails = null;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Sipariş detayı alınamadı.";
      })

      // updateOrderStatus (Başarılı olunca ne yapılacağına karar ver - belki sadece mesaj)
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true; // Veya ayrı bir updateLoading state'i
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Başarılı güncelleme sonrası state'i nasıl güncelleyeceğimize bağlı.
        // Genellikle liste yeniden çekilir veya sadece orderDetails güncellenir.
        // Şimdilik sadece loading'i kapatalım, component'te yeniden fetch tetiklenebilir.
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Durum güncellenemedi.";
      })
      .addCase(fetchAllGuestOrdersForAdmin.pending, (state) => {
        state.isGuestOrdersLoading = true;
        state.isLoading = true; // Genel loading'i de true yapabiliriz
        state.error = null;
      })
      .addCase(fetchAllGuestOrdersForAdmin.fulfilled, (state, action) => {
        state.isGuestOrdersLoading = false;
        state.isLoading = false;
        state.guestOrderList = action.payload?.data || [];
      })
      .addCase(fetchAllGuestOrdersForAdmin.rejected, (state, action) => {
        state.isGuestOrdersLoading = false;
        state.isLoading = false;
        state.guestOrderList = [];
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Misafir siparişleri alınamadı.";
      });
    // getAllOrdersForAdmin thunk'ını kullanmıyorsak ilgili case'leri kaldırabiliriz.
    // .addCase(getAllOrdersForAdmin.pending, (state) => { /*...*/ })
    // .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => { /*...*/ })
    // .addCase(getAllOrdersForAdmin.rejected, (state) => { /*...*/ })
  },
});

export const {
  resetOrderDetails,
  clearSelectedUserOrders,
  clearAdminOrderError,
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
