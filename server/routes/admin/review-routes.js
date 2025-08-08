const express = require("express");
const router = express.Router();
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const permissionCheckMiddleware = require("../../middleware/permissionCheckMiddleware");
const {
  getAllReviewsAdmin,
  updateReviewStatusAdmin,
  deleteReviewAdmin
} = require("../../controllers/admin/review-controller");

// Admin middleware'i geri ekliyoruz
router.use(adminCheckMiddleware);

// GET /api/admin/reviews - Tüm yorumları getir
router.get("/", permissionCheckMiddleware('reviews', 'view'), getAllReviewsAdmin);

// PUT /api/admin/reviews/:id/status - Yorum durumunu güncelle
router.put("/:id/status", permissionCheckMiddleware('reviews', 'manage'), updateReviewStatusAdmin);

// DELETE /api/admin/reviews/:id - Yorumu sil
router.delete("/:id", permissionCheckMiddleware('reviews', 'manage'), deleteReviewAdmin);

module.exports = router; 