import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/axiosInstance";

const initialState = {
  orderList: [],
  userList: [],
  selectedUserOrders: [],
  orderDetails: null,
  isLoading: false,
  isUserListLoading: false,
  isUserOrdersLoading: false,
  isDetailsLoading: false,
  error: null,
  guestOrderList: [],
  isGuestOrdersLoading: false,
};

export const fetchAllGuestOrdersForAdmin = createAsyncThunk(
  "adminOrder/fetchAllGuestOrdersForAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders/guest-orders`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await api.get(`/admin/orders/get`);

    return response.data;
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await api.get(`/admin/orders/details/${id}`);

    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await api.put(`/admin/orders/update/${id}`, {
      orderStatus,
    });

    return response.data;
  }
);

export const fetchUsersWithOrders = createAsyncThunk(
  "adminOrder/fetchUsersWithOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders/users-list`);
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
      const response = await api.get(`/admin/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      // console.log("resetOrderDetails");
      state.orderDetails = null;
    },
    clearSelectedUserOrders: (state) => {
      state.selectedUserOrders = [];
    },
    clearAdminOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(fetchOrdersByUserIdForAdmin.pending, (state) => {
        state.isUserOrdersLoading = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUserIdForAdmin.fulfilled, (state, action) => {
        state.isUserOrdersLoading = false;
        state.isLoading = false;
        state.selectedUserOrders = action.payload?.data || [];
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

      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isDetailsLoading = true;
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

      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload?.data;

        if (updatedOrder) {
          if (state.orderDetails?._id === updatedOrder._id) {
            state.orderDetails = updatedOrder;
          }
          const userOrderIndex = state.selectedUserOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (userOrderIndex > -1) {
            state.selectedUserOrders[userOrderIndex] = updatedOrder;
          }
          const guestOrderIndex = state.guestOrderList.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (guestOrderIndex > -1) {
            state.guestOrderList[guestOrderIndex] = updatedOrder;
          }
        }
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
        state.isLoading = true;
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
  },
});

export const {
  resetOrderDetails,
  clearSelectedUserOrders,
  clearAdminOrderError,
} = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
