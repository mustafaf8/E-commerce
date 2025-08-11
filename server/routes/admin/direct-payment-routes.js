const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");
const { initiatePayment, handleCallback, getPaymentHistory } = require("../../controllers/admin/direct-payment-controller");

router.post("/initiate", [authMiddleware, adminCheckMiddleware], initiatePayment);
router.post("/callback", handleCallback);
router.get("/history", [authMiddleware, adminCheckMiddleware], getPaymentHistory);

module.exports = router;