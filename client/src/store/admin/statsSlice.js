import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const fetchSalesOverview = createAsyncThunk(
  "adminStats/fetchSalesOverview",
  async (period = "weekly", { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/sales-overview?period=${period}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchOrderStatusDistribution = createAsyncThunk(
  "adminStats/fetchOrderStatusDistribution",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/order-status-distribution`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchTopSellingProducts = createAsyncThunk(
  "adminStats/fetchTopSellingProducts",
  async ({ limit = 10, metric = "salesCount" } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/admin/stats/top-selling-products?limit=${limit}&metric=${metric}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchSalesByCategory = createAsyncThunk(
  "adminStats/fetchSalesByCategory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/sales-by-category`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchSalesByBrand = createAsyncThunk(
  "adminStats/fetchSalesByBrand",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/sales-by-brand`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchUserSummary = createAsyncThunk(
  "adminStats/fetchUserSummary",
  async (period = "weekly", { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/user-summary?period=${period}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchTopCustomers = createAsyncThunk(
  "adminStats/fetchTopCustomers",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/top-customers?limit=${limit}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchProductSummary = createAsyncThunk(
  "adminStats/fetchProductSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/product-summary`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchSalesTrend = createAsyncThunk(
  "adminStats/fetchSalesTrend",
  async (period = "monthly", { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/sales-trend?period=${period}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchUserRegistrationsTrend = createAsyncThunk(
  "adminStats/fetchUserRegistrationsTrend",
  async (period = "monthly", { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/admin/stats/user-registrations-trend?period=${period}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchTopLikedProducts = createAsyncThunk(
  "adminStats/fetchTopLikedProducts",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/admin/stats/top-liked-products?limit=${limit}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchProfitOverview = createAsyncThunk(
  "adminStats/fetchProfitOverview",
  async (period = "weekly", { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/admin/stats/profit-overview?period=${period}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchProfitByProduct = createAsyncThunk(
  "adminStats/fetchProfitByProduct",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/profit-by-product`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchProfitByCategory = createAsyncThunk(
  "adminStats/fetchProfitByCategory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/profit-by-category`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchProfitByBrand = createAsyncThunk(
  "adminStats/fetchProfitByBrand",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/stats/profit-by-brand`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  salesOverview: null,
  orderStatusDistribution: null,
  topSellingProducts: [],
  salesByCategory: [],
  salesByBrand: [],
  userSummary: null,
  topCustomers: [],
  productSummary: null,
  salesTrend: [],
  userRegistrationsTrend: [],
  topLikedProducts: [],
  profitOverview: null,
  profitByProduct: [],
  profitByCategory: [],
  profitByBrand: [],
  isLoading: false,
  error: null,
};

const adminStatsSlice = createSlice({
  name: "adminStats",
  initialState,
  reducers: {
    clearStatsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sales Overview
      .addCase(fetchSalesOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSalesOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesOverview = action.payload.data;
      })
      .addCase(fetchSalesOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Order Status Distribution
      .addCase(fetchOrderStatusDistribution.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderStatusDistribution.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderStatusDistribution = action.payload.data;
      })
      .addCase(fetchOrderStatusDistribution.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Top Selling Products
      .addCase(fetchTopSellingProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topSellingProducts = action.payload.data;
      })
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Sales by Category
      .addCase(fetchSalesByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSalesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesByCategory = action.payload.data;
      })
      .addCase(fetchSalesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Sales by Brand
      .addCase(fetchSalesByBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSalesByBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesByBrand = action.payload.data;
      })
      .addCase(fetchSalesByBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // User Summary
      .addCase(fetchUserSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSummary = action.payload.data;
      })
      .addCase(fetchUserSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Top Customers
      .addCase(fetchTopCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTopCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topCustomers = action.payload.data;
      })
      .addCase(fetchTopCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Product Summary
      .addCase(fetchProductSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productSummary = action.payload.data;
      })
      .addCase(fetchProductSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Sales Trend
      .addCase(fetchSalesTrend.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSalesTrend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesTrend = action.payload.data;
      })
      .addCase(fetchSalesTrend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // User Registrations Trend
      .addCase(fetchUserRegistrationsTrend.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserRegistrationsTrend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userRegistrationsTrend = action.payload.data;
      })
      .addCase(fetchUserRegistrationsTrend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Top Liked Products
      .addCase(fetchTopLikedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTopLikedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topLikedProducts = action.payload.data;
      })
      .addCase(fetchTopLikedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Profit Overview
      .addCase(fetchProfitOverview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfitOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profitOverview = action.payload.data;
      })
      .addCase(fetchProfitOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Profit by Product
      .addCase(fetchProfitByProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfitByProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profitByProduct = action.payload.data;
      })
      .addCase(fetchProfitByProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Profit by Category
      .addCase(fetchProfitByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfitByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profitByCategory = action.payload.data;
      })
      .addCase(fetchProfitByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Profit by Brand
      .addCase(fetchProfitByBrand.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfitByBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profitByBrand = action.payload.data;
      })
      .addCase(fetchProfitByBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { clearStatsError } = adminStatsSlice.actions;

export default adminStatsSlice.reducer;
