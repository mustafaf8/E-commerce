const Feature = require("../../models/Feature");
const { logInfo, logError } = require("../../helpers/logger");

const addFeatureImage = async (req, res) => {
  try {
    const { image, title, link } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Resim URL'si gerekli." });
    }
    // console.log("Gelen Feature Data:", { image, title, link });
    const newFeatureImage = new Feature({
      image,
      title,
      link,
    });

    await newFeatureImage.save();

    logInfo("Yeni ana banner eklendi", req, {
      action: "ADD_FEATURE_BANNER",
      resourceId: newFeatureImage._id,
      resourceType: "FeatureBanner",
    });

    res.status(201).json({
      success: true,
      message: "Banner başarıyla eklendi.",
      data: newFeatureImage,
    });
  } catch (e) {
    logError("Banner eklenirken hata oluştu", req, {
      action: "ADD_FEATURE_BANNER_ERROR",
      resourceId: newFeatureImage._id,
      resourceType: "FeatureBanner",
      error: e.message,
    });

    // console.error("Banner eklenirken hata:", e);
    if (e.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Doğrulama hatası.",
        errors: e.errors,
      });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu!" });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: images });
  } catch (e) {
    // console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const updateFeatureImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { image, title, link } = req.body;

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: "Güncellenecek resim ID'si gerekli.",
      });
    }

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Resim URL'si gerekli." });
    }

    const updatedImage = await Feature.findByIdAndUpdate(
      imageId,
      { image, title, link },
      { new: true, runValidators: true }
    );

    if (!updatedImage) {
      return res.status(404).json({
        success: false,
        message: "Güncellenecek banner resmi bulunamadı.",
      });
    }

    logInfo("Ana banner güncellendi", req, {
      action: "UPDATE_FEATURE_BANNER",
      resourceId: imageId,
      resourceType: "FeatureBanner",
    });

    res.status(200).json({
      success: true,
      message: "Banner resmi güncellendi.",
      data: updatedImage,
    });
  } catch (error) {
    logError("Banner resmi güncelleme hatası", req, {
      action: "UPDATE_FEATURE_BANNER_ERROR",
      resourceId: imageId,
      resourceType: "FeatureBanner",
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
        .json({ success: false, message: "Geçersiz Resim ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!imageId) {
      return res
        .status(400)
        .json({ success: false, message: "Silinecek resim ID'si gerekli." });
    }
    const deletedImage = await Feature.findByIdAndDelete(imageId);
    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Silinecek banner resmi bulunamadı.",
      });
    }

    logInfo("Ana banner silindi", req, {
      action: "DELETE_FEATURE_BANNER",
      resourceId: imageId,
      resourceType: "FeatureBanner",
    });

    res.status(200).json({
      success: true,
      message: "Banner resmi silindi.",
      data: { _id: imageId },
    });
  } catch (error) {
    logError("Banner resmi silinirken hata oluştu", req, {
      action: "DELETE_FEATURE_BANNER_ERROR",
      resourceId: imageId,
      resourceType: "FeatureBanner",
      error: error.message,
    });

    // console.error("Banner resmi silinirken hata:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Resim ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  addFeatureImage,
  getFeatureImages,
  updateFeatureImage,
  deleteFeatureImage,
};
