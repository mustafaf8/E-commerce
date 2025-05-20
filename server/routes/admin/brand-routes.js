const express = require("express");
const {
  addBrandAdmin,
  updateBrandAdmin,
  deleteBrandAdmin,
  getAllBrandsAdmin,
} = require("../../controllers/admin/brand-controller"); // Birazdan oluşturacağız
// const { authMiddleware, adminCheckMiddleware } = require('../../controllers/auth/auth-controller');

const router = express.Router();

router.post("/add", /* adminCheckMiddleware, */ addBrandAdmin);
router.put("/update/:id", /* adminCheckMiddleware, */ updateBrandAdmin);
router.delete("/delete/:id", /* adminCheckMiddleware, */ deleteBrandAdmin);
router.get("/list", /* adminCheckMiddleware, */ getAllBrandsAdmin);

module.exports = router;
