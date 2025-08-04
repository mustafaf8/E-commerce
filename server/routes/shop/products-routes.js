const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getProductStock,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/stock/:id", getProductStock);

module.exports = router;
