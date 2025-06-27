const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../../controllers/shop/wishlist-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/get/:userId", authMiddleware, getWishlist);

router.post("/add", authMiddleware, addToWishlist);

router.delete("/remove/:userId/:productId", authMiddleware, removeFromWishlist);

module.exports = router;
