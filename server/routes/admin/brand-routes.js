const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const {
  addBrandAdmin,
  updateBrandAdmin,
  deleteBrandAdmin,
  getAllBrandsAdmin,
} = require("../../controllers/admin/brand-controller"); // Birazdan oluşturacağız
// const { authMiddleware, adminCheckMiddleware } = require('../../controllers/auth/auth-controller');

const router = express.Router();

router.post("/add", [authMiddleware, adminCheckMiddleware], addBrandAdmin);
router.put(
  "/update/:id",
  [authMiddleware, adminCheckMiddleware],
  updateBrandAdmin
);
router.delete(
  "/delete/:id",
  [authMiddleware, adminCheckMiddleware],
  deleteBrandAdmin
);
router.get("/list", [authMiddleware, adminCheckMiddleware], getAllBrandsAdmin);

module.exports = router;
