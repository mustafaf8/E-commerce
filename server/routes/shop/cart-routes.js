const express = require("express");

const {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
  applyCoupon,
  syncLocalCart,
} = require("../../controllers/shop/cart-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();
router.post("/add", authMiddleware, addToCart);
router.get("/get/:userId", authMiddleware, fetchCartItems);
router.put("/update-cart", authMiddleware, updateCartItemQty);
router.post("/apply-coupon", applyCoupon);
router.delete("/:userId/:productId", authMiddleware, deleteCartItem);
router.post("/sync-local", authMiddleware, syncLocalCart);

module.exports = router;
