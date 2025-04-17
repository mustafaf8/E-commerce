// const express = require("express");

// const {
//   addFeatureImage,
//   getFeatureImages,
// } = require("../../controllers/common/feature-controller");

// const router = express.Router();

// router.post("/add", addFeatureImage);
// router.get("/get", getFeatureImages);

// module.exports = router;

// server/routes/common/feature-routes.js
const express = require("express");
const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage, // Yeni controller fonksiyonunu import et
} = require("../../controllers/common/feature-controller");
// const { authMiddleware, adminCheckMiddleware } = require('../middleware/authAdmin'); // Opsiyonel Admin Middleware

const router = express.Router();

// Herkes erişebilir
router.get("/get", getFeatureImages);

// Admin erişimi gerektirir (Middleware eklenmeli)
router.post("/add", /* adminCheckMiddleware, */ addFeatureImage);
router.delete(
  "/delete/:imageId",
  /* adminCheckMiddleware, */ deleteFeatureImage
); // <<< YENİ DELETE ROUTE'U

module.exports = router;
