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
    console.log(e);
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
          select: "userName email phoneNumber",
        })
        .lean();

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
    console.error("getOrderDetailsForAdmin error:", e);
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
      select: "userName email phoneNumber",
    });

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
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
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$isGuestOrder", true] },
              then: "GUEST_ORDERS_VIRTUAL_ID",
              else: "$userId",
            },
          },
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: "$orderDate" },
          statuses: { $addToSet: "$orderStatus" },
          firstGuestEmail: {
            $first: {
              $cond: {
                if: "$isGuestOrder",
                then: "$guestInfo.email",
                else: null,
              },
            },
          },
          firstGuestFullName: {
            $first: {
              $cond: {
                if: "$isGuestOrder",
                then: "$guestInfo.fullName",
                else: null,
              },
            },
          },
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
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: {
            $cond: {
              if: { $eq: ["$_id", "GUEST_ORDERS_VIRTUAL_ID"] },
              then: "Misafir Siparişleri",
              else: "$userInfo.userName",
            },
          },
          email: {
            $cond: {
              if: { $eq: ["$_id", "GUEST_ORDERS_VIRTUAL_ID"] },
              then: "$firstGuestEmail",
              else: "$userInfo.email",
            },
          },
          phoneNumber: {
            $cond: {
              if: { $eq: ["$_id", "GUEST_ORDERS_VIRTUAL_ID"] },
              then: null,
              else: "$userInfo.phoneNumber",
            },
          },
          orderCount: 1,
          lastOrderDate: 1,
          hasNewOrder: {
            $or: [
              { $in: ["pending", { $ifNull: ["$statuses", []] }] },
              { $in: ["pending_payment", { $ifNull: ["$statuses", []] }] },
              { $in: ["confirmed", { $ifNull: ["$statuses", []] }] },
            ],
          },
        },
      },
      {
        $sort: { hasNewOrder: -1, lastOrderDate: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: usersWithOrders,
    });
  } catch (e) {
    console.error("getUsersWithOrders error:", e);
    res.status(500).json({
      success: false,
      message: "Kullanıcı sipariş listesi alınırken bir hata oluştu!",
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
        .json({ success: false, message: "Geçersiz Sipariş ID formatı." });
    }
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı ID veya misafir grubu ID'si gerekli!",
      });
    }

    let query = {};
    if (userId === "GUEST_ORDERS_VIRTUAL_ID") {
      query = { isGuestOrder: true };
    } else {
      query = {
        userId: userId,
        $or: [{ isGuestOrder: false }, { isGuestOrder: { $exists: false } }],
      };
    }

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .populate({
        path: "userId",
        select: "userName email",
        options: { omitUndefined: true },
      })
      .lean();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.error("getOrdersByUserIdForAdmin error:", e);
    res.status(500).json({
      success: false,
      message: "Belirli kullanıcıya ait siparişler alınırken bir hata oluştu!",
      error: e.message,
    });
  }
};

const getAllGuestOrdersForAdmin = async (req, res) => {
  try {
    const guestOrders = await Order.find({ isGuestOrder: true })
      .sort({ orderDate: -1 })
      .lean();
    res.status(200).json({
      success: true,
      data: guestOrders,
    });
  } catch (e) {
    console.error("getAllGuestOrdersForAdmin error:", e);
    res.status(500).json({
      success: false,
      message: "Misafir siparişleri alınırken bir hata oluştu!",
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
};
