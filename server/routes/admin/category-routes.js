const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const permissionCheckMiddleware = require("../../middleware/permissionCheckMiddleware");
const {
  addCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getAllCategoriesAdmin,
  getHeaderCategories,
  updateHeaderOrder,
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
router.get(
  "/header",
  [authMiddleware, adminCheckMiddleware, permissionCheckMiddleware('header-management', 'view')],
  getHeaderCategories
);
router.put(
  "/header/order",
  [authMiddleware, adminCheckMiddleware, permissionCheckMiddleware('header-management', 'manage')],
  updateHeaderOrder
);

module.exports = router;
