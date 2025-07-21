const express = require("express");
const router = express.Router();
const { getCurrentRate } = require("../../controllers/common/currency-controller");

router.get("/rate", getCurrentRate);

module.exports = router; 