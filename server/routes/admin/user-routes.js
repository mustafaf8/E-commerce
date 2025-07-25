const express = require("express");
const router = express.Router();
const {
  getAdminUsers,
  getRegularUsers,
  makeAdmin,
  removeAdmin
} = require("../../controllers/admin/user-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

// Yalnızca admin rolüne sahip kullanıcıların erişebileceği route'lar
router.use(authMiddleware, adminCheckMiddleware);

// Kullanıcı listeleme endpoint'leri
router.get("/admins", getAdminUsers);
router.get("/regular", getRegularUsers);

// Kullanıcı rollerini değiştirme endpoint'leri
router.put("/make-admin/:userId", makeAdmin);
router.put("/remove-admin/:userId", removeAdmin);

module.exports = router; 