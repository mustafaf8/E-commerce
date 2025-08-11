const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const mongoose = require("mongoose");
const Wishlist = require("../../models/Wishlist");
const { Parser } = require("json2csv");
const { getExchangeRate } = require("../../utils/currencyConverter");

function getPeriodMatch(period) {
  if (!period) return {};
  const end = new Date();
  let start = null;
  switch (period) {
    case "daily":
      start = new Date(end);
      start.setDate(end.getDate() - 1);
      break;
    case "weekly":
      start = new Date(end);
      start.setDate(end.getDate() - 7);
      break;
    case "monthly":
      start = new Date(end);
      start.setMonth(end.getMonth() - 1);
      break;
    default:
      return {};
  }
  return { orderDate: { $gte: start, $lte: end } };
}

// Yardımcı: startDate ve endDate varsa tarih aralığına göre $match döndürür
function getDateRangeMatch(startDate, endDate, field = "orderDate") {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start) && !isNaN(end)) {
      return { [field]: { $gte: start, $lte: end } };
    }
  }
  return {};
}

// 1. Satış Genel Bakışı
const getSalesOverview = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    let match = {};
    if (startDate && endDate) {
      match = getDateRangeMatch(startDate, endDate, "orderDate");
    } else {
      match = { ...getPeriodMatch(period) };
    }
    
    
    // Önce siparişlerden toplam geliri hesapla
    const orderResults = await Order.aggregate([
      { 
        $match: { 
          ...match,
          orderStatus: { $in: ["confirmed", "inProcess", "inShipping", "delivered"] } 
        } 
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmountTRY" },
          totalOrders: { $sum: 1 },
          totalDiscount: { $sum: { $ifNull: ["$appliedCoupon.discountAmount", 0] } },
        },
      },
    ]);

    
    // Sonra ürün detaylarından brüt satışı hesapla
    const grossRevenueResults = await Order.aggregate([
      { 
        $match: { 
          ...match,
          orderStatus: { $in: ["confirmed", "inProcess", "inShipping", "delivered"] } 
        } 
      },
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: null,
          totalGrossRevenue: { 
            $sum: { 
              $multiply: [
                { $ifNull: ["$cartItems.priceTRY", 0] }, 
                "$cartItems.quantity"
              ] 
            } 
          },
        },
      },
    ]);

    
    const orderData = orderResults[0] || {};
    const grossData = grossRevenueResults[0] || {};
    
    const result = {
      totalNetRevenue: orderData.totalRevenue || 0,
      totalOrders: orderData.totalOrders || 0,
      totalDiscount: orderData.totalDiscount || 0,
      totalGrossRevenue: grossData.totalGrossRevenue || orderData.totalRevenue || 0,
      averageOrderValue: orderData.totalOrders > 0 ? (orderData.totalRevenue / orderData.totalOrders) : 0,
    };

    
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Sales Overview Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 2. Sipariş Durum Dağılımı
const getOrderStatusDistribution = async (_req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: { _id: "$orderStatus", count: { $sum: 1 } },
      },
    ]);
    const distribution = data.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});
    res.status(200).json({ success: true, data: distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 3. En Çok Satan Ürünler
const getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 10, metric = "salesCount" } = req.query;
    if (metric === "revenue") {
      const pipeline = [
        { $unwind: "$cartItems" },
        {
          $group: {
            _id: "$cartItems.productId",
            totalRevenue: {
              $sum: { $multiply: ["$cartItems.priceTRY", "$cartItems.quantity"] }, 
            },
            totalUnits: { $sum: "$cartItems.quantity" },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: Number(limit) },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            _id: 0,
            productId: "$productInfo._id",
            title: "$productInfo.title",
            image: "$productInfo.image",
            totalRevenue: 1,
            totalUnits: 1,
          },
        },
      ];
      const topProducts = await Order.aggregate(pipeline);
      return res.status(200).json({ success: true, data: topProducts });
    }
    const products = await Product.find({})
      .sort({ salesCount: -1 })
      .limit(Number(limit))
      .select("_id title image salesCount salePrice");
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 4. Kategori Bazlı Satışlar
const getSalesByCategory = async (_req, res) => {
  try {
    const pipeline = [
      { 
        $match: { 
          orderStatus: { $in: ["confirmed", "inProcess", "inShipping", "delivered"] } 
        } 
      }, 
      { $unwind: "$cartItems" },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $lookup: {
          from: "categories",
          localField: "productInfo.category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
          category: { $first: "$categoryInfo.name" },
          totalUnits: { $sum: "$cartItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$cartItems.priceTRY", "$cartItems.quantity"] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ];
    
    
    const stats = await Order.aggregate(pipeline);
    
    
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Sales By Category Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 5. Marka Bazlı Satışlar
const getSalesByBrand = async (_req, res) => {
  try {
    const pipeline = [
      { 
        $match: { 
          orderStatus: { $in: ["confirmed", "inProcess", "inShipping", "delivered"] } 
        } 
      },
      { $unwind: "$cartItems" },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $lookup: {
          from: "brands",
          localField: "productInfo.brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      { $unwind: "$brandInfo" },
      {
        $group: {
          _id: "$brandInfo.name",
          brand: { $first: "$brandInfo.name" },
          totalUnits: { $sum: "$cartItems.quantity" },
          totalRevenue: { $sum: { $multiply: ["$cartItems.priceTRY", "$cartItems.quantity"] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ];
    
    
    const stats = await Order.aggregate(pipeline);
    
    
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Sales By Brand Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// 6. Kullanıcı Özeti
const getUserSummary = async (req, res) => {
  try {
    const { period } = req.query;
    const match = {};
    if (period) {
      const end = new Date();
      let start;
      switch (period) {
        case "daily":
          start = new Date(end);
          start.setDate(end.getDate() - 1);
          break;
        case "weekly":
          start = new Date(end);
          start.setDate(end.getDate() - 7);
          break;
        case "monthly":
          start = new Date(end);
          start.setMonth(end.getMonth() - 1);
          break;
        default:
          start = null;
      }
      if (start) match.createdAt = { $gte: start, $lte: end };
    }

    const totalUsers = await User.countDocuments();
    const newUsers = Object.keys(match).length
      ? await User.countDocuments(match)
      : 0;

    res.status(200).json({ success: true, data: { totalUsers, newUsers } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 7. En İyi Müşteriler
const getTopCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const pipeline = [
      {
        $match: {
          orderStatus: { $nin: ["pending_payment", "failed"] }
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ["$userId", false] },
              "$userId",
              "$guestInfo.email",
            ],
          },
          totalSpent: { $sum: "$totalAmountTRY" },
          orderCount: { $sum: 1 },
          isGuest: { $max: "$isGuestOrder" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          userId: {
            $cond: [{ $eq: ["$isGuest", true] }, null, "$userInfo._id"],
          },
          name: {
            $cond: [{ $eq: ["$isGuest", true] }, "Guest", "$userInfo.userName"],
          },
          email: {
            $cond: [{ $eq: ["$isGuest", true] }, "Guest", "$userInfo.email"],
          },
          totalSpent: 1,
          orderCount: 1,
        },
      },
    ];
    const customers = await Order.aggregate(pipeline);
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 8. Ürün Özeti
const getProductSummary = async (_req, res) => {
  try {
    const [totalProducts, categoryCount, brandCount] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
    ]);

    const avgPerCategory = categoryCount ? totalProducts / categoryCount : 0;
    const avgPerBrand = brandCount ? totalProducts / brandCount : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        avgPerCategory: Number(avgPerCategory.toFixed(2)),
        avgPerBrand: Number(avgPerBrand.toFixed(2)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 9. Satış Trendi (Zaman Serisi)
const getSalesTrend = async (req, res) => {
  try {
    const { period = "monthly", startDate, endDate } = req.query;
    let match = {};
    if (startDate && endDate) {
      match = getDateRangeMatch(startDate, endDate, "orderDate");
    } else {
      match = { ...getPeriodMatch(period) };
    }

    let dateFormat = "%Y-%m-%d";
    if (period === "daily") {
      dateFormat = "%H:00";
    }

    const data = await Order.aggregate([
      { 
        $match: { 
          ...match,
          orderStatus: { $in: ["confirmed", "inProcess", "inShipping", "delivered"] } 
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$orderDate",
              timezone: "Europe/Istanbul",
            },
          },
          totalRevenue: { $sum: "$totalAmountTRY" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 10. Kullanıcı Kayıt Trendi
const getUserRegistrationsTrend = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    const end = new Date();
    let start = new Date(end);
    switch (period) {
      case "daily":
        start.setDate(end.getDate() - 1);
        break;
      case "weekly":
        start.setDate(end.getDate() - 7);
        break;
      case "monthly":
        start.setMonth(end.getMonth() - 1);
        break;
      default:
        start = null;
    }

    const match = start ? { orderDate: { $gte: start, $lte: end } } : {};

    let dateFormat = "%Y-%m-%d";
    if (period === "daily") {
      dateFormat = "%H:00";
    }

    const data = await Order.aggregate([
      { 
        $match: { 
          ...match,
          isGuestOrder: false, 
          orderStatus: { $nin: ["pending_payment", "failed"] }
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$orderDate",
              timezone: "Europe/Istanbul",
            },
          },
          registrations: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    

    res.status(200).json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 11. En Çok Beğenilen Ürünler
const getTopLikedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const pipeline = [
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          likeCount: { $sum: 1 },
        },
      },
      { $sort: { likeCount: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: 0,
          productId: "$productInfo._id",
          title: "$productInfo.title",
          image: "$productInfo.image",
          likeCount: 1,
        },
      },
    ];
    const liked = await Wishlist.aggregate(pipeline);
    res.status(200).json({ success: true, data: liked });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// === PROFIT ANALYSIS HELPERS ===
function getCostAndRevenueAggregation(match = {}) {
  const finalMatch = { 
    ...match, 
    orderStatus: { $in: ["confirmed", "inProcess", "inShipping", "delivered"] } 
  };

  return [
    { $match: finalMatch },
    { $unwind: "$cartItems" },
    {
      $addFields: {
        productObjId: {
          $cond: [
            { $eq: [{ $type: "$cartItems.productId" }, "objectId"] },
            "$cartItems.productId",
            { $toObjectId: "$cartItems.productId" },
          ],
        },
        cartItemPrice: { $toDouble: "$cartItems.priceTRY" },
        cartQuantity: "$cartItems.quantity",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productObjId",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $addFields: {
        costPriceUSD: { 
          $ifNull: [
            { $toDouble: "$productInfo.costPrice" }, 
            0 
          ] 
        },
      },
    },
  ];
}
// 12. Profit Overview
const getProfitOverview = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;
    
    let match = {};
    if (startDate && endDate) {
      match = getDateRangeMatch(startDate, endDate, "orderDate");
    } else {
      match = { ...getPeriodMatch(period) };
    }

    // Güncel döviz kurunu al
    const exchangeRate = await getExchangeRate();
    
    const pipeline = [
      ...getCostAndRevenueAggregation(match),
      {
        $addFields: {
          costPriceTRY: { 
            $multiply: ["$costPriceUSD", exchangeRate] 
          },
        },
      },
      {
        $group: {
          _id: "$_id", 
          orderRevenue: { $first: "$totalAmountTRY" },
          orderCost: {
            $sum: { $multiply: ["$costPriceTRY", "$cartQuantity"] },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$orderRevenue" },
          totalCost: { $sum: "$orderCost" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          totalCost: { $round: ["$totalCost", 2] },
          netProfit: { $round: [{ $subtract: ["$totalRevenue", "$totalCost"] }, 2] },
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    const data = result[0] || { totalRevenue: 0, totalCost: 0, netProfit: 0 };
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Profit Overview Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 13. Profit by Product
const getProfitByProduct = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const exchangeRate = await getExchangeRate();
    
    const pipeline = [
      ...getCostAndRevenueAggregation({}),
      {
        $addFields: {
          costPriceTRY: { 
            $multiply: ["$costPriceUSD", exchangeRate] 
          },
        },
      },
      {
        $group: {
          _id: "$productInfo._id",
          title: { $first: "$productInfo.title" },
          image: { $first: "$productInfo.image" },
          totalUnits: { $sum: "$cartQuantity" },
          revenue: {
            $sum: { $multiply: ["$cartItemPrice", "$cartQuantity"] },
          },
          cost: {
            $sum: { $multiply: ["$costPriceTRY", "$cartQuantity"] },
          },
        },
      },
      {
        $addFields: {
          profit: { $subtract: ["$revenue", "$cost"] },
        },
      },
      { $sort: { profit: -1 } },
      { $limit: Number(limit) },
    ];
    const data = await Order.aggregate(pipeline);
    res.status(200).json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 14. Profit by Category
const getProfitByCategory = async (_req, res) => {
  try {
    const exchangeRate = await getExchangeRate();
    
    const pipeline = [
      ...getCostAndRevenueAggregation({}),
      {
        $addFields: {
          costPriceTRY: { 
            $multiply: ["$costPriceUSD", exchangeRate] 
          },
        },
      },
      {
        $group: {
          _id: "$productInfo.category",
          totalUnits: { $sum: "$cartQuantity" },
          revenue: {
            $sum: { $multiply: ["$cartItemPrice", "$cartQuantity"] },
          },
          cost: {
            $sum: { $multiply: ["$costPriceTRY", "$cartQuantity"] },
          },
        },
      },
      {
        $addFields: {
          profit: { $subtract: ["$revenue", "$cost"] },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          _id: 0,
          category: "$categoryInfo.name",
          revenue: 1,
          cost: 1,
          profit: 1,
          totalUnits: 1,
        },
      },
      { $sort: { profit: -1 } },
    ];
    const data = await Order.aggregate(pipeline);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 15. Profit by Brand
const getProfitByBrand = async (_req, res) => {
  try {
    const exchangeRate = await getExchangeRate();
    
    const pipeline = [
      ...getCostAndRevenueAggregation({}),
      {
        $addFields: {
          costPriceTRY: { 
            $multiply: ["$costPriceUSD", exchangeRate] 
          },
        },
      },
      {
        $group: {
          _id: "$productInfo.brand",
          totalUnits: { $sum: "$cartQuantity" },
          revenue: {
            $sum: { $multiply: ["$cartItemPrice", "$cartQuantity"] },
          },
          cost: {
            $sum: { $multiply: ["$costPriceTRY", "$cartQuantity"] },
          },
        },
      },
      {
        $addFields: {
          profit: { $subtract: ["$revenue", "$cost"] },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      { $unwind: "$brandInfo" },
      {
        $project: {
          _id: 0,
          brand: "$brandInfo.name",
          revenue: 1,
          cost: 1,
          profit: 1,
          totalUnits: 1,
        },
      },
      { $sort: { profit: -1 } },
    ];
    const data = await Order.aggregate(pipeline);
    res.status(200).json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// === CSV EXPORT ===
const exportData = async (req, res) => {
  try {
    const { dataType, startDate, endDate } = req.body;

    let model;
    let dateField = "createdAt";
    switch (dataType) {
      case "orders":
        model = Order;
        dateField = "orderDate";
        break;
      case "products":
        model = Product;
        dateField = "createdAt";
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Geçersiz dataType" });
    }

    const match = getDateRangeMatch(startDate, endDate, dateField);
    let rawData;
    if (dataType === "products") {
      rawData = await model
        .find(match)
        .populate("category", "name")
        .populate("brand", "name")
        .lean();
    } else {
      rawData = await model.find(match).lean();
    }

    if (!rawData.length) {
      return res.status(200).send("");
    }

    // Exporta dahil edilecek alanları belirle
    let sanitized, fields;
    if (dataType === "products") {
      sanitized = rawData.map((p) => ({
        "Ürün ID": p._id.toString(),
        "Başlık": p.title,
        "Fiyat (₺)": p.price,
        "İndirimli Fiyat (₺)": p.salePrice || "",
        "Stok": p.totalStock,
        "Satış Adedi": p.salesCount,
        "Kategori": p.category?.name || "",
        "Marka": p.brand?.name || "",
        "Kayıt Tarihi": p.createdAt?.toISOString().split("T")[0] || "",
      }));
      fields = [
        "Ürün ID",
        "Başlık",
        "Fiyat (₺)",
        "İndirimli Fiyat (₺)",
        "Stok",
        "Satış Adedi",
        "Kategori",
        "Marka",
        "Kayıt Tarihi",
      ];
    } else {
      sanitized = rawData.map((o) => ({
        "Sipariş ID": o._id.toString(),
        "Sipariş Tarihi": o.orderDate?.toISOString().split("T")[0] || "",
        "Tutar (₺)": o.totalAmount,
        "Durum": o.orderStatus,
        "Ödeme Yöntemi": o.paymentMethod,
        "Müşteri": o.isGuestOrder ? o.guestInfo?.fullName : undefined,
        "E-posta": o.isGuestOrder ? o.guestInfo?.email : undefined,
        "Ürün Adedi": o.cartItems?.length || 0,
      }));
      fields = [
        "Sipariş ID",
        "Sipariş Tarihi",
        "Tutar (₺)",
        "Durum",
        "Ödeme Yöntemi",
        "Müşteri",
        "E-posta",
        "Ürün Adedi",
      ];
    }

    const parser = new Parser({ fields, delimiter: ";" });
    const csv = parser.parse(sanitized);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${dataType}-report.csv"`
    );
    return res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
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
};
