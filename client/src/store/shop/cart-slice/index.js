// import axios from "axios";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const initialState = {
//   cartItems: [],
//   isLoading: false,
//   isCartOpen: false,
// };

// export const addToCart = createAsyncThunk(
//   "cart/addToCart",
//   async ({ userId, productId, quantity }) => {
//     const response = await axios.post(
//       "http://localhost:5000/api/shop/cart/add",
//       {
//         userId,
//         productId,
//         quantity,
//       }
//     );

//     return response.data;
//   }
// );

// export const fetchCartItems = createAsyncThunk(
//   "cart/fetchCartItems",
//   async (userId) => {
//     const response = await axios.get(
//       `http://localhost:5000/api/shop/cart/get/${userId}`
//     );

//     return response.data;
//   }
// );

// export const deleteCartItem = createAsyncThunk(
//   "cart/deleteCartItem",
//   async ({ userId, productId }) => {
//     const response = await axios.delete(
//       `http://localhost:5000/api/shop/cart/${userId}/${productId}`
//     );

//     return response.data;
//   }
// );

// export const updateCartQuantity = createAsyncThunk(
//   "cart/updateCartQuantity",
//   async ({ userId, productId, quantity }) => {
//     const response = await axios.put(
//       "http://localhost:5000/api/shop/cart/update-cart",
//       {
//         userId,
//         productId,
//         quantity,
//       }
//     );

//     return response.data;
//   }
// );

// const shoppingCartSlice = createSlice({
//   name: "shoppingCart",
//   initialState,
//   reducers: {
//     setIsCartOpen: (state, action) => {
//       state.isCartOpen = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addToCart.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(addToCart.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.cartItems = action.payload.data;
//       })
//       .addCase(addToCart.rejected, (state) => {
//         state.isLoading = false;
//         state.cartItems = [];
//       })
//       .addCase(fetchCartItems.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchCartItems.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.cartItems = action.payload.data;
//       })
//       .addCase(fetchCartItems.rejected, (state) => {
//         state.isLoading = false;
//         state.cartItems = [];
//       })
//       .addCase(updateCartQuantity.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(updateCartQuantity.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.cartItems = action.payload.data;
//       })
//       .addCase(updateCartQuantity.rejected, (state) => {
//         state.isLoading = false;
//         state.cartItems = [];
//       })
//       .addCase(deleteCartItem.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(deleteCartItem.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.cartItems = action.payload.data;
//       })
//       .addCase(deleteCartItem.rejected, (state) => {
//         state.isLoading = false;
//         state.cartItems = [];
//       });
//   },
// });

// export const { setIsCartOpen } = shoppingCartSlice.actions;
// export default shoppingCartSlice.reducer;

// client/src/store/shop/cart-slice/index.js
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getGuestCart,
  saveGuestCart,
  clearGuestCart,
  // addProductToGuestCart, // Thunk içinde bu fonksiyonları direkt kullanabiliriz
  // updateGuestCartItemQuantity,
  // removeProductFromGuestCart,
} from "@/lib/guestCartUtils"; // Oluşturduğumuz yardımcı fonksiyonlar

const initialState = {
  cartItems: { items: [], guestCartId: null, _id: null }, // Yapıyı backend'den dönen cart objesine benzetelim
  isLoading: false,
  isCartOpen: false,
  error: null, // Hata yönetimi için
};

