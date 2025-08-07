import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/api/axiosInstance';

// Async thunk: logları çek
export const fetchLogs = createAsyncThunk(
  'logs/fetchLogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 20, level, action, userId, search } = params;
      const response = await axios.get('/admin/logs', {
        params: { page, limit, level, action, userId, search },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Loglar alınamadı');
    }
  }
);

const logSlice = createSlice({
  name: 'logs',
  initialState: {
    logs: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalLogs: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    loading: false,
    error: null,
    filters: {
      level: '',
      action: '',
      userId: '',
      search: '',
    },
  },
  reducers: {
    setLogFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLogPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        
        // Debug için gelen verileri kontrol et
        console.log("API'den gelen log verileri:", action.payload.logs);
        
        // Kullanıcı bilgilerini kontrol et
        if (action.payload.logs && action.payload.logs.length > 0) {
          action.payload.logs.forEach((log, index) => {
            console.log(`Log ${index} kullanıcı bilgisi:`, {
              username: log.username,
              user: log.user
            });
          });
        }
        
        state.logs = action.payload.logs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Loglar alınamadı';
      });
  },
});

export const { setLogFilters, setLogPage } = logSlice.actions;
export default logSlice.reducer;