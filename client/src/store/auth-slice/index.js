// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const initialState = {
//   isAuthenticated: false,
//   isLoading: true,
//   user: null,
// };

// export const registerUser = createAsyncThunk(
//   "/auth/register",

//   async (formData) => {
//     const response = await axios.post(
//       "http://localhost:5000/api/auth/register",
//       formData,
//       {
//         withCredentials: true,
//       }
//     );

//     return response.data;
//   }
// );

// export const loginUser = createAsyncThunk(
//   "/auth/login",

//   async (formData) => {
//     const response = await axios.post(
//       "http://localhost:5000/api/auth/login",
//       formData,
//       {
//         withCredentials: true,
//       }
//     );

//     return response.data;
//   }
// );

// export const logoutUser = createAsyncThunk(
//   "/auth/logout",

//   async () => {
//     const response = await axios.post(
//       "http://localhost:5000/api/auth/logout",
//       {},
//       {
//         withCredentials: true,
//       }
//     );

//     return response.data;
//   }
// );

// export const checkAuth = createAsyncThunk(
//   "/auth/checkauth",

//   async () => {
//     // console.log("logoutUser fulfilled. Clearing auth state.");
//     const response = await axios.get(
//       "http://localhost:5000/api/auth/check-auth",
//       {
//         withCredentials: true,
//         headers: {
//           "Cache-Control":
//             "no-store, no-cache, must-revalidate, proxy-revalidate",
//         },
//       }
//     );

//     return response.data;
//   }
// );

// export const updateUserDetails = createAsyncThunk(
//   "/auth/update",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(
//         "http://localhost:5000/api/auth/update",
//         formData,
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         return response.data;
//       } else {
//         return rejectWithValue(response.data);
//       }
//     } catch (error) {
//       return rejectWithValue({ message: "Güncelleme sırasında hata oluştu" });
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {},
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         console.log(action);

//         state.isLoading = false;
//         state.user = action.payload.success ? action.payload.user : null;
//         state.isAuthenticated = action.payload.success;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//       })
//       .addCase(checkAuth.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.success ? action.payload.user : null;
//         state.isAuthenticated = action.payload.success;
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         state.isLoading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//       })
//       .addCase(logoutUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = null;
//         state.isAuthenticated = false;
//       });
//   },
// });

// export const { setUser } = authSlice.actions;
// export default authSlice.reducer;

// client/src/store/auth-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true, // Başlangıçta auth durumu kontrol ediliyor
  isPhoneVerificationLoading: false, // Telefon/OTP doğrulaması için ayrı loading
  isPhoneRegisterLoading: false, // Telefonla kayıt için ayrı loading
  user: null,
  error: null, // Hata mesajlarını saklamak için
};

// --- Mevcut Thunk'lar (registerUser, loginUser, logoutUser, checkAuth, updateUserDetails) ---
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );
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
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true }
      );
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
    // rejectWithValue ekleyelim
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Logout API error:", error.response?.data || error.message);
      // Logout hatası olsa bile state'i temizleyebiliriz veya hatayı iletebiliriz
      return rejectWithValue(
        error.response?.data || { message: "Çıkış yapılamadı." }
      );
      // return { success: false, message: 'Çıkış yapılamadı.' }; // Alternatif: Başarısızlık durumu döndür
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/check-auth",
        {
          withCredentials: true,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
      return response.data;
    } catch (error) {
      // checkAuth başarısızsa (token yok/geçersiz), bu bir hata değil, sadece kullanıcı giriş yapmamış demektir.
      // Bu yüzden rejectWithValue yerine sadece success: false döndürebiliriz.
      console.log(
        "checkAuth failed (likely not logged in):",
        error.response?.status
      );
      return { success: false }; // Kullanıcının giriş yapmadığını belirtir
      // return rejectWithValue(error.response?.data || { message: "Auth check failed" }); // Veya hata olarak işaretle
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "/auth/update",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/update",
        formData,
        { withCredentials: true }
      );
      // Backend success:true dönerse payload'ı direkt döndür
      if (response.data.success) {
        return response.data;
      } else {
        // Backend success:false dönerse, mesajı rejectWithValue ile gönder
        return rejectWithValue(response.data);
      }
    } catch (error) {
      // Axios veya network hatası
      return rejectWithValue(
        error.response?.data || { message: "Güncelleme sırasında hata oluştu" }
      );
    }
  }
);

// --- YENİ Thunk'lar ---

// Backend'e Firebase token gönderip kullanıcı durumunu kontrol etme
export const verifyPhoneLogin = createAsyncThunk(
  "/auth/phone/verify",
  async ({ token }, { rejectWithValue }) => {
    // Argümanı obje olarak alalım
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/phone/verify",
        { token },
        { withCredentials: true }
      );
      return response.data; // { success: true, isNewUser: boolean, user?: {...}, message?: string }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Telefon doğrulama backend hatası" }
      );
    }
  }
);

// Backend'e Firebase token ve kullanıcı adı gönderip yeni kullanıcıyı kaydetme
export const registerPhoneUser = createAsyncThunk(
  "/auth/phone/register",
  async ({ token, userName }, { rejectWithValue }) => {
    // Argümanları obje olarak alalım
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/phone/register",
        { token, userName },
        { withCredentials: true }
      );
      return response.data; // { success: true, user: {...}, message: string }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Telefonla kayıt backend hatası" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // İsteğe bağlı: Hata state'ini temizlemek için bir reducer
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Mevcut Reducer'lar ---
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = !action.payload.success ? action.payload.message : null; // Hata mesajını kaydet
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
        state.isLoading = true; /* error'u burada sıfırlama */
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success ? action.payload.user : null;
        // checkAuth başarısızsa error set etme, bu normal bir durum
        state.error = null; // Başarılı check sonrası hatayı temizle
      })
      .addCase(checkAuth.rejected, (state, action) => {
        // Bu durum genellikle ağ hatası vb. demektir, kullanıcı çıkış yapmış demek değildir.
        state.isLoading = false;
        state.isAuthenticated = false; // Güvenli tarafta kalalım
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
        state.error = !action.payload.success ? action.payload.message : null; // Başarısızsa hatayı al
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Logout hatası olsa bile kullanıcıyı çıkmış kabul et
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
          state.user = action.payload.user; // Kullanıcı bilgilerini güncelle
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

      // --- YENİ Reducer'lar ---

      // verifyPhoneLogin
      .addCase(verifyPhoneLogin.pending, (state) => {
        state.isPhoneVerificationLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneLogin.fulfilled, (state, action) => {
        state.isPhoneVerificationLoading = false;
        if (action.payload.success && action.payload.isNewUser === false) {
          // Mevcut kullanıcı, giriş başarılı
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.error = null;
        } else if (
          action.payload.success &&
          action.payload.isNewUser === true
        ) {
          // Yeni kullanıcı, henüz giriş yapmadı ama doğrulandı
          state.isAuthenticated = false;
          state.user = null; // İsim girilene kadar user null kalsın
          state.error = null;
        } else {
          // Backend success: false döndürdü
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

      // registerPhoneUser
      .addCase(registerPhoneUser.pending, (state) => {
        state.isPhoneRegisterLoading = true;
        state.error = null;
      })
      .addCase(registerPhoneUser.fulfilled, (state, action) => {
        state.isPhoneRegisterLoading = false;
        if (action.payload.success) {
          // Kayıt ve giriş başarılı
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.error = null;
        } else {
          // Backend success: false döndürdü (örn: numara zaten kayıtlı ama login yapılamadı?)
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

export const { setUser, clearAuthError } = authSlice.actions; // clearAuthError'ı export et
export default authSlice.reducer;
