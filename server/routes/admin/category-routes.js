const express = require("express");
const {
  addCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getAllCategoriesAdmin,
} = require("../../controllers/admin/category-controller"); // Birazdan oluşturacağız
// const { authMiddleware, adminCheckMiddleware } = require('../../controllers/auth/auth-controller'); // Yetkilendirme eklenebilir

const router = express.Router();

router.post("/add", /* adminCheckMiddleware, */ addCategoryAdmin);
router.put("/update/:id", /* adminCheckMiddleware, */ updateCategoryAdmin);
router.delete("/delete/:id", /* adminCheckMiddleware, */ deleteCategoryAdmin);
router.get("/list", /* adminCheckMiddleware, */ getAllCategoriesAdmin);

module.exports = router;
