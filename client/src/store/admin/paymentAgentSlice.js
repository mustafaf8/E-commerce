import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";

export const fetchPaymentAgents = createAsyncThunk(
  "paymentAgents/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/users/payment-agents");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Kasiyer listesi alınamadı."
      );
    }
  }
);

export const addPaymentAgent = createAsyncThunk(
  "paymentAgents/add",
  async ({ userName, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/admin/users/payment-agents", {
        userName,
        email,
        password,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Kasiyer eklenemedi."
      );
    }
  }
);

export const updatePaymentAgentStatus = createAsyncThunk(
  "paymentAgents/updateStatus",
  async ({ agentId, isActive }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/admin/users/payment-agents/${agentId}/status`,
        { isActive }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Durum güncellenemedi."
      );
    }
  }
);

export const deletePaymentAgent = createAsyncThunk(
  "paymentAgents/delete",
  async ({ agentId }, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/payment-agents/${agentId}`);
      return agentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Kasiyer silinemedi."
      );
    }
  }
);

const paymentAgentSlice = createSlice({
  name: "paymentAgents",
  initialState: {
    agents: [],
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPaymentAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload || [];
      })
      .addCase(fetchPaymentAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addPaymentAgent.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(addPaymentAgent.fulfilled, (state, action) => {
        state.createLoading = false;
        if (action.payload) {
          state.agents.unshift(action.payload);
        }
      })
      .addCase(addPaymentAgent.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update status
      .addCase(updatePaymentAgentStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentAgentStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload;
        const index = state.agents.findIndex(
          (agent) => agent._id === updated?._id
        );
        if (index !== -1) {
          state.agents[index] = { ...state.agents[index], ...updated };
        }
      })
      .addCase(updatePaymentAgentStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete agent
      .addCase(deletePaymentAgent.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deletePaymentAgent.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.agents = state.agents.filter(
          (agent) => agent._id !== action.payload
        );
      })
      .addCase(deletePaymentAgent.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export default paymentAgentSlice.reducer;

