const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");

const {
  addHomeSectionAdmin,
  getAllHomeSectionsAdmin,
  updateHomeSectionAdmin,
  deleteHomeSectionAdmin,
  updateHomeSectionsOrderAdmin,
} = require("../../controllers/admin/home-section-controller"); // Birazdan oluşturacağız
// const { authMiddleware, adminCheckMiddleware } = require('../../controllers/auth/auth-controller');

const router = express.Router();

router.post(
  "/add",
  [authMiddleware, adminCheckMiddleware],
  addHomeSectionAdmin
);
router.get(
  "/list",
  [authMiddleware, adminCheckMiddleware],
  getAllHomeSectionsAdmin
);
router.put(
  "/update/:id",
  [authMiddleware, adminCheckMiddleware],
  updateHomeSectionAdmin
);
router.delete(
  "/delete/:id",
  [authMiddleware, adminCheckMiddleware],
  deleteHomeSectionAdmin
);
router.put(
  "/reorder",
  [authMiddleware, adminCheckMiddleware],
  updateHomeSectionsOrderAdmin
);

module.exports = router;
