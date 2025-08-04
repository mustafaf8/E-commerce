const Order = require("../../models/Order");
const mongoose = require("mongoose");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Sipariş ID formatı." });
    }
    let order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Sipariş bulunamadı!",
      });
    }

    if (!order.isGuestOrder && order.userId) {
      order = await Order.findById(id)
        .populate({
          path: "userId",
          select: "userName email phoneNumber tcKimlikNo",
        });

      order = order.toJSON();

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Sipariş veya siparişe ait kullanıcı populate sonrası bulunamadı!",
        });
      }
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    //console.error("getOrderDetailsForAdmin error:", e);
    res.status(500).json({
      success: false,
      message: "Admin için sipariş detayı alınırken hata oluştu.",
      error: e.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Sipariş ID formatı." });
    }
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus, orderUpdateDate: new Date() },
      { new: true }
    ).populate({
      path: "userId",
      select: "userName email phoneNumber tcKimlikNo",
    });

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getUsersWithOrders = async (req, res) => {
  try {
    const usersWithOrders = await Order.aggregate([
      {
        $match: {
          isGuestOrder: false,
          orderStatus: { $nin: ["pending_payment", "failed"] }
        },
      },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: "$orderDate" },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          userId: "$_id",
          userName: "$userInfo.userName",
          email: "$userInfo.email",
          phoneNumber: "$userInfo.phoneNumber",
          orderCount: 1,
          lastOrderDate: 1,
          totalSpent: 1,
          hasNewOrder: {
            $cond: {
              if: {
                $in: [
                  "$lastOrderStatus",
                  ["pending", "pending_payment", "confirmed", "failed"],
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $sort: { lastOrderDate: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: usersWithOrders,
      message: usersWithOrders.length === 0 ? "Siparişi olan kullanıcı bulunamadı!" : null
    });
  } catch (e) {
    //console.error("getUsersWithOrders error:", e);
    res.status(500).json({
      success: false,
      message: "Kullanıcı listesi alınırken hata oluştu.",
      error: e.message,
    });
  }
};

const getOrdersByUserIdForAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kullanıcı ID formatı." });
    }

    const orders = await Order.find({
      userId: userId,
      orderStatus: { $nin: ["pending_payment", "failed"] }
    }).sort({ orderDate: -1 });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Bu kullanıcıya ait sipariş bulunamadı!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    //console.error("getOrdersByUserIdForAdmin error:", e);
    res.status(500).json({
      success: false,
      message: "Kullanıcı siparişleri alınırken hata oluştu.",
      error: e.message,
    });
  }
};

const getAllGuestOrdersForAdmin = async (req, res) => {
  try {
    const guestOrders = await Order.find({
      isGuestOrder: true,
      orderStatus: { $nin: ["pending_payment", "failed"] }
    }).sort({ orderDate: -1 });

    if (!guestOrders.length) {
      return res.status(404).json({
        success: false,
        message: "Misafir siparişi bulunamadı!",
      });
    }

    res.status(200).json({
      success: true,
      data: guestOrders,
    });
  } catch (e) {
    //console.error("getAllGuestOrdersForAdmin error:", e);
    res.status(500).json({
      success: false,
      message: "Misafir siparişleri alınırken hata oluştu.",
      error: e.message,
    });
  }
};

const getPendingAndFailedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderStatus: { $in: ["pending_payment", "failed"] }
    }).sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    //console.error("getPendingAndFailedOrders error:", e);
    res.status(500).json({
      success: false,
      message: "Bekleyen ve başarısız siparişler alınırken hata oluştu.",
      error: e.message,
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getUsersWithOrders,
  getOrdersByUserIdForAdmin,
  getAllGuestOrdersForAdmin,
  getPendingAndFailedOrders,
};
