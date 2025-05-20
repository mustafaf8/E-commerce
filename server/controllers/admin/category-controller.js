const Category = require("../../models/Category");

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

// Kategori Sil (Admin)
const deleteCategoryAdmin = async (req, res) => {
  try {
    const { id } = req.params;
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

// Tüm Kategorileri Getir (Admin - Aktif/Pasif Farketmez)
const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 }); // İsme göre sırala
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
