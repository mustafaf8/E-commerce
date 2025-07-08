const express = require("express");
const router = express.Router();
const {
  listAdmins,
  updateAdminAuthorization,
} = require("../../controllers/admin/authorization-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

// Ensure only admin (level 1 check will be inside controller maybe client) but still admin role.
router.use(authMiddleware, adminCheckMiddleware);

// Level1 only middleware
router.use((req, res, next) => {
  if (req.user && (req.user.adminAccessLevel === 1 || req.user.adminAccessLevel === undefined)) {
    return next();
  }
  return res.status(403).json({ success: false, message: "Yetersiz yetki." });
});

router.get("/admins", listAdmins);
router.put("/:adminId", updateAdminAuthorization);

module.exports = router; 