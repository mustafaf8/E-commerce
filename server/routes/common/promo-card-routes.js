const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");

const {
  getPromoCards,
  addPromoCard,
  deletePromoCard,
} = require("../../controllers/common/promo-card-controller");

const router = express.Router();

router.get("/get", getPromoCards);

router.post("/add", [authMiddleware, adminCheckMiddleware], addPromoCard);
router.delete(
  "/delete/:cardId",
  [authMiddleware, adminCheckMiddleware],
  deletePromoCard
);

module.exports = router;
