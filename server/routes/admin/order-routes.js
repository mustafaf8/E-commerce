const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getUsersWithOrders, // <<< YENİ
  getOrdersByUserIdForAdmin,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);
router.get("/users-list", getUsersWithOrders);
router.get("/user/:userId", getOrdersByUserIdForAdmin);

module.exports = router;
