import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/api/axiosInstance";

export const fetchAdminMessages = createAsyncThunk(
  "adminMessages/fetchAll",
  async (status, { rejectWithValue }) => {
    try {
      const res = await axios.get("/admin/messages" + (status ? `?status=${status}` : ""));
      return res.data.messages;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Mesajlar alınamadı");
    }
  }
);

export const replyToMessage = createAsyncThunk(
  "adminMessages/reply",
  async ({ id, reply }, { rejectWithValue }) => {
    try {
      await axios.post(`/admin/messages/reply/${id}`, { reply });
      return { id, reply };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Yanıt gönderilemedi");
    }
  }
);

export const updateMessageStatus = createAsyncThunk(
  "adminMessages/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await axios.put(`/admin/messages/status/${id}`, { status });
      return { id, status };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Durum güncellenemedi");
    }
  }
);

const adminMessageSlice = createSlice({
  name: "adminMessages",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    selected: null,
    filter: "",
    newCount: 0,
  },
  reducers: {
    setSelectedMessage(state, action) {
      state.selected = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setNewCount(state, action) {
      state.newCount = action.payload;
    },
    incrementNewCount(state) {
      state.newCount += 1;
    },
    resetNewCount(state) {
      state.newCount = 0;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchAdminMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedMessage, setFilter, setNewCount, incrementNewCount, resetNewCount } = adminMessageSlice.actions;
export default adminMessageSlice.reducer;