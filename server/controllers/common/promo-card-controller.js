// server/controllers/common/promo-card-controller.js
const PromoCard = require("../../models/PromoCard");

// Tüm (aktif) promosyon kartlarını getir
const getPromoCards = async (req, res) => {
  try {
    // Sadece aktif olanları veya belirli bir sıraya göre getirmek isterseniz filtre/sort ekleyebilirsiniz.
    // Örneğin: const promoCards = await PromoCard.find({ isActive: true }).sort({ order: 1 });
    const promoCards = await PromoCard.find({}).sort({ createdAt: -1 }); // Şimdilik eklenme tarihine göre sondan başa sırala

    res.status(200).json({ success: true, data: promoCards });
  } catch (error) {
    console.error("Promosyon kartları getirilirken hata:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Yeni bir promosyon kartı ekle (Admin Yetkisi Gerekli)
const addPromoCard = async (req, res) => {
  // Yetki Kontrolü (Örnek - authMiddleware sonrası)
  // Eğer authMiddleware kullanmıyorsanız, burada manuel token/session kontrolü yapmalısınız.
  // if (req.user?.role !== 'admin') {
  //     return res.status(403).json({ success: false, message: "Yetkisiz işlem." });
  // }

  try {
    const { image, title, link } = req.body;
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Resim URL'si zorunludur." });
    }
    const newPromoCard = new PromoCard({
      image,
      title,
      link,
    });
    await newPromoCard.save();
    res.status(201).json({
      success: true,
      message: "Promosyon kartı eklendi.",
      data: newPromoCard,
    });
  } catch (error) {
    console.error("Promosyon kartı eklenirken hata:", error);
    // Doğrulama hatası olabilir
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

// Promosyon kartını sil (Admin Yetkisi Gerekli)
const deletePromoCard = async (req, res) => {
  // Yetki Kontrolü (Örnek)
  // if (req.user?.role !== 'admin') {
  //     return res.status(403).json({ success: false, message: "Yetkisiz işlem." });
  // }

  try {
    const { cardId } = req.params;

    if (!cardId) {
      return res
        .status(400)
        .json({ success: false, message: "Kart ID'si gerekli." });
    }

    const deletedCard = await PromoCard.findByIdAndDelete(cardId);

    if (!deletedCard) {
      return res
        .status(404)
        .json({ success: false, message: "Silinecek kart bulunamadı." });
    }

    res.status(200).json({
      success: true,
      message: "Promosyon kartı silindi.",
      data: { _id: cardId },
    }); // Frontend'in beklediği gibi ID'yi döndür
  } catch (error) {
    console.error("Promosyon kartı silinirken hata:", error);
    // Geçersiz ID formatı hatası olabilir
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kart ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  getPromoCards,
  addPromoCard,
  deletePromoCard,
};
