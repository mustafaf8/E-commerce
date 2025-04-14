// server/routes/common/side-banner-routes.js
const express = require("express");
const {
  getSideBanners,
  addSideBanner,
  deleteSideBanner,
} = require("../../controllers/common/side-banner-controller");
// const { authMiddleware, adminCheckMiddleware } = require('../middleware/authAdmin'); // Opsiyonel middleware

const router = express.Router();

// Herkes erişebilir
router.get("/get", getSideBanners);

// Admin erişimi (Middleware eklenmeli)
router.post("/add", /* adminCheckMiddleware, */ addSideBanner);
router.delete(
  "/delete/:bannerId",
  /* adminCheckMiddleware, */ deleteSideBanner
); // Parametre adı bannerId

module.exports = router;
