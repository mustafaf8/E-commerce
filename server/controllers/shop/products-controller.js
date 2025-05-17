const Product = require("../../models/Product");
const mongoose = require("mongoose");
const Brand = require("../../models/Brand");

const getFilteredProducts = async (req, res) => {
  try {
    // query'den category slug'ları, brand slug'ları vb. alınacak
    const {
      category: categorySlugs = [],
      brand: brandSlugs = [],
      sortBy = "salesCount-desc",
      limit = 30,
    } = req.query;

    let filters = {};

    // Kategori slug'larına göre Category ObjectId'lerini bul
    if (categorySlugs.length > 0) {
      const Category = mongoose.model("Category"); // Category modelini al
      const categories = await Category.find({
        slug: { $in: categorySlugs.split(",") },
      }).select("_id");
      if (categories.length > 0) {
        filters.category = { $in: categories.map((cat) => cat._id) };
      } else {
        // Slug'larla eşleşen kategori yoksa boş sonuç döndür
        return res.status(200).json({ success: true, data: [] });
      }
    }
    if (brandSlugs.length > 0) {
      const brands = await Brand.find({
        slug: { $in: brandSlugs.split(",") },
      }).select("_id");
      if (brands.length > 0) {
        filters.brand = { $in: brands.map((b) => b._id) }; // brand ObjectId'leri ile filtrele
      } else {
        return res.status(200).json({ success: true, data: [] });
      }
    }
    // "En Çok Satanlar" için özel filtreleme
    if (sortBy === "salesCount-desc") {
      filters.salesCount = { $gt: 0 }; // salesCount > 0 olanları getir
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

    // Populate category ve brand isimlerini almak için (isteğe bağlı)
    const products = await Product.find(filters)
      .sort(sort)
      .limit(parseInt(limit, 10)) // Limiti uygula
      .populate("category", "name slug") // Kategori bilgilerini getir
      .populate("brand", "name slug")
      .select("-description"); // Listelemede açıklamayı alma (opsiyonel)

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (
    error // Hata 'e' yerine 'error' olmalı
  ) {
    console.error("getFilteredProducts error:", error); // Loglama iyileştirildi
    res.status(500).json({
      success: false,
      message: "Ürünler getirilirken bir hata oluştu.", // Mesaj düzeltildi
    });
  }
};

// getProductDetails fonksiyonu da populate kullanabilir
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("brand", "name slug");

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
    console.error("getProductDetails error:", error); // Loglama iyileştirildi
    res.status(500).json({
      success: false,
      message: "Ürün detayı alınırken bir hata oluştu.", // Mesaj düzeltildi
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
