// server/controllers/shop/home-section-controller.js
const HomeSection = require("../../models/HomeSection");

// Aktif Ana Sayfa Bölümlerini Getir (Mağaza)
const getActiveHomeSectionsShop = async (req, res) => {
  try {
    const sections = await HomeSection.find({ isActive: true }).sort({
      displayOrder: 1,
    });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    console.error("Aktif ana sayfa bölümlerini getirme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  getActiveHomeSectionsShop,
};
