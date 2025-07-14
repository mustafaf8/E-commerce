const express = require("express");
const {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  toggleCouponStatus,
} = require("../../controllers/admin/coupon-controller");

const router = express.Router();

// GET /api/admin/coupons - Tüm kuponları getir
router.get("/", getAllCoupons);

// POST /api/admin/coupons - Yeni kupon oluştur
router.post("/", createCoupon);

// GET /api/admin/coupons/:id - Belirli bir kuponu getir
router.get("/:id", getCouponById);

// PUT /api/admin/coupons/:id - Kupon güncelle
router.put("/:id", updateCoupon);

// DELETE /api/admin/coupons/:id - Kupon sil
router.delete("/:id", deleteCoupon);

// PATCH /api/admin/coupons/:id/toggle - Kupon durumunu değiştir
router.patch("/:id/toggle", toggleCouponStatus);

module.exports = router; 