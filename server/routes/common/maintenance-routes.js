const express = require("express");
const {
  getMaintenanceStatus,
  updateMaintenanceStatus,
} = require("../../controllers/common/maintenance-controller");
// const { authMiddleware, adminCheckMiddleware } = require('../../controllers/auth/auth-controller'); // Admin koruması için

const router = express.Router();

// Herkesin erişebileceği durum sorgulama endpoint'i
router.get("/status", getMaintenanceStatus);

// Sadece adminlerin erişmesi gereken güncelleme endpoint'i
// TODO: Bu route'u admin middleware ile koruyun.
router.put(
  "/status",
  /* authMiddleware, adminCheckMiddleware, */ updateMaintenanceStatus
);

module.exports = router;
