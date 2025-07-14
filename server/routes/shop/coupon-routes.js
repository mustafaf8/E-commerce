const express = require("express");
const {
  getActiveCampaignCoupons,
} = require("../../controllers/shop/coupon-controller");

const router = express.Router();

// Kampanya kuponlarını getir
router.get("/campaigns", getActiveCampaignCoupons);

module.exports = router;