// Ürün detaylarını getirmek için (sepete eklerken fiyat vb. bilgiler için)
// Bu thunk zaten product-slice içinde var, onu kullanabiliriz veya burada da bir tane tanımlayabiliriz.
// Şimdilik product-slice'taki fetchProductDetails'ı kullanacağımızı varsayalım.
// addToCart Thunk (Misafir için totalStock kaydını teyit edelim):
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, productDetails },
    { getState, rejectWithValue }
  ) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      try {
        if (!productDetails || productDetails.totalStock === undefined) {
          // totalStock kontrolü eklendi
          return rejectWithValue({
            success: false,
            message:
              "Misafir sepetine eklemek için ürünün stok bilgisi gerekli.",
          });
        }

        const localCart = getGuestCart();
        const existingItem = localCart.items.find(
          (item) => item.productId === productId
        );
        const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

        if (currentQuantityInCart + quantity > productDetails.totalStock) {
          return rejectWithValue({
            success: false,
            message: "Stokta yeterli ürün bulunmamaktadır.",
            isStockError: true,
            availableStock: productDetails.totalStock - currentQuantityInCart,
            requestedQuantity: quantity,
          });
        }

        const updatedCartItems = [...localCart.items];
        const existingItemIndex = updatedCartItems.findIndex(
          (item) => item.productId === productId
        );

        if (existingItemIndex > -1) {
          updatedCartItems[existingItemIndex] = {
            ...updatedCartItems[existingItemIndex],
            quantity: updatedCartItems[existingItemIndex].quantity + quantity,
          };
        } else {
          updatedCartItems.push({
            productId,
            quantity,
            price: productDetails.price,
            salePrice: productDetails.salePrice,
            title: productDetails.title,
            image: productDetails.image,
            totalStock: productDetails.totalStock, // Bu bilgi misafir sepetindeki ürün için önemli
          });
        }
        const newGuestCart = { ...localCart, items: updatedCartItems };
        saveGuestCart(newGuestCart);
        return { success: true, data: newGuestCart, fromLocalStorage: true };
      } catch (error) {
        return rejectWithValue({
          success: false,
          message: error.message || "Yerel sepete eklenemedi.",
        });
      }
    } else {
      // Giriş yapmış kullanıcı için backend çağrısı...
      try {
        const response = await axios.post(
          "http://localhost:5000/api/shop/cart/add",
          { userId: auth.user.id, productId, quantity }
        );
        return { ...response.data, fromLocalStorage: false };
      } catch (error) {
        const errorData = error.response?.data || {
          success: false,
          message: "Sepete eklenemedi (API).",
        };
        if (errorData.isStockError) {
          return rejectWithValue(errorData);
        }
        return rejectWithValue(errorData);
      }
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { getState, rejectWithValue }) => {
    // userId opsiyonel olabilir
    const { auth } = getState();
    if (!auth.isAuthenticated && !userId) {
      try {
        const guestCart = getGuestCart();
        // Misafir sepetindeki ürünlerin güncel fiyatlarını/detaylarını almak iyi bir pratik olabilir
        // Ama bu, her sepet yüklemesinde birden fazla API isteği anlamına gelebilir.
        // Şimdilik localStorage'daki ham veriyi döndürelim.
        // Fiyatlar ödeme adımında backend tarafından doğrulanacak.
        return { success: true, data: guestCart, fromLocalStorage: true };
      } catch (error) {
        return rejectWithValue({
          success: false,
          message: "Yerel sepet yüklenemedi.",
        });
      }
    } else {
      // Giriş yapmış kullanıcı
      try {
        const idToFetch = userId || auth.user.id; // Eğer userId gelirse onu, yoksa state'deki user.id'yi kullan
        if (!idToFetch)
          return rejectWithValue({
            success: false,
            message: "Kullanıcı ID bulunamadı.",
          });
        const response = await axios.get(
          `http://localhost:5000/api/shop/cart/get/${idToFetch}`,
          { withCredentials: true }
        );
        return { ...response.data, fromLocalStorage: false }; // success ve data backend'den gelecek
      } catch (error) {
        return rejectWithValue(
          error.response?.data || {
            success: false,
            message: "Sepet yüklenemedi (API).",
          }
        );
      }
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ productId }, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      // Misafir Kullanıcı: LocalStorage'dan sil
      try {
        const localCart = getGuestCart();
        const updatedItems = localCart.items.filter(
          (item) => item.productId !== productId
        );
        const newGuestCart = { ...localCart, items: updatedItems };
        saveGuestCart(newGuestCart);
        return { success: true, data: newGuestCart, fromLocalStorage: true };
      } catch (error) {
        console.error("Yerel sepetten silme hatası:", error);
        return rejectWithValue({
          success: false,
          message: error.message || "Yerel sepetten silinemedi.",
        });
      }
    } else {
      // Giriş yapmış kullanıcı: Backend'e istek gönder
      try {
        // userId'yi state'den al
        const userId = auth.user.id;
        // Backend endpoint'i :productId parametresini path'ten almalı.
        const response = await axios.delete(
          `http://localhost:5000/api/shop/cart/${userId}/${productId}`,
          { withCredentials: true } // userId backend'de req.user'dan alınacak
        );
        return { ...response.data, fromLocalStorage: false };
      } catch (error) {
        return rejectWithValue(
          error.response?.data || {
            success: false,
            message: "Sepetten silinemedi (API).",
          }
        );
      }
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    // 'quantity' burada YENİ İSTENEN MİKTAR
    const { auth, shopProducts } = getState(); // shopProducts'ı stok kontrolü için alıyoruz

    if (!auth.isAuthenticated) {
      // Misafir Kullanıcı: LocalStorage'ı güncelle
      try {
        const localCart = getGuestCart();
        const itemIndex = localCart.items.findIndex(
          (item) => item.productId === productId
        );

        if (itemIndex === -1) {
          return rejectWithValue({
            success: false,
            message: "Ürün yerel sepette bulunamadı.",
          });
        }

        const cartItemToUpdate = localCart.items[itemIndex];

        // Stok kontrolü: Ürünün toplam stoğu, misafir sepetine eklenirken kaydedilmiş olmalı.
        if (cartItemToUpdate.totalStock === undefined) {
          // Eğer totalStock bilgisi bir şekilde kaydedilmemişse (bu bir hata durumudur),
          // kullanıcıyı yanıltmamak adına işlemi reddetmek daha güvenli olabilir.
          console.warn(
            `Misafir sepetindeki ${productId} için stok bilgisi eksik.`
          );
          // Veya shopProducts.productList'ten anlık olarak çekmeye çalışılabilir ama bu addToCart'ta çözülmeli.
          // Şimdilik, eğer totalStock yoksa stok kontrolü yapılamaz.
          // Bu durum, addToCart misafir path'inde totalStock'un kaydedildiğinden emin olunarak çözülmeli.
        } else if (quantity > cartItemToUpdate.totalStock) {
          return rejectWithValue({
            success: false,
            message: "Stokta yeterli ürün bulunmamaktadır.",
            isStockError: true,
            availableStock: cartItemToUpdate.totalStock, // Mevcut toplam stok
            requestedQuantity: quantity,
          });
        }

        const updatedItems = [...localCart.items]; // Sepet öğelerinin bir kopyasını oluştur

        if (quantity <= 0) {
          // İstenen yeni miktar 0 veya daha az ise ürünü sil
          updatedItems.splice(itemIndex, 1);
        } else {
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: quantity,
          };
        }

        const newGuestCart = { ...localCart, items: updatedItems };
        saveGuestCart(newGuestCart);
        return { success: true, data: newGuestCart, fromLocalStorage: true };
      } catch (error) {
        console.error("Yerel sepet güncelleme hatası:", error);
        return rejectWithValue({
          success: false,
          message: error.message || "Yerel sepet güncellenemedi.",
        });
      }
    } else {
      // Giriş yapmış kullanıcı: Backend'e istek gönder
      try {
        const response = await axios.put(
          "http://localhost:5000/api/shop/cart/update-cart", // Endpoint'i kontrol et, /update-cart veya /update-item
          { productId, quantity }, // userId backend'de req.user'dan alınacak
          { withCredentials: true }
        );
        return { ...response.data, fromLocalStorage: false };
      } catch (error) {
        const errorData = error.response?.data || {
          success: false,
          message: "Sepet güncellenemedi (API).",
        };
        if (errorData.isStockError) {
          // Backend'den gelebilecek stok hatasını da yakala
          return rejectWithValue(errorData);
        }
        return rejectWithValue(errorData);
      }
    }
  }
);

