const express = require("express");
const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/common/feature-controller");
// const { authMiddleware, adminCheckMiddleware } = require('../middleware/authAdmin'); // Opsiyonel Admin Middleware

const router = express.Router();

router.get("/get", getFeatureImages);

router.post("/add", /* adminCheckMiddleware, */ addFeatureImage);
router.delete(
  "/delete/:imageId",
  /* adminCheckMiddleware, */ deleteFeatureImage
);

module.exports = router;
