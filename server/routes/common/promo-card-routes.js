// server/routes/common/promo-card-routes.js
const express = require("express");
const {
  getPromoCards,
  addPromoCard,
  deletePromoCard,
} = require("../../controllers/common/promo-card-controller");
// Admin yetkisi için middleware (opsiyonel ama önerilir)
// const { authMiddleware, adminCheckMiddleware } = require('../middleware/authAdmin'); // Varsayımsal middleware

const router = express.Router();

// Herkesin erişebileceği endpoint
router.get("/get", getPromoCards);

// Sadece adminlerin erişebileceği endpoint'ler
// Burada admin yetkisini kontrol eden bir middleware kullanmak en doğrusu olurdu.
// Şimdilik middleware olmadan bırakıyorum, kontrolü controller içinde manuel yapabilirsiniz
// veya authMiddleware + rol kontrolü yapabilirsiniz.
router.post("/add", /* adminCheckMiddleware, */ addPromoCard);
router.delete("/delete/:cardId", /* adminCheckMiddleware, */ deletePromoCard);

module.exports = router;
