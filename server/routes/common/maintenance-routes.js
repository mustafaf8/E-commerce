const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const permissionCheckMiddleware = require("../../middleware/permissionCheckMiddleware");

const {
  getMaintenanceStatus,
  updateMaintenanceStatus,
} = require("../../controllers/common/maintenance-controller");

const router = express.Router();
router.get("/status", getMaintenanceStatus);

router.put(
  "/status",
  [authMiddleware, adminCheckMiddleware, permissionCheckMiddleware('maintenance', 'manage')],
  updateMaintenanceStatus
);

module.exports = router;
