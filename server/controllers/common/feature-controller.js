const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image, title, link } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Resim URL'si gerekli." });
    }
    console.log("Gelen Feature Data:", { image, title, link });
    const newFeatureImage = new Feature({
      image,
      title,
      link,
    });

    await newFeatureImage.save();

    res.status(201).json({
      success: true,
      message: "Banner başarıyla eklendi.",
      data: newFeatureImage,
    });
  } catch (e) {
    console.error("Banner eklenirken hata:", e);
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
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
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
    res.status(200).json({
      success: true,
      message: "Banner resmi silindi.",
      data: { _id: imageId },
    });
  } catch (error) {
    console.error("Banner resmi silinirken hata:", error);
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
  deleteFeatureImage,
};
