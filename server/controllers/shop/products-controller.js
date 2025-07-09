const Product = require("../../models/Product");
const mongoose = require("mongoose");
const Brand = require("../../models/Brand");

const getFilteredProducts = async (req, res) => {
  try {
    const {
      category: categorySlugs = [],
      brand: brandSlugs = [],
      sortBy = "salesCount-desc",
      limit = 30,
    } = req.query;

    let filters = {};

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
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
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

    const products = await Product.find(filters)
      .sort(sort)
      .limit(parseInt(limit, 10))
      .populate("category", "name slug")
      .populate("brand", "name slug")
      .select("-description -costPrice");

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
