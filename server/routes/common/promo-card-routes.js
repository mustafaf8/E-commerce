const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const permissionCheckMiddleware = require("../../middleware/permissionCheckMiddleware");

const {
  getPromoCards,
  addPromoCard,
  updatePromoCard,
  deletePromoCard,
} = require("../../controllers/common/promo-card-controller");

const router = express.Router();

router.get("/get", getPromoCards);

router.post("/add", [authMiddleware, adminCheckMiddleware, permissionCheckMiddleware('promotions', 'manage')], addPromoCard);
router.put(
  "/update/:cardId",
  [authMiddleware, adminCheckMiddleware, permissionCheckMiddleware('promotions', 'manage')],
  updatePromoCard
);
router.delete(
  "/delete/:cardId",
  [authMiddleware, adminCheckMiddleware, permissionCheckMiddleware('promotions', 'manage')],
  deletePromoCard
);

module.exports = router;
