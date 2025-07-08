import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";

const initialState = {
  adminList: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const fetchAdminList = createAsyncThunk(
  "authorization/fetchAdminList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/authorization/admins");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Liste alınamadı" });
    }
  }
);

export const updateAdminAuthorization = createAsyncThunk(
  "authorization/updateAdminAuthorization",
  async ({ adminId, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/authorization/${adminId}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Güncelleme başarısız" });
    }
  }
);

const authorizationSlice = createSlice({
  name: "authorization",
  initialState,
  reducers: {
    clearAuthorizationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminList = action.payload?.data || [];
      })
      .addCase(fetchAdminList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error?.message;
      })
      .addCase(updateAdminAuthorization.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateAdminAuthorization.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updated = action.payload?.data;
        if (updated) {
          const idx = state.adminList.findIndex((a) => a._id === updated._id);
          if (idx !== -1) {
            state.adminList[idx] = updated;
          } else {
            state.adminList.push(updated);
          }
        }
      })
      .addCase(updateAdminAuthorization.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.message || action.error?.message;
      });
  },
});

export const { clearAuthorizationError } = authorizationSlice.actions;
export default authorizationSlice.reducer; 