const Order = require("../../models/Order");

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

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
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
          _id: "$userId",
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: "$orderDate" },
          statuses: { $addToSet: "$orderStatus" }, // Durumları topla
        },
      },
      {
        $addFields: {
          // <<< GÜNCELLENMİŞ KISIM >>>
          // statuses alanı null veya eksikse boş dizi kullan, değilse kendisini kullan
          validStatuses: { $ifNull: ["$statuses", []] },
          // userId ObjectId'ye çevirme (eğer gerekliyse)
          convertedUserId: { $toObjectId: "$_id" }, // Önceki çözümdeki gibi
        },
      },
      {
        $addFields: {
          // <<< YENİ/GÜNCELLENMİŞ KISIM >>>
          // Artık validStatuses dizisini güvenle kullanabiliriz
          hasNewOrder: {
            $or: [
              { $in: ["pending", "$validStatuses"] }, // validStatuses kullan
              { $in: ["confirmed", "$validStatuses"] }, // validStatuses kullan
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "convertedUserId", // veya "_id" (tipe göre)
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
          userName: "$userInfo.userName",
          email: "$userInfo.email",
          phoneNumber: "$userInfo.phoneNumber",
          orderCount: 1,
          lastOrderDate: 1,
          hasNewOrder: 1,
        },
      },
      {
        $sort: {
          hasNewOrder: -1,
          lastOrderDate: -1,
        },
      },
    ]);

    if (!usersWithOrders || usersWithOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Siparişi olan kullanıcı bulunamadı!",
      });
    }
    console.log(
      "getUsersWithOrders Sonucu:",
      JSON.stringify(usersWithOrders, null, 2)
    );
    res.status(200).json({
      success: true,
      data: usersWithOrders,
    });
  } catch (e) {
    console.error("getUsersWithOrders error:", e);
    res.status(500).json({
      success: false,
      message: "Kullanıcı listesi alınırken bir hata oluştu!",
      error: e.message, // Hata detayını loglama/gösterme
    });
  }
};

// === YENİ: Belirli Bir Kullanıcının Siparişlerini Admin İçin Getir ===
const getOrdersByUserIdForAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı ID'si gerekli!",
      });
    }

    // Kullanıcının tüm siparişlerini (belki durum filtresi olmadan) getir
    // İstersen burada da sadece 'paid' olanları veya belirli durumları filtreleyebilirsin.
    const orders = await Order.find({ userId: userId }).sort({
      orderDate: -1,
    }); // En yeniden eskiye sırala

    // Sipariş yoksa boş dizi döndür, hata verme
    res.status(200).json({
      success: true,
      data: orders, // Boş olsa bile başarıyla döndür
    });
  } catch (e) {
    console.error("getOrdersByUserIdForAdmin error:", e);
    res.status(500).json({
      success: false,
      message: "Kullanıcı siparişleri alınırken bir hata oluştu!",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers, // Mevcut
  getOrderDetailsForAdmin, // Mevcut
  updateOrderStatus, // Mevcut
  getUsersWithOrders, // Yeni
  getOrdersByUserIdForAdmin, // Yeni
};
