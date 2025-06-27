import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axiosInstance";

const initialState = {
  isLoading: false,
  addressList: [],
  error: null,
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    const response = await api.post("/shop/address/add", formData);

    return response.data;
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId) => {
    const response = await api.get(`/shop/address/get/${userId}`);

    return response.data;
  }
);

export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }) => {
    const response = await api.put(
      `/shop/address/update/${userId}/${addressId}`,
      formData
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await api.delete(
      `/shop/address/delete/${userId}/${addressId}`
    );

    return { ...response.data, deletedId: addressId };
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success && action.payload?.data) {
          state.addressList.push(action.payload.data);
        }
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Adres eklenemedi.";
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.addressList = [];
        state.error = action.error.message || "Adresler alınamadı.";
      })
      .addCase(editaAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editaAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success && action.payload?.data) {
          const updatedAddress = action.payload.data;
          const index = state.addressList.findIndex(
            (addr) => addr._id === updatedAddress._id
          );
          if (index !== -1) {
            state.addressList[index] = updatedAddress;
          }
        }
      })
      .addCase(editaAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Adres güncellenemedi.";
      })

      // YENİ: deleteAddress
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.success && action.payload?.deletedId) {
          state.addressList = state.addressList.filter(
            (addr) => addr._id !== action.payload.deletedId
          );
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Adres silinemedi.";
      });
  },
});

export default addressSlice.reducer;
