const express = require("express");

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
  syncLocalCart,
} = require("../../controllers/shop/cart-controller");

// authMiddleware'ı da import etmeniz gerekecek
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();
router.post("/add", addToCart);
router.get("/get/:userId", authMiddleware, fetchCartItems);
router.put("/update-cart", authMiddleware, updateCartItemQty);
router.delete("/:userId/:productId", authMiddleware, deleteCartItem);
router.post("/sync-local", authMiddleware, syncLocalCart);

module.exports = router;
