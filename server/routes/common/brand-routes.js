// server/routes/common/brand-routes.js
const express = require("express");
const {
  getActiveBrands,
} = require("../../controllers/common/brand-controller"); // Birazdan oluşturacağız

const router = express.Router();

router.get("/list", getActiveBrands);

module.exports = router;
