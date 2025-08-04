const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const adminCheckMiddleware = require("../../middleware/adminCheckMiddleware");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getUsersWithOrders,
  getOrdersByUserIdForAdmin,
  getAllGuestOrdersForAdmin,
  getPendingAndFailedOrders,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.use(authMiddleware, adminCheckMiddleware);

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.get("/users-list", getUsersWithOrders);
router.get("/user/:userId", getOrdersByUserIdForAdmin);
router.get("/guest-orders", getAllGuestOrdersForAdmin);
router.get("/pending-failed", getPendingAndFailedOrders);

module.exports = router;
