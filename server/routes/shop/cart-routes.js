// const express = require("express");

// const {
//   addToCart,
//   fetchCartItems,
//   deleteCartItem,
//   updateCartItemQty,
// } = require("../../controllers/shop/cart-controller");

// const router = express.Router();

// router.post("/add", addToCart);
// router.get("/get/:userId", fetchCartItems);
// router.put("/update-cart", updateCartItemQty);
// router.delete("/:userId/:productId", deleteCartItem);

// module.exports = router;

// server/routes/shop/cart-routes.js
const express = require("express");

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
  syncLocalCart, // Yeni fonksiyon import edildi
} = require("../../controllers/shop/cart-controller");

// authMiddleware'ı da import etmeniz gerekecek
const { authMiddleware } = require("../../controllers/auth/auth-controller"); // Bu satırı ekleyin veya doğru yolu belirtin

const router = express.Router();
router.post("/add", addToCart);
router.get("/get/:userId", authMiddleware, fetchCartItems);
router.put("/update-cart", authMiddleware, updateCartItemQty);
router.delete("/:userId/:productId", authMiddleware, deleteCartItem); // Bu genel bir rota.
router.post("/sync-local", authMiddleware, syncLocalCart);

module.exports = router;
