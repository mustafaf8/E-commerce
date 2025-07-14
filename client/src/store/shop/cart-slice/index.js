import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getGuestCart,
  saveGuestCart,
  clearGuestCart,
} from "@/lib/guestCartUtils";
import api from "../../../api/axiosInstance";

const initialState = {
  cartItems: { items: [], guestCartId: null, _id: null },
  addingProductId: null,
  isLoading: false,
  isCartOpen: false,
  error: null,
  appliedCoupon: null,
  discountAmount: 0,
  couponLoading: false,
  couponError: null,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, productDetails },
    { getState, rejectWithValue }
  ) => {
    const { auth, shopCart } = getState();

    if (!auth.isAuthenticated) {
      try {
        if (!productDetails || productDetails.totalStock === undefined) {
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
            totalStock: productDetails.totalStock,
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
      const existingItem = shopCart.cartItems.items.find(
        (item) => item.productId === productId
      );
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

      if (currentQuantityInCart + quantity > productDetails.totalStock) {
        return rejectWithValue({
          success: false,
          message: `Stokta yeterli ürün bulunmamaktadır. Sepetinizde ${currentQuantityInCart} adet var.`,
          isStockError: true,
          availableStock: productDetails.totalStock - currentQuantityInCart,
        });
      }
      try {
        const response = await api.post("/shop/cart/add", {
          userId: auth.user.id,
          productId,
          quantity,
        });
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
    const { auth } = getState();
    if (!auth.isAuthenticated && !userId) {
      try {
        const guestCart = getGuestCart();
        return { success: true, data: guestCart, fromLocalStorage: true };
      } catch (error) {
        return rejectWithValue({
          success: false,
          message: error.message || "Yerel sepet yüklenemedi.",
        });
      }
    } else {
      try {
        const idToFetch = userId || auth.user.id;
        if (!idToFetch)
          return rejectWithValue({
            success: false,
            message: "Kullanıcı ID bulunamadı.",
          });
        const response = await api.get(`/shop/cart/get/${idToFetch}`, {
          withCredentials: true,
        });
        return { ...response.data, fromLocalStorage: false };
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
      try {
        const localCart = getGuestCart();
        const updatedItems = localCart.items.filter(
          (item) => item.productId !== productId
        );
        const newGuestCart = { ...localCart, items: updatedItems };
        saveGuestCart(newGuestCart);
        return { success: true, data: newGuestCart, fromLocalStorage: true };
      } catch (error) {
       // console.error("Yerel sepetten silme hatası:", error);
        return rejectWithValue({
          success: false,
          message: error.message || "Yerel sepetten silinemedi.",
        });
      }
    } else {
      try {
        const userId = auth.user.id;
        const response = await api.delete(`/shop/cart/${userId}/${productId}`, {
          withCredentials: true,
        });
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
    const { auth, shopCart } = getState();
    if (!auth.isAuthenticated) {
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

        if (cartItemToUpdate.totalStock === undefined) {
         // console.warn(
         //   `Misafir sepetindeki ${productId} için stok bilgisi eksik.`
         // );
        } else if (quantity > cartItemToUpdate.totalStock) {
          return rejectWithValue({
            success: false,
            message: "Stokta yeterli ürün bulunmamaktadır.",
            isStockError: true,
            availableStock: cartItemToUpdate.totalStock,
            requestedQuantity: quantity,
          });
        }

        const updatedItems = [...localCart.items];

        if (quantity <= 0) {
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
       // console.error("Yerel sepet güncelleme hatası:", error);
        return rejectWithValue({
          success: false,
          message: error.message || "Yerel sepet güncellenemedi.",
        });
      }
    } else {
      const itemToUpdate = shopCart.cartItems.items.find(
        (item) => item.productId === productId
      );

      if (itemToUpdate && itemToUpdate.totalStock !== undefined) {
        if (quantity > itemToUpdate.totalStock) {
          return rejectWithValue({
            success: false,
            message: `Stokta yeterli ürün bulunmamaktadır. En fazla ${itemToUpdate.totalStock} adet eklenebilir.`,
            isStockError: true,
            availableStock: itemToUpdate.totalStock,
          });
        }
      }
      try {
        const response = await api.put(
          "/shop/cart/update-cart",
          { productId, quantity },
          { withCredentials: true }
        );
        return { ...response.data, fromLocalStorage: false };
      } catch (error) {
        const errorData = error.response?.data || {
          success: false,
          message: "Sepet güncellenemedi (API).",
        };
        if (errorData.isStockError) {
          return rejectWithValue(errorData);
        }
        return rejectWithValue(errorData);
      }
    }
  }
);

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
      await dispatch(fetchCartItems(auth.user.id));
      return {
        success: true,
        message: "Yerel sepet boş, backend sepeti çekildi.",
      };
    }

    try {
      const response = await api.post(
        `/shop/cart/sync-local`,
        { userId: auth.user.id, localCartItems: localCart.items },
        { withCredentials: true }
      );
      if (response.data.success) {
        clearGuestCart();
        return { ...response.data, fromLocalStorage: false };
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

export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async ({ couponCode, cartTotal }, { getState, rejectWithValue }) => {
    try {
      const response = await api.post(
        "/shop/cart/apply-coupon",
        { 
          couponCode,
          cartTotal 
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Kupon uygulanamadı.",
        }
      );
    }
  }
);

export const removeCoupon = createAsyncThunk(
  "cart/removeCoupon",
  async (_, { rejectWithValue }) => {
    try {
      // Kupon kaldırma işlemi - sadece state'i temizleriz
      return {
        success: true,
        message: "Kupon kaldırıldı.",
      };
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: "Kupon kaldırılamadı.",
      });
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
    loadGuestCartToState: (state, action) => {
      state.cartItems = action.payload || { items: [], guestCartId: null };
      state.isLoading = false;
      state.error = null;
    },
    clearCartState: (state) => {
      state.cartItems = { items: [], guestCartId: null, _id: null };
      state.isLoading = false;
      state.error = null;
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.couponError = null;
    },
    clearCouponState: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.couponError = null;
      state.couponLoading = false;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state, action) => {
      state.isLoading = true;
      state.error = null;
      if (action.type === "cart/addToCart/pending") {
        state.addingProductId = action.meta.arg.productId;
      }
    };
    const handleFulfilled = (state, action) => {
      state.isLoading = false;
      state.addingProductId = null;
      if (action.payload?.success) {
        state.cartItems = action.payload.data || {
          items: [],
          guestCartId: null,
          _id: null,
        };
      } else {
        state.error = action.payload?.message || "Sepet işlemi başarısız oldu.";
      }
    };
    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.addingProductId = null;
      if (action.payload?.isStockError) {
        state.error =
          action.payload.message || "Stokta yeterli ürün bulunmamaktadır.";
      } else {
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Bilinmeyen bir hata oluştu.";
      }
    };

    builder
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, handleRejected)

      .addCase(fetchCartItems.pending, handlePending)
      .addCase(fetchCartItems.fulfilled, handleFulfilled)
      .addCase(fetchCartItems.rejected, handleRejected)

      .addCase(updateCartQuantity.pending, handlePending)
      .addCase(updateCartQuantity.fulfilled, handleFulfilled)
      .addCase(updateCartQuantity.rejected, handleRejected)

      .addCase(deleteCartItem.pending, handlePending)
      .addCase(deleteCartItem.fulfilled, handleFulfilled)
      .addCase(deleteCartItem.rejected, handleRejected)

      .addCase(syncLocalCartToBackend.pending, handlePending)
      .addCase(syncLocalCartToBackend.fulfilled, handleFulfilled)
      .addCase(syncLocalCartToBackend.rejected, handleRejected)

      // Kupon işlemleri
      .addCase(applyCoupon.pending, (state) => {
        state.couponLoading = true;
        state.couponError = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.couponLoading = false;
        if (action.payload?.success) {
          state.appliedCoupon = action.payload.coupon;
          state.discountAmount = action.payload.discountAmount;
          state.couponError = null;
        } else {
          state.couponError = action.payload?.message || "Kupon uygulanamadı.";
        }
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload?.message || "Kupon uygulanamadı.";
      })

      .addCase(removeCoupon.pending, (state) => {
        state.couponLoading = true;
      })
      .addCase(removeCoupon.fulfilled, (state) => {
        state.couponLoading = false;
        state.appliedCoupon = null;
        state.discountAmount = 0;
        state.couponError = null;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.couponLoading = false;
        state.couponError = action.payload?.message || "Kupon kaldırılamadı.";
      });
  },
});

export const { setIsCartOpen, loadGuestCartToState, clearCartState, clearCouponState } =
  shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
