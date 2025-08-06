const express = require("express");
const router = express.Router();
const { sendContactMessage } = require("../../controllers/common/contact-controller");

// POST /api/contact/send
router.post("/send", sendContactMessage);

module.exports = router; 