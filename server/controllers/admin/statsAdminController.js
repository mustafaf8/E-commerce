const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");
const mongoose = require("mongoose");
const Wishlist = require("../../models/Wishlist");

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

// 1. Satış Genel Bakışı
const getSalesOverview = async (req, res) => {
  try {
    const { period } = req.query;
    const match = { ...getPeriodMatch(period) };
    const results = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          averageOrderValue: {
            $cond: [
              { $eq: ["$totalOrders", 0] },
              0,
              { $divide: ["$totalRevenue", "$totalOrders"] },
            ],
          },
        },
      },
    ]);
    res.status(200).json({ success: true, data: results[0] || {} });
  } catch (error) {
    //console.error(error);
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
    //console.error(error);
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
              $sum: { $multiply: ["$cartItems.price", "$cartItems.quantity"] },
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
    //console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 4. Kategori Bazlı Satışlar
const getSalesByCategory = async (_req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
          totalUnits: { $sum: "$salesCount" },
          totalRevenue: { $sum: { $multiply: ["$salePrice", "$salesCount"] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ];
    const stats = await Product.aggregate(pipeline);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    //console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 5. Marka Bazlı Satışlar
const getSalesByBrand = async (_req, res) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brandInfo",
        },
      },
      { $unwind: "$brandInfo" },
      {
        $group: {
          _id: "$brandInfo.name",
          totalUnits: { $sum: "$salesCount" },
          totalRevenue: { $sum: { $multiply: ["$salePrice", "$salesCount"] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ];
    const stats = await Product.aggregate(pipeline);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    //console.error(error);
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
    //console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 7. En İyi Müşteriler
const getTopCustomers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const pipeline = [
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ["$userId", false] },
              "$userId",
              "$guestInfo.email",
            ],
          },
          totalSpent: { $sum: "$totalAmount" },
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
    //console.error(error);
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
    //console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 9. Satış Trendi (Zaman Serisi)
const getSalesTrend = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    const match = { ...getPeriodMatch(period) };

    let dateFormat = "%Y-%m-%d";
    if (period === "daily") {
      dateFormat = "%H:00";
    }

    const data = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$orderDate",
              timezone: "Europe/Istanbul",
            },
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (e) {
    //console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 10. Kullanıcı Kayıt Trendi (Zaman Serisi)
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

    const match = start ? { createdAt: { $gte: start, $lte: end } } : {};

    let dateFormat = "%Y-%m-%d";
    if (period === "daily") {
      dateFormat = "%H:00";
    }

    const data = await User.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: "$createdAt",
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
    //console.error(e);
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
    //console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// === PROFIT ANALYSIS HELPERS ===
function getCostAndRevenueAggregation(match = {}) {
  return [
    { $match: match },
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
        cartItemPrice: { $toDouble: "$cartItems.price" },
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
        costPrice: "$productInfo.costPrice",
      },
    },
  ];
}

// 12. Profit Overview
const getProfitOverview = async (req, res) => {
  try {
    const { period } = req.query;
    const match = { ...getPeriodMatch(period) };

    const pipeline = [
      ...getCostAndRevenueAggregation(match),
      {
        $group: {
          _id: "$_id", // group per order first
          orderRevenue: { $first: "$totalAmount" },
          orderCost: {
            $sum: { $multiply: ["$costPrice", "$cartQuantity"] },
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
          totalRevenue: 1,
          totalCost: 1,
          netProfit: { $subtract: ["$totalRevenue", "$totalCost"] },
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    res.status(200).json({ success: true, data: result[0] || {} });
  } catch (error) {
    //console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 13. Profit by Product
const getProfitByProduct = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const pipeline = [
      ...getCostAndRevenueAggregation({}),
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
            $sum: { $multiply: ["$costPrice", "$cartQuantity"] },
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
    //console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 14. Profit by Category
const getProfitByCategory = async (_req, res) => {
  try {
    const pipeline = [
      ...getCostAndRevenueAggregation({}),
      {
        $group: {
          _id: "$productInfo.category",
          totalUnits: { $sum: "$cartQuantity" },
          revenue: {
            $sum: { $multiply: ["$cartItemPrice", "$cartQuantity"] },
          },
          cost: {
            $sum: { $multiply: ["$costPrice", "$cartQuantity"] },
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
    //console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 15. Profit by Brand
const getProfitByBrand = async (_req, res) => {
  try {
    const pipeline = [
      ...getCostAndRevenueAggregation({}),
      {
        $group: {
          _id: "$productInfo.brand",
          totalUnits: { $sum: "$cartQuantity" },
          revenue: {
            $sum: { $multiply: ["$cartItemPrice", "$cartQuantity"] },
          },
          cost: {
            $sum: { $multiply: ["$costPrice", "$cartQuantity"] },
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
    //console.error(e);
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
};
