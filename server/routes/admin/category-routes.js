// server/routes/admin/category-routes.js
const express = require("express");
const {
  addCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getAllCategoriesAdmin, // Admin için tüm kategorileri (aktif/pasif) getiren fonksiyon
} = require("../../controllers/admin/category-controller"); // Birazdan oluşturacağız
// const { authMiddleware, adminCheckMiddleware } = require('../../controllers/auth/auth-controller'); // Yetkilendirme eklenebilir

const router = express.Router();

// Admin yetkisi gerektiren rotalar (şimdilik middleware olmadan)
router.post("/add", /* adminCheckMiddleware, */ addCategoryAdmin);
router.put("/update/:id", /* adminCheckMiddleware, */ updateCategoryAdmin);
router.delete("/delete/:id", /* adminCheckMiddleware, */ deleteCategoryAdmin);
router.get("/list", /* adminCheckMiddleware, */ getAllCategoriesAdmin); // Admin listesi için

module.exports = router;
