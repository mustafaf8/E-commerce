const Brand = require("../../models/Brand");
const Product = require("../../models/Product");

const addBrandAdmin = async (req, res) => {
  try {
    const { name, slug, isActive } = req.body;
    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Marka adı ve slug zorunludur." });
    }

    const existingBrand = await Brand.findOne({ $or: [{ name }, { slug }] });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Bu isim veya slug ile zaten bir marka mevcut.",
      });
    }

    const newBrand = new Brand({ name, slug, isActive });
    await newBrand.save();
    res
      .status(201)
      .json({ success: true, message: "Marka eklendi.", data: newBrand });
  } catch (error) {
    console.error("Admin marka ekleme hatası:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Doğrulama Hatası",
        errors: error.errors,
      });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Marka Güncelle (Admin)
const updateBrandAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, isActive } = req.body;

    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Marka adı ve slug zorunludur." });
    }

    const existingBrand = await Brand.findOne({
      $or: [{ name }, { slug }],
      _id: { $ne: id },
    });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Bu isim veya slug başka bir markaya ait.",
      });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, slug, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedBrand) {
      return res
        .status(404)
        .json({ success: false, message: "Güncellenecek marka bulunamadı." });
    }
    res.status(200).json({
      success: true,
      message: "Marka güncellendi.",
      data: updatedBrand,
    });
  } catch (error) {
    console.error("Admin marka güncelleme hatası:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Doğrulama Hatası",
        errors: error.errors,
      });
    }
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Marka ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Marka Sil (Admin)
const deleteBrandAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const productCount = await Product.countDocuments({ brand: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Bu marka ${productCount} üründe kullanılıyor. Önce ürünleri düzenleyin veya markayı pasif yapın.`,
      });
    }

    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res
        .status(404)
        .json({ success: false, message: "Silinecek marka bulunamadı." });
    }
    res
      .status(200)
      .json({ success: true, message: "Marka silindi.", data: { _id: id } });
  } catch (error) {
    console.error("Admin marka silme hatası:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Marka ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Tüm Markaları Getir (Admin)
const getAllBrandsAdmin = async (req, res) => {
  try {
    const brands = await Brand.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    console.error("Admin tüm markaları getirme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  addBrandAdmin,
  updateBrandAdmin,
  deleteBrandAdmin,
  getAllBrandsAdmin,
};
