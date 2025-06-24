import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const fetchMaintenanceStatus = createAsyncThunk(
  "maintenance/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/maintenance/status`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateMaintenanceStatus = createAsyncThunk(
  "maintenance/updateStatus",
  async (statusData, { rejectWithValue }) => {
    try {
      const response = await api.put(`/maintenance/status`, statusData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  status: {
    isActive: false,
    message: "",
    returnDate: null,
  },
  isLoading: true,
  error: null,
};

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Status
      .addCase(fetchMaintenanceStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMaintenanceStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload?.data || {
          isActive: false,
          message: "",
          returnDate: null,
        };
      })
      .addCase(fetchMaintenanceStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Durum alınamadı.";
      })
      // Update Status
      .addCase(updateMaintenanceStatus.pending, (state) => {
        state.isLoading = true; // veya isUpdating: true
      })
      .addCase(updateMaintenanceStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload.data;
      })
      .addCase(updateMaintenanceStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Güncelleme başarısız.";
      });
  },
});

export default maintenanceSlice.reducer;
