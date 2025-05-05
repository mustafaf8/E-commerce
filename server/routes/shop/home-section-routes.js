// server/routes/shop/home-section-routes.js
const express = require("express");
const {
  getActiveHomeSectionsShop,
} = require("../../controllers/shop/home-section-controller"); // Birazdan oluşturacağız

const router = express.Router();

router.get("/active", getActiveHomeSectionsShop);

module.exports = router;
