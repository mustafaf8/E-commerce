const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;


    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {

      return res.status(200).json({ success: true, data: [] });
    }

    const trimmedKeyword = keyword.trim();
    const escapedKeyword = trimmedKeyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regEx = new RegExp(escapedKeyword, "i");

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

    res.status(200).json({
      success: true,
      data: allProducts,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Arama sırasında bir sunucu hatası oluştu.",
      error: error.message,
    });
  }
};

const suggestSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
      return res.status(200).json({ success: true, data: { products: [], categories: [], brands: [] } });
    }

    const trimmedKeyword = keyword.trim();
    const escapedKeyword = trimmedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regEx = new RegExp(escapedKeyword, "i");

    const [productRes, categoryRes, brandRes] = await Promise.all([
      Product.find({ title: regEx })
        .select("title slug image")
        .limit(5)
        .lean(),
      Category.find({ name: regEx }).select("name slug").limit(3).lean(),
      Brand.find({ name: regEx }).select("name slug").limit(3).lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        products: productRes,
        categories: categoryRes,
        brands: brandRes,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Öneriler getirilirken hata oluştu." });
  }
};

module.exports = { searchProducts, suggestSearch };
