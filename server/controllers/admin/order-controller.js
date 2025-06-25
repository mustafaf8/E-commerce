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

    // Eğer kayıtlı kullanıcı siparişiyse ve User modeli varsa, kullanıcıyı populate et
    // Misafir siparişlerinde order.userId null veya undefined olacaktır.
    if (!order.isGuestOrder && order.userId) {
      order = await Order.findById(id)
        .populate({
          path: "userId", // User modeline referans olan alan
          select: "userName email phoneNumber", // Almak istediğiniz kullanıcı bilgileri
        })
        .lean(); // .lean() performansı artırabilir ve mongoose objesi yerine plain JS objesi döndürür

      if (!order) {
        // Populate sonrası tekrar kontrol (nadiren de olsa)
        return res.status(404).json({
          success: false,
          message:
            "Sipariş veya siparişe ait kullanıcı populate sonrası bulunamadı!",
        });
      }
    }
    // Misafir siparişiyse, guestInfo zaten order objesinde mevcut olacak (Order modelinize göre).
    // Order modelinizde `guestInfo: { fullName: String, email: String, phone: String }` gibi bir alan olmalı.

    res.status(200).json({
      success: true,
      data: order, // order objesi artık ya populate edilmiş userId'yi ya da guestInfo'yu içeriyor
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

    await Order.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success: true,
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
              if: { $eq: ["$isGuestOrder", true] }, // Eğer misafir siparişiyse
              then: "GUEST_ORDERS_VIRTUAL_ID", // Sabit bir string ID ata
              else: "$userId", // Değilse userId kullan
            },
          },
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: "$orderDate" },
          statuses: { $addToSet: "$orderStatus" },
          // Misafir siparişleri için ilk e-postayı veya bir tanımlayıcı alabiliriz
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
          // Kayıtlı kullanıcıların bilgilerini çekmek için (misafirler için bu boş gelecek)
          from: "users", // "users" collection'ınızın adı
          localField: "_id", // _id'nin userId olduğu durumlar için
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          // userInfo dizisini objeye çevir, misafirler için boş olsa da kaydı koru
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0, // _id'yi kaldır
          userId: "$_id", // Bu, "GUEST_ORDERS_VIRTUAL_ID" veya gerçek userId olabilir
          userName: {
            $cond: {
              if: { $eq: ["$_id", "GUEST_ORDERS_VIRTUAL_ID"] },
              then: "Misafir Siparişleri", // Misafir grubu için sabit isim
              else: "$userInfo.userName",
            },
          },
          email: {
            // E-posta alanını da benzer şekilde ayarla
            $cond: {
              if: { $eq: ["$_id", "GUEST_ORDERS_VIRTUAL_ID"] },
              then: "$firstGuestEmail", // Veya genel bir ifade: "Misafir Kullanıcı"
              else: "$userInfo.email",
            },
          },
          phoneNumber: {
            // Telefon numarası için de (varsa)
            $cond: {
              if: { $eq: ["$_id", "GUEST_ORDERS_VIRTUAL_ID"] },
              then: null, // Misafirler için genel bir telefon yok, sipariş bazlı
              else: "$userInfo.phoneNumber",
            },
          },
          orderCount: 1,
          lastOrderDate: 1,
          hasNewOrder: {
            // Yeni sipariş kontrolü
            $or: [
              { $in: ["pending", { $ifNull: ["$statuses", []] }] },
              { $in: ["pending_payment", { $ifNull: ["$statuses", []] }] }, // Ödeme bekleyenleri de yeni sayabiliriz
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
    const { userId } = req.params; // Bu "GUEST_ORDERS_VIRTUAL_ID" olabilir
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
      query = { isGuestOrder: true }; // Tüm misafir siparişlerini bul
    } else {
      query = {
        userId: userId,
        $or: [{ isGuestOrder: false }, { isGuestOrder: { $exists: false } }],
      }; // Belirli bir kayıtlı kullanıcının siparişlerini bul
    }

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      // Misafir siparişlerinde userId olmayacağı için populate etmeye gerek yok.
      // Kayıtlı kullanıcı siparişleri için, müşteri adını listede göstermek isterseniz populate edebilirsiniz.
      // Ancak detay görünümünde zaten populate edilecek.
      .populate({
        path: "userId", // Sadece kayıtlı kullanıcılar için çalışır, misafirlerde null olur.
        select: "userName email",
        options: { omitUndefined: true }, // userId yoksa hata vermemesi için
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
