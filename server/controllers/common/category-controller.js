// server/controllers/common/category-controller.js
const Category = require("../../models/Category");

// Sadece Aktif Kategorileri Getir (Frontend Kullanımı İçin)
const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      name: 1,
    }); // Sadece aktif olanları ve isme göre sıralı getir
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Aktif kategorileri getirme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  getActiveCategories,
};
