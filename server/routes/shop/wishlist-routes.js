const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../../controllers/shop/wishlist-controller");
// Auth middleware'ini ekle (kullanıcı girişi gerektiren işlemler için)
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Belirli bir kullanıcının favori listesini getir
// Giriş yapmış kullanıcı kendi listesini almalı, bu yüzden authMiddleware kullanmak iyi olur.
// İsteğe bağlı: Sadece kendi listesini alabilmesi için req.user.id kontrolü controller'da yapılabilir.
router.get("/get/:userId", authMiddleware, getWishlist);

// Favorilere ürün ekle (Giriş yapmış olmayı gerektirir)
router.post("/add", authMiddleware, addToWishlist);

// Favorilerden ürün çıkar (Giriş yapmış olmayı gerektirir)
router.delete("/remove/:userId/:productId", authMiddleware, removeFromWishlist);

module.exports = router;
