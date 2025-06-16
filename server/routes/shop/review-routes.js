const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", authMiddleware, addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;
