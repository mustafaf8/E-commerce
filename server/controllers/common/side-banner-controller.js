const SideBanner = require("../../models/SideBanner");

const getSideBanners = async (req, res) => {
  try {
    const sideBanners = await SideBanner.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sideBanners });
  } catch (error) {
    console.error("Yan banner'lar getirilirken hata:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const addSideBanner = async (req, res) => {
  try {
    const { image, title, link } = req.body;
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Resim URL'si zorunludur." });
    }
    const newSideBanner = new SideBanner({ image, title, link });
    await newSideBanner.save();
    res.status(201).json({
      success: true,
      message: "Yan banner eklendi.",
      data: newSideBanner,
    });
  } catch (error) {
    console.error("Yan banner eklenirken hata:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Doğrulama hatası.",
        errors: error.errors,
      });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const deleteSideBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    if (!bannerId) {
      return res
        .status(400)
        .json({ success: false, message: "Banner ID'si gerekli." });
    }
    const deletedBanner = await SideBanner.findByIdAndDelete(bannerId);
    if (!deletedBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Silinecek yan banner bulunamadı." });
    }
    res.status(200).json({
      success: true,
      message: "Yan banner silindi.",
      data: { _id: bannerId },
    });
  } catch (error) {
    console.error("Yan banner silinirken hata:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Banner ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  getSideBanners,
  addSideBanner,
  deleteSideBanner,
};
