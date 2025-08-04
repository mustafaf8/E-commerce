const express = require("express");
const {
  getSalesOverview,
  getOrderStatusDistribution,
  getTopSellingProducts,
  getSalesByCategory,
  getSalesByBrand,
  getUserSummary,
  getTopCustomers,
  getProductSummary,
  getSalesTrend,
  getUserRegistrationsTrend,
  getTopLikedProducts,
  getProfitOverview,
  getProfitByProduct,
  getProfitByCategory,
  getProfitByBrand,
  exportData,
} = require("../../controllers/admin/statsAdminController");

const router = express.Router();

router.get("/sales-overview", getSalesOverview);
router.get("/order-status-distribution", getOrderStatusDistribution);
router.get("/top-selling-products", getTopSellingProducts);
router.get("/sales-by-category", getSalesByCategory);
router.get("/sales-by-brand", getSalesByBrand);
router.get("/user-summary", getUserSummary);
router.get("/top-customers", getTopCustomers);
router.get("/product-summary", getProductSummary);
router.get("/sales-trend", getSalesTrend);
router.get("/user-registrations-trend", getUserRegistrationsTrend);
router.get("/top-liked-products", getTopLikedProducts);

router.get("/profit-overview", getProfitOverview);
router.get("/profit-by-product", getProfitByProduct);
router.get("/profit-by-category", getProfitByCategory);
router.get("/profit-by-brand", getProfitByBrand);

// CSV export route
router.post("/export", exportData);

module.exports = router;
