const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;
    console.log("API /search - Gelen keyword:", keyword);

    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
      console.log(
        "API /search - Geçersiz veya boş keyword, boş sonuç dönülüyor."
      );
      return res.status(200).json({ success: true, data: [] });
    }

    const trimmedKeyword = keyword.trim();
    const escapedKeyword = trimmedKeyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regEx = new RegExp(escapedKeyword, "i");
    console.log("API /search - Oluşturulan RegExp:", regEx);

    const searchPromises = [
      Product.find({ title: regEx })
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .lean(),
      Product.find({ description: regEx })
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .lean(),
    ];

    const matchingCategories = await Category.find({ name: regEx })
      .select("_id")
      .lean();
    if (matchingCategories.length > 0) {
      const categoryIds = matchingCategories.map((cat) => cat._id);
      console.log("API /search - Eşleşen Kategori ID'leri:", categoryIds);
      searchPromises.push(
        Product.find({ category: { $in: categoryIds } })
          .populate("category", "name slug")
          .populate("brand", "name slug")
          .lean()
      );
    }

    const matchingBrands = await Brand.find({ name: regEx })
      .select("_id")
      .lean();
    if (matchingBrands.length > 0) {
      const brandIds = matchingBrands.map((brand) => brand._id);
      console.log("API /search - Eşleşen Marka ID'leri:", brandIds);
      searchPromises.push(
        Product.find({ brand: { $in: brandIds } })
          .populate("category", "name slug")
          .populate("brand", "name slug")
          .lean()
      );
    }

    const results = await Promise.all(searchPromises);
    const allProducts = [];
    const productIds = new Set();

    results.forEach((resultSet) => {
      resultSet.forEach((product) => {
        if (!productIds.has(product._id.toString())) {
          allProducts.push(product);
          productIds.add(product._id.toString());
        }
      });
    });

    console.log(
      "API /search - Bulunan Toplam Benzersiz Sonuç Sayısı:",
      allProducts.length
    );

    res.status(200).json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    console.error("API /search - Hata Oluştu:", error);
    res.status(500).json({
      success: false,
      message: "Arama sırasında bir sunucu hatası oluştu.",
      error: error.message,
    });
  }
};

module.exports = { searchProducts };
