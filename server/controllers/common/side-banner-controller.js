const SideBanner = require("../../models/SideBanner");
const { logInfo, logError } = require("../../helpers/logger");

const getSideBanners = async (req, res) => {
  try {
    const sideBanners = await SideBanner.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sideBanners });
  } catch (error) {
    // console.error("Yan banner'lar getirilirken hata:", error);
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

    logInfo("Yeni küçük banner eklendi", req, {
      action: "ADD_SIDE_BANNER",
      resourceId: newSideBanner._id,
      resourceType: "SideBanner",
    });

    res.status(201).json({
      success: true,
      message: "Yan banner eklendi.",
      data: newSideBanner,
    });
  } catch (error) {
    logError("Yan banner eklenirken hata oluştu", req, {
      action: "ADD_SIDE_BANNER_ERROR",
      resourceId: newSideBanner._id,
      resourceType: "SideBanner",
      error: error.message,
    });
    // console.error("Yan banner eklenirken hata:", error);
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

const updateSideBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { image, title, link } = req.body;

    if (!bannerId) {
      return res.status(400).json({
        success: false,
        message: "Güncellenecek banner ID'si gerekli.",
      });
    }

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Resim URL'si zorunludur." });
    }

    const updatedBanner = await SideBanner.findByIdAndUpdate(
      bannerId,
      { image, title, link },
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      return res.status(404).json({
        success: false,
        message: "Güncellenecek yan banner bulunamadı.",
      });
    }

    logInfo("Küçük banner güncellendi", req, {
      action: "UPDATE_SIDE_BANNER",
      resourceId: bannerId,
      resourceType: "SideBanner",
    });

    res.status(200).json({
      success: true,
      message: "Yan banner güncellendi.",
      data: updatedBanner,
    });
  } catch (error) {
    logError("Yan banner güncellenirken hata oluştu", req, {
      action: "UPDATE_SIDE_BANNER_ERROR",
      resourceId: bannerId,
      resourceType: "SideBanner",
      error: error.message,
    });
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Doğrulama hatası.",
        errors: error.errors,
      });
    }
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Banner ID formatı." });
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

    logInfo("Küçük banner silindi", req, {
      action: "DELETE_SIDE_BANNER",
      resourceId: bannerId,
      resourceType: "SideBanner",
    });

    res.status(200).json({
      success: true,
      message: "Yan banner silindi.",
      data: { _id: bannerId },
    });
  } catch (error) {
    logError("Yan banner silinirken hata oluştu", req, {
      action: "DELETE_SIDE_BANNER_ERROR",
      resourceId: bannerId,
      resourceType: "SideBanner",
      error: error.message,
    });

    // console.error("Yan banner silinirken hata:", error);
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
  updateSideBanner,
  deleteSideBanner,
};
