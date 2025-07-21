const Product = require("../../models/Product");
const mongoose = require("mongoose");
const Brand = require("../../models/Brand");
const { getExchangeRate } = require("../../utils/currencyConverter");
const { roundToMarketingPrice } = require("../../utils/priceUtils");

const getFilteredProducts = async (req, res) => {
  try {
    const {
      category: categorySlugs = [],
      brand: brandSlugs = [],
      sortBy = "salesCount-desc",
      limit = 30,
      minPrice,
      maxPrice,
      minRating,
      inStock,
    } = req.query;

    let filters = {};

    // Sayısal parametreleri kontrol et
    const parsedMinPrice = parseFloat(minPrice);
    const parsedMaxPrice = parseFloat(maxPrice);
    const parsedMinRating = parseFloat(minRating);
    const parsedInStock = inStock === "true";

    if (!isNaN(parsedMinPrice) || !isNaN(parsedMaxPrice)) {
      filters.price = {};
      if (!isNaN(parsedMinPrice)) {
        filters.price.$gte = parsedMinPrice;
      }
      if (!isNaN(parsedMaxPrice)) {
        filters.price.$lte = parsedMaxPrice;
      }
    }

    if (!isNaN(parsedMinRating)) {
      filters.averageReview = { $gte: parsedMinRating };
    }

    if (parsedInStock) {
      filters.totalStock = { $gt: 0 };
    }

    if (categorySlugs.length > 0) {
      const Category = mongoose.model("Category");
      const categories = await Category.find({
        slug: { $in: categorySlugs.split(",") },
      }).select("_id");
      if (categories.length > 0) {
        filters.category = { $in: categories.map((cat) => cat._id) };
      } else {
        return res.status(200).json({ success: true, data: [] });
      }
    }
    if (brandSlugs.length > 0) {
      const brands = await Brand.find({
        slug: { $in: brandSlugs.split(",") },
      }).select("_id");
      if (brands.length > 0) {
        filters.brand = { $in: brands.map((b) => b._id) };
      } else {
        return res.status(200).json({ success: true, data: [] });
      }
    }
    if (sortBy === "salesCount-desc") {
      filters.salesCount = { $gt: 0 };
    }

    let sort = {};
    let pipeline = null;

    // Fiyat sıralaması için aggregation pipeline kullan
    if (sortBy === "price-lowtohigh" || sortBy === "price-hightolow") {
      const sortDirection = sortBy === "price-lowtohigh" ? 1 : -1;
      
      pipeline = [
        { $match: filters },
        {
          $addFields: {
            effectivePrice: {
              $cond: {
                if: { $and: [{ $ne: ["$salePrice", null] }, { $gt: ["$salePrice", 0] }] },
                then: "$salePrice",
                else: "$price"
              }
            }
          }
        },
        { $sort: { effectivePrice: sortDirection } },
        { $limit: parseInt(limit, 10) },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand"
          }
        },
        {
          $addFields: {
            category: { $arrayElemAt: ["$category", 0] },
            brand: { $arrayElemAt: ["$brand", 0] }
          }
        },
        {
          $project: {
            description: 0,
            costPrice: 0,
            effectivePrice: 0
          }
        }
      ];
    } else {
      // Diğer sıralama türleri için normal sort kullan
      switch (sortBy) {
        case "title-atoz":
          sort.title = 1;
          break;
        case "title-ztoa":
          sort.title = -1;
          break;
        case "salesCount-desc":
          sort.salesCount = -1;
          break;
        default:
          sort.salesCount = -1;
          break;
      }
    }

    let products;
    if (pipeline) {
      products = await Product.aggregate(pipeline);
      // Aggregation sonuçları için manuel olarak TL fiyat hesaplaması yap
      for (const product of products) {
        if (product.priceUSD) {
          const rate = await getExchangeRate();
          product.price = roundToMarketingPrice(product.priceUSD * rate);
          if (product.salePriceUSD) {
            product.salePrice = roundToMarketingPrice(product.salePriceUSD * rate);
          }
        }
      }
    } else {
      products = await Product.find(filters)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .select("-description -costPrice");
      
      // Her ürün için TL fiyatlarını hesapla
      for (const product of products) {
        await product.calculateTLPrices();
      }
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
   // console.error("getFilteredProducts error:", error);
    res.status(500).json({
      success: false,
      message: "Ürünler getirilirken bir hata oluştu.",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Ürün ID formatı." });
    }
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("brand", "name slug")
      .select("-costPrice");

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Ürün bulunamadı!",
      });

    // TL fiyatlarını hesapla
    await product.calculateTLPrices();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
   // console.error("getProductDetails error:", error);
    res.status(500).json({
      success: false,
      message: "Ürün detayı alınırken bir hata oluştu.",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
