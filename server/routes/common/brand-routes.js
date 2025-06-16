const express = require("express");

const {
  getActiveBrands,
} = require("../../controllers/common/brand-controller");

const router = express.Router();

router.get("/list", getActiveBrands);

module.exports = router;
