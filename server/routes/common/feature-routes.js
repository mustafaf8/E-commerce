const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
// const { authMiddleware, adminCheckMiddleware } = require('../middleware/authAdmin'); // Opsiyonel Admin Middleware

const router = express.Router();

router.get("/get", getFeatureImages);

router.post("/add", [authMiddleware, adminCheckMiddleware], addFeatureImage);
router.delete(
  "/delete/:imageId",
  [authMiddleware, adminCheckMiddleware],
  deleteFeatureImage
);

module.exports = router;
