// const express = require("express");

// const {
//   createOrder,
//   getAllOrdersByUser,
//   getOrderDetails,
//   handleIyzicoCallback,
// } = require("../../controllers/shop/order-controller");

// const router = express.Router();

// router.post("/create", createOrder);
// router.post("/iyzico-callback", handleIyzicoCallback);
// router.get("/list/:userId", getAllOrdersByUser);
// router.get("/details/:id", getOrderDetails);

// module.exports = router;

// server/routes/shop/order-routes.js
const express = require("express");
const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  handleIyzicoCallback,
  createGuestOrder,
  trackGuestOrder,
} = require("../../controllers/shop/order-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/create", authMiddleware, createOrder); // Giriş yapmış kullanıcılar için (authMiddleware ile korunmalı)
router.post("/guest-create", createGuestOrder); // Misafir kullanıcılar için YENİ ROTA
router.post("/iyzico-callback", handleIyzicoCallback);
router.get("/list/:userId", authMiddleware, getAllOrdersByUser); // Giriş yapmış kullanıcılar için
router.get("/details/:id", getOrderDetails); // Bu hem misafir hem kayıtlı kullanıcı için olabilir (token ile koruma?)
router.get("/track/:orderId", trackGuestOrder);
module.exports = router;
