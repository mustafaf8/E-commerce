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
router.get(
  "/sales-trend",
  require("../../controllers/admin/statsAdminController").getSalesTrend
);
router.get(
  "/user-registrations-trend",
  require("../../controllers/admin/statsAdminController")
    .getUserRegistrationsTrend
);
router.get(
  "/top-liked-products",
  require("../../controllers/admin/statsAdminController").getTopLikedProducts
);

router.get(
  "/profit-overview",
  require("../../controllers/admin/statsAdminController").getProfitOverview
);
router.get(
  "/profit-by-product",
  require("../../controllers/admin/statsAdminController").getProfitByProduct
);
router.get(
  "/profit-by-category",
  require("../../controllers/admin/statsAdminController").getProfitByCategory
);
router.get(
  "/profit-by-brand",
  require("../../controllers/admin/statsAdminController").getProfitByBrand
);

module.exports = router;
