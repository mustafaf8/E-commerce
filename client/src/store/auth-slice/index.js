import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  isPhoneVerificationLoading: false,
  isPhoneRegisterLoading: false,
  user: null,
  error: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Kayıt başarısız" }
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Giriş başarısız" }
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/logout",
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
     // console.error("Logout API error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Çıkış yapılamadı." }
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/check-auth", {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Oturum bulunamadı veya geçersiz." }
      );
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "/auth/update",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/update", formData, {
        withCredentials: true,
      });
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Güncelleme sırasında hata oluştu" }
      );
    }
  }
);

export const verifyPhoneLogin = createAsyncThunk(
  "/auth/phone/verify",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/phone/verify",
        { token },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Telefon doğrulama backend hatası" }
      );
    }
  }
);

export const registerPhoneUser = createAsyncThunk(
  "/auth/phone/register",
  async ({ token, userName }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/phone/register",
        { token, userName },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Telefonla kayıt backend hatası" }
      );
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "/auth/forgot-password",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "/auth/reset-password",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = !action.payload.success ? action.payload.message : null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Bilinmeyen kayıt hatası";
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success ? action.payload.user : null;
        state.error = !action.payload.success ? action.payload.message : null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Bilinmeyen giriş hatası";
      })

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success ? action.payload.user : null;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Kimlik doğrulama kontrol edilemedi.";
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = !action.payload.success ? action.payload.message : null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Çıkış sırasında hata.";
      })

      .addCase(updateUserDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = action.payload.user;
          state.error = null;
        } else {
          state.error =
            action.payload.message || "Güncelleme başarısız (backend).";
        }
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Kullanıcı bilgileri güncellenemedi.";
      })

      .addCase(verifyPhoneLogin.pending, (state) => {
        state.isPhoneVerificationLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneLogin.fulfilled, (state, action) => {
        state.isPhoneVerificationLoading = false;
        if (action.payload.success && action.payload.isNewUser === false) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.error = null;
        } else if (
          action.payload.success &&
          action.payload.isNewUser === true
        ) {
          state.isAuthenticated = false;
          state.user = null;
          state.error = null;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.error =
            action.payload.message || "Telefon doğrulama backend'de başarısız.";
        }
      })
      .addCase(verifyPhoneLogin.rejected, (state, action) => {
        state.isPhoneVerificationLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Telefon doğrulama isteği başarısız.";
      })

      .addCase(registerPhoneUser.pending, (state) => {
        state.isPhoneRegisterLoading = true;
        state.error = null;
      })
      .addCase(registerPhoneUser.fulfilled, (state, action) => {
        state.isPhoneRegisterLoading = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.error = null;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.error =
            action.payload.message || "Telefonla kayıt backend'de başarısız.";
        }
      })
      .addCase(registerPhoneUser.rejected, (state, action) => {
        state.isPhoneRegisterLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Telefonla kayıt isteği başarısız.";
      });
  },
});

export const { setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
