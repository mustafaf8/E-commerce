import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/axiosInstance";
import { clearGuestCart } from "@/lib/guestCartUtils";

const initialState = {
  paymentPageUrl: null,
  isLoading: false,
  error: null,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post("/shop/order/create", orderData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Sipariş oluşturulamadı." }
      );
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/order/list/${userId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
    //  console.error(
      //  "getAllOrdersByUserId API Hatası:",
      //  error.response?.data || error.message
     // );
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
      const response = await api.get(`/shop/order/details/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
    //  console.error(
    //    "getOrderDetails API Hatası:",
    //    error.response?.data || error.message
    //  );
      return rejectWithValue(
        error.response?.data || { message: "Sipariş detayı alınamadı." }
      );
    }
  }
);

export const createGuestOrderThunk = createAsyncThunk(
  "order/createGuestOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post("/shop/order/guest-create", orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Misafir siparişi oluşturulamadı." }
      );
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shopOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    resetPaymentPageUrl: (state) => {
      state.paymentPageUrl = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.paymentPageUrl = null;
        state.orderId = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentPageUrl = action.payload?.paymentPageUrl;
        state.orderId = action.payload?.orderId;
        state.error = !action.payload?.success
          ? action.payload?.message ||
            "Sipariş oluşturuldu ama ödeme URL alınamadı."
          : null;

        if (action.payload?.success && action.payload?.orderId) {
          sessionStorage.setItem(
            "currentOrderId",
            JSON.stringify(action.payload.orderId)
          );
        } else {
          sessionStorage.removeItem("currentOrderId");
        }
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Sipariş oluşturulurken bir hata oluştu.";
        state.paymentPageUrl = null;
        state.orderId = null;
        sessionStorage.removeItem("currentOrderId");
      })

      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload?.data || [];
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

      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload?.data || null;
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
      })

      .addCase(createGuestOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.paymentPageUrl = null;
        state.orderId = null;
      })
      .addCase(createGuestOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentPageUrl = action.payload?.paymentPageUrl;
        state.orderId = action.payload?.orderId;
        state.error = !action.payload?.success
          ? action.payload?.message ||
            "Misafir siparişi oluşturuldu ama ödeme URL alınamadı."
          : null;
        if (action.payload?.success) {
          clearGuestCart();
        }
      })
      .addCase(createGuestOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Misafir siparişi oluşturulurken bir hata oluştu.";
        state.paymentPageUrl = null;
        state.orderId = null;
      });
  },
});

export const { resetOrderDetails, resetPaymentPageUrl, clearOrderError } =
  shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
