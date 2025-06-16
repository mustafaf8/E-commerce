const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");

const {
  getSideBanners,
  addSideBanner,
  deleteSideBanner,
} = require("../../controllers/common/side-banner-controller");

const router = express.Router();

router.get("/get", getSideBanners);

router.post("/add", [authMiddleware, adminCheckMiddleware], addSideBanner);
router.delete(
  "/delete/:bannerId",
  [authMiddleware, adminCheckMiddleware],
  deleteSideBanner
);

module.exports = router;
