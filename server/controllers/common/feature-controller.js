const Feature = require("../../models/Feature");

// Fonksiyonu güncelle: title ve link'i de al
const addFeatureImage = async (req, res) => {
  // !!! Admin Yetki Kontrolü Eklenmeli !!!
  // if (req.user?.role !== 'admin') { ... }
  try {
    // body'den image, title ve link'i al
    const { image, title, link } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Resim URL'si gerekli." });
    }

    console.log("Gelen Feature Data:", { image, title, link }); // Gelen veriyi logla

    // Yeni Feature nesnesini oluştururken title ve link'i de ekle
    const newFeatureImage = new Feature({
      image,
      title, // Eklendi
      link, // Eklendi
    });

    await newFeatureImage.save(); // Veritabanına kaydet

    // Başarılı yanıtı yeni oluşturulan veriyle döndür
    res.status(201).json({
      success: true,
      message: "Banner başarıyla eklendi.", // Mesaj güncellendi
      data: newFeatureImage,
    });
  } catch (e) {
    console.error("Banner eklenirken hata:", e); // Hata logu güncellendi
    if (e.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Doğrulama hatası.",
        errors: e.errors,
      });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu!" }); // Mesaj güncellendi
  }
};

// Bu fonksiyon genellikle değişmez
const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: images });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

// Bu fonksiyon da genellikle değişmez
const deleteFeatureImage = async (req, res) => {
  // !!! Admin Yetki Kontrolü Eklenmeli !!!
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
