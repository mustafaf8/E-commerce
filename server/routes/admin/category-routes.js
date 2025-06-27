const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const {
  addCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getAllCategoriesAdmin,
} = require("../../controllers/admin/category-controller");

const router = express.Router();

router.post("/add", [authMiddleware, adminCheckMiddleware], addCategoryAdmin);
router.put(
  "/update/:id",
  [authMiddleware, adminCheckMiddleware],
  updateCategoryAdmin
);
router.delete(
  "/delete/:id",
  [authMiddleware, adminCheckMiddleware],
  deleteCategoryAdmin
);
router.get(
  "/list",
  [authMiddleware, adminCheckMiddleware],
  getAllCategoriesAdmin
);

module.exports = router;
