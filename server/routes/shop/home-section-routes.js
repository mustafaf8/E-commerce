const express = require("express");

const {
  getActiveHomeSectionsShop,
} = require("../../controllers/shop/home-section-controller");

const router = express.Router();

router.get("/active", getActiveHomeSectionsShop);

module.exports = router;
