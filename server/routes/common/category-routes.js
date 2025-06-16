const express = require("express");

const {
  getActiveCategories,
} = require("../../controllers/common/category-controller");

const router = express.Router();

router.get("/list", getActiveCategories);

module.exports = router;
