import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";

export const fetchDirectPayments = createAsyncThunk(
  "directPayments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/direct-payment/history");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Geçmiş alınamadı");
    }
  }
);

const directPaymentSlice = createSlice({
  name: "directPayments",
  initialState: {
    payments: [],
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDirectPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDirectPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchDirectPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default directPaymentSlice.reducer;