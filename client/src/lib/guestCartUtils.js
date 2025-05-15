// client/src/lib/guestCartUtils.js

const GUEST_CART_KEY = "guestCartData"; // Anahtar adını değiştirdim, daha genel

/**
 * Misafir sepetini localStorage'dan alır.
 * Eğer sepet yoksa veya geçersizse, boş bir sepet yapısı döndürür.
 * @returns {object} Misafir sepeti { items: [], guestCartId: string }
 */
export const getGuestCart = () => {
  try {
    const cartJson = localStorage.getItem(GUEST_CART_KEY);
    if (cartJson) {
      const parsedCart = JSON.parse(cartJson);
      // Temel doğrulama: items alanı bir dizi mi?
      if (Array.isArray(parsedCart.items)) {
        return parsedCart;
      }
    }
    // Geçerli sepet yoksa yeni bir tane oluştur
    return {
      items: [],
      guestCartId: `guest_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,
    };
  } catch (error) {
    console.error("Error reading guest cart from localStorage:", error);
    return {
      items: [],
      guestCartId: `guest_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,
    };
  }
};

/**
 * Misafir sepetini localStorage'a kaydeder.
 * @param {object} cart Kaydedilecek sepet objesi { items: [], guestCartId: string }
 */
export const saveGuestCart = (cart) => {
  try {
    if (cart && Array.isArray(cart.items) && cart.guestCartId) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    } else {
      console.warn("Attempted to save an invalid guest cart structure:", cart);
    }
  } catch (error) {
    console.error("Error saving guest cart to localStorage:", error);
  }
};

/**
 * Misafir sepetini localStorage'dan temizler.
 */
export const clearGuestCart = () => {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch (error) {
    console.error("Error clearing guest cart from localStorage:", error);
  }
};

/**
 * Misafir sepetine ürün ekler veya miktarını günceller.
 * @param {string} productId Eklenecek ürünün ID'si
 * @param {number} quantity Eklenecek miktar
 * @param {object} productDetails Ürün detayları (price, salePrice, title, image)
 * @returns {object} Güncellenmiş misafir sepeti
 */
export const addProductToGuestCart = (productId, quantity, productDetails) => {
  const cart = getGuestCart();
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId === productId
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      // Misafir sepetinde de fiyat gibi temel bilgileri tutmak, toplamı hesaplarken kolaylık sağlar
      price: productDetails.price,
      salePrice: productDetails.salePrice,
      title: productDetails.title,
      image: productDetails.image,
    });
  }
  saveGuestCart(cart);
  return cart;
};

/**
 * Misafir sepetinden ürünün miktarını günceller.
 * @param {string} productId Güncellenecek ürünün ID'si
 * @param {number} newQuantity Yeni miktar
 * @returns {object} Güncellenmiş misafir sepeti
 */
export const updateGuestCartItemQuantity = (productId, newQuantity) => {
  const cart = getGuestCart();
  const itemIndex = cart.items.findIndex(
    (item) => item.productId === productId
  );

  if (itemIndex > -1) {
    if (newQuantity <= 0) {
      // Miktar 0 veya daha az ise ürünü sil
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQuantity;
    }
    saveGuestCart(cart);
  }
  return cart;
};

/**
 * Misafir sepetinden ürünü siler.
 * @param {string} productId Silinecek ürünün ID'si
 * @returns {object} Güncellenmiş misafir sepeti
 */
export const removeProductFromGuestCart = (productId) => {
  const cart = getGuestCart();
  cart.items = cart.items.filter((item) => item.productId !== productId);
  saveGuestCart(cart);
  return cart;
};
