const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller"); // Ekleyin
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");

const {
  getMaintenanceStatus,
  updateMaintenanceStatus,
} = require("../../controllers/common/maintenance-controller");
// const { authMiddleware, adminCheckMiddleware } = require('../../controllers/auth/auth-controller'); // Admin koruması için

const router = express.Router();

router.get("/status", getMaintenanceStatus);

router.put(
  "/status",
  [authMiddleware, adminCheckMiddleware],
  updateMaintenanceStatus
);

module.exports = router;
