const express = require("express");

const { searchProducts, suggestSearch } = require("../../controllers/shop/search-controller");
const router = express.Router();

router.get("/", searchProducts);
router.get("/suggest", suggestSearch);
module.exports = router;
