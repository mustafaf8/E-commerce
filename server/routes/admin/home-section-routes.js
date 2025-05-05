// server/routes/admin/home-section-routes.js
const express = require("express");
const {
  addHomeSectionAdmin,
  getAllHomeSectionsAdmin,
  updateHomeSectionAdmin,
  deleteHomeSectionAdmin,
  updateHomeSectionsOrderAdmin,
} = require("../../controllers/admin/home-section-controller"); // Birazdan oluşturacağız
// const { authMiddleware, adminCheckMiddleware } = require('../../controllers/auth/auth-controller');

const router = express.Router();

// Admin yetkisi gerektiren rotalar
router.post("/add", /* adminCheckMiddleware, */ addHomeSectionAdmin);
router.get("/list", /* adminCheckMiddleware, */ getAllHomeSectionsAdmin);
router.put("/update/:id", /* adminCheckMiddleware, */ updateHomeSectionAdmin);
router.delete(
  "/delete/:id",
  /* adminCheckMiddleware, */ deleteHomeSectionAdmin
);
router.put(
  "/reorder",
  /* adminCheckMiddleware, */ updateHomeSectionsOrderAdmin
); // Sıralama için

module.exports = router;
