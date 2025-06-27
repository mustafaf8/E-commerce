const Category = require("../../models/Category");
const Product = require("../../models/Product");
const mongoose = require("mongoose");

// Yeni Kategori Ekle (Admin)
const addCategoryAdmin = async (req, res) => {
  try {
    const { name, slug, isActive } = req.body;
    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Kategori adı ve slug zorunludur." });
    }

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Bu isim veya slug ile zaten bir kategori mevcut.",
      });
    }

    const newCategory = new Category({ name, slug, isActive });
    await newCategory.save();
    res
      .status(201)
      .json({ success: true, message: "Kategori eklendi.", data: newCategory });
  } catch (error) {
    console.error("Admin kategori ekleme hatası:", error);
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

// Kategori Güncelle (Admin)
const updateCategoryAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    const { name, slug, isActive } = req.body;

    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Kategori adı ve slug zorunludur." });
    }

    // Güncellenen ismin veya slug'ın başka bir kategoriye ait olup olmadığını kontrol et
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
      _id: { $ne: id },
    }); // Kendisi hariç kontrol et
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Bu isim veya slug başka bir kategoriye ait.",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug, isActive },
      { new: true, runValidators: true } // Güncellenmiş veriyi döndür ve validasyonları çalıştır
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Güncellenecek kategori bulunamadı.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Kategori güncellendi.",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Admin kategori güncelleme hatası:", error);
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
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const deleteCategoryAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    const productCount = await Product.countDocuments({ category: id });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Bu kategori ${productCount} üründe kullanılıyor. Önce ürünleri düzenleyin veya kategoriyi pasif yapın.`,
        isUsedError: true,
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Silinecek kategori bulunamadı." });
    }
    res
      .status(200)
      .json({ success: true, message: "Kategori silindi.", data: { _id: id } });
  } catch (error) {
    console.error("Admin kategori silme hatası:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Admin tüm kategorileri getirme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  addCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getAllCategoriesAdmin,
};