// YENİ THUNK: Giriş yapıldığında yerel sepeti backend ile senkronize et
export const syncLocalCartToBackend = createAsyncThunk(
  "cart/syncLocalCart",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated || !auth.user?.id) {
      return rejectWithValue({
        success: false,
        message: "Senkronizasyon için kullanıcı girişi gerekli.",
      });
    }

    const localCart = getGuestCart();
    if (localCart.items.length === 0) {
      // Senkronize edilecek bir şey yoksa, sadece backend sepetini çek
      await dispatch(fetchCartItems(auth.user.id));
      return {
        success: true,
        message: "Yerel sepet boş, backend sepeti çekildi.",
      };
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/shop/cart/sync-local`,
        { userId: auth.user.id, localCartItems: localCart.items },
        { withCredentials: true }
      );
      if (response.data.success) {
        clearGuestCart(); // Başarılı senkronizasyon sonrası yerel sepeti temizle
        // Senkronize edilmiş sepeti state'e yazmak için fetchCartItems'ı tekrar çağırmak yerine
        // doğrudan backend'den dönen güncel sepeti kullanabiliriz.
        return { ...response.data, fromLocalStorage: false }; // Backend'den dönen güncel sepet
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Sepet senkronizasyonu başarısız (API).",
        }
      );
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    setIsCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    // Misafir sepetini state'e yüklemek için bir reducer (opsiyonel, thunk da yapabilir)
    loadGuestCartToState: (state, action) => {
      state.cartItems = action.payload || { items: [], guestCartId: null };
      state.isLoading = false;
      state.error = null;
    },
    clearCartState: (state) => {
      // Logout sonrası veya sepet temizleme için
      state.cartItems = { items: [], guestCartId: null, _id: null };
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
    };
    const handleFulfilled = (state, action) => {
      state.isLoading = false;
      if (action.payload?.success) {
        state.cartItems = action.payload.data || {
          items: [],
          guestCartId: null,
          _id: null,
        }; // API'den gelen veya yerel sepet
      } else {
        // Eğer backend success:false döndürürse veya payload'da data yoksa
        state.error = action.payload?.message || "Sepet işlemi başarısız oldu.";
        // state.cartItems'ı boşaltmak yerine mevcutu koruyabiliriz, kullanıcıya hata gösterilir.
      }
    };
    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error =
        action.payload?.message ||
        action.error?.message ||
        "Bilinmeyen bir sepet hatası oluştu.";
      // Hata durumunda sepeti boşaltmak yerine mevcutu koruyabiliriz.
    };

    builder
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, (state, action) => {
        // addToCart için özel reject handling
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Sepete eklenemedi.";
        if (action.payload?.isStockError) {
          // Toast mesajı burada veya component'te gösterilebilir.
          // state.error = `Stokta yeterli ürün yok. En fazla ${action.payload.availableStock} adet eklenebilir.`;
        }
      })
      .addCase(fetchCartItems.pending, handlePending)
      .addCase(fetchCartItems.fulfilled, handleFulfilled)
      .addCase(fetchCartItems.rejected, handleRejected)
      .addCase(updateCartQuantity.pending, handlePending)
      .addCase(updateCartQuantity.fulfilled, handleFulfilled)
      .addCase(updateCartQuantity.rejected, (state, action) => {
        // updateCartQuantity için özel reject handling
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Miktar güncellenemedi.";
        if (action.payload?.isStockError) {
          // state.error = `Stokta yeterli ürün yok. En fazla ${action.payload.availableStock} adet seçilebilir.`;
        }
      })
      .addCase(deleteCartItem.pending, handlePending)
      .addCase(deleteCartItem.fulfilled, handleFulfilled)
      .addCase(deleteCartItem.rejected, handleRejected)
      .addCase(syncLocalCartToBackend.pending, handlePending)
      .addCase(syncLocalCartToBackend.fulfilled, handleFulfilled) // sync sonrası backend'den dönen güncel sepeti alır
      .addCase(syncLocalCartToBackend.rejected, handleRejected);
  },
});

export const { setIsCartOpen, loadGuestCartToState, clearCartState } =
  shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
