const express = require("express");
const router = express.Router();
const { getLogs, getLogStats, getLogById } = require("../../controllers/admin/log-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");

// Tüm logları getir (sayfalama ve filtreleme ile)
router.get("/", authMiddleware, adminCheckMiddleware, getLogs);

// Log istatistiklerini getir
router.get("/stats", authMiddleware, adminCheckMiddleware, getLogStats);

// Belirli bir logu getir
router.get("/:id", authMiddleware, adminCheckMiddleware, getLogById);

module.exports = router; 