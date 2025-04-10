import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state güncellendi: approvalURL -> paymentPageUrl, error eklendi
const initialState = {
  paymentPageUrl: null, // Iyzico ödeme sayfası URL'si için
  isLoading: false,
  error: null, // Hata durumunu saklamak için
  orderId: null, // Oluşturulan sipariş ID'si
  orderList: [], // Kullanıcının sipariş listesi
  orderDetails: null, // Detayı görüntülenen sipariş
};

// createNewOrder Thunk'ı backend'den paymentPageUrl bekleyecek şekilde kalıyor.
export const createNewOrder = createAsyncThunk(
  "order/createNewOrder", // Action type prefix
  // async (orderData, { rejectWithValue }) => { // Hata yönetimi için rejectWithValue eklenebilir
  async (orderData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/shop/order/create",
        orderData,
        { withCredentials: true } // Cookie'lerin gönderilmesi için
      );
      // Backend'den { success: true, paymentPageUrl: '...', orderId: '...' } gibi bir yanıt bekleniyor
      return response.data;
    } catch (error) {
      console.error(
        "createNewOrder API Hatası:",
        error.response?.data || error.message
      );
      // Hata durumunda özelleştirilmiş bir nesne veya sadece mesaj döndürebiliriz
      // return rejectWithValue(error.response?.data || { message: 'Sipariş oluşturulamadı.' });
      throw error; // Veya hatayı doğrudan fırlatıp rejected case'de yakala
    }
  }
);

// capturePayment Thunk'ı Iyzico backend callback akışında GEREKLİ DEĞİL.
// Bu yüzden kaldırıyoruz veya yorum satırı yapıyoruz.
/*
export const capturePayment = createAsyncThunk(
    "/order/capturePayment",
    async ({ paymentId, payerId, orderId }) => {
        // ... Bu kod artık kullanılmayacak ...
    }
);
*/

// Diğer Thunk'lar (kullanıcı siparişlerini alma) aynı kalabilir
export const getAllOrdersByUserId = createAsyncThunk(
  "order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/list/${userId}`,
        { withCredentials: true }
      );
      return response.data; // { success: true, data: [...] } bekleniyor
    } catch (error) {
      console.error(
        "getAllOrdersByUserId API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Siparişler alınamadı." }
      );
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/details/${id}`,
        { withCredentials: true }
      );
      return response.data; // { success: true, data: {...} } bekleniyor
    } catch (error) {
      console.error(
        "getOrderDetails API Hatası:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data || { message: "Sipariş detayı alınamadı." }
      );
    }
  }
);

// Slice tanımı güncellendi
const shoppingOrderSlice = createSlice({
  name: "shopOrder", // Slice adı düzeltildi (genellikle state'deki key ile aynı olur)
  initialState,
  reducers: {
    // Sipariş detayı görüntülemeden çıkıldığında state'i temizlemek için
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    // Ödeme sayfası URL'sini manuel olarak temizlemek gerekirse (opsiyonel)
    resetPaymentPageUrl: (state) => {
      state.paymentPageUrl = null;
    },
    // Hata durumunu manuel temizlemek için (opsiyonel)
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- createNewOrder ---
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Yeni istek başlarken hatayı temizle
        state.paymentPageUrl = null; // Önceki URL'i temizle
        state.orderId = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        // Payload'dan paymentPageUrl ve orderId'yi al ve state'e ata
        state.paymentPageUrl = action.payload?.paymentPageUrl; // Değişti: approvalURL -> paymentPageUrl
        state.orderId = action.payload?.orderId;
        state.error = !action.payload?.success
          ? action.payload?.message ||
            "Sipariş oluşturuldu ama ödeme URL alınamadı."
          : null; // Backend success=false dönerse hata set et

        // Eğer işlem başarılıysa orderId'yi sakla (isteğe bağlı)
        if (action.payload?.success && action.payload?.orderId) {
          sessionStorage.setItem(
            "currentOrderId",
            JSON.stringify(action.payload.orderId)
          );
        } else {
          // Başarısızsa sessionStorage'ı temizle (opsiyonel)
          sessionStorage.removeItem("currentOrderId");
        }
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        // Hata bilgisini state'e yaz (action.error veya rejectWithValue'dan gelen action.payload)
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Sipariş oluşturulurken bir hata oluştu.";
        state.paymentPageUrl = null;
        state.orderId = null;
        sessionStorage.removeItem("currentOrderId"); // Hata durumunda temizle
      })

      // --- getAllOrdersByUserId ---
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload?.data || []; // Backend'den gelen datayı al
        state.error = !action.payload?.success
          ? action.payload?.message || "Siparişler alınamadı."
          : null;
      })
      .addCase(getAllOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Sipariş listesi alınırken bir hata oluştu.";
        state.orderList = [];
      })

      // --- getOrderDetails ---
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload?.data || null; // Backend'den gelen datayı al
        state.error = !action.payload?.success
          ? action.payload?.message || "Sipariş detayı alınamadı."
          : null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Sipariş detayı alınırken bir hata oluştu.";
        state.orderDetails = null;
      });

    // capturePayment için reducer'lar kaldırıldı.
  },
});

// Action'ları export et
export const { resetOrderDetails, resetPaymentPageUrl, clearOrderError } =
  shoppingOrderSlice.actions;

// Reducer'ı export et
export default shoppingOrderSlice.reducer;
