// server/routes/common/category-routes.js
const express = require("express");
const {
  getActiveCategories,
} = require("../../controllers/common/category-controller"); // Birazdan oluşturacağız

const router = express.Router();

router.get("/list", getActiveCategories); // Aktif kategorileri listele

module.exports = router;
