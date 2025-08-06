const express = require("express");
const router = express.Router();
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const {
  getAllReviewsAdmin,
  updateReviewStatusAdmin,
  deleteReviewAdmin
} = require("../../controllers/admin/review-controller");

// Admin middleware'i geri ekliyoruz
router.use(adminCheckMiddleware);

// GET /api/admin/reviews - Tüm yorumları getir
router.get("/", getAllReviewsAdmin);

// PUT /api/admin/reviews/:id/status - Yorum durumunu güncelle
router.put("/:id/status", updateReviewStatusAdmin);

// DELETE /api/admin/reviews/:id - Yorumu sil
router.delete("/:id", deleteReviewAdmin);

module.exports = router; 