const express = require("express");
const router = express.Router();
const { getLogs, getLogStats, getLogById } = require("../../controllers/admin/log-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const permissionCheckMiddleware = require("../../middleware/permissionCheckMiddleware");

// Tüm logları getir (sayfalama ve filtreleme ile)
router.get("/", authMiddleware, adminCheckMiddleware, permissionCheckMiddleware('logs', 'view'), getLogs);

// Log istatistiklerini getir
router.get("/stats", authMiddleware, adminCheckMiddleware, permissionCheckMiddleware('logs', 'view'), getLogStats);

// Belirli bir logu getir
router.get("/:id", authMiddleware, adminCheckMiddleware, permissionCheckMiddleware('logs', 'view'), getLogById);

module.exports = router; 