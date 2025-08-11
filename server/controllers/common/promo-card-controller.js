const PromoCard = require("../../models/PromoCard");

const getPromoCards = async (req, res) => {
  try {
    const promoCards = await PromoCard.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: promoCards });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const addPromoCard = async (req, res) => {
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

    logInfo("Yeni fırsat kartı eklendi", req, {
      action: "ADD_PROMO_CARD",
      resourceId: newPromoCard._id,
      resourceType: "PromoCard",
    });

    res.status(201).json({
      success: true,
      message: "Promosyon kartı eklendi.",
      data: newPromoCard,
    });
  } catch (error) {
    logError("Promosyon kartı eklenirken hata oluştu", req, {
      action: "ADD_PROMO_CARD_ERROR",
      resourceId: newPromoCard._id,
      resourceType: "PromoCard",
      error: error.message,
    });
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

const updatePromoCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { image, title, link } = req.body;

    if (!cardId) {
      return res
        .status(400)
        .json({ success: false, message: "Güncellenecek kart ID'si gerekli." });
    }

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Resim URL'si zorunludur." });
    }

    const updatedCard = await PromoCard.findByIdAndUpdate(
      cardId,
      { image, title, link },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({
        success: false,
        message: "Güncellenecek promosyon kartı bulunamadı.",
      });
    }

    logInfo("Fırsat kartı güncellendi", req, {
      action: "UPDATE_PROMO_CARD",
      resourceId: cardId,
      resourceType: "PromoCard",
    });

    res.status(200).json({
      success: true,
      message: "Promosyon kartı güncellendi.",
      data: updatedCard,
    });
  } catch (error) {
    logError("Promosyon kartı güncellenirken hata oluştu", req, {
      action: "UPDATE_PROMO_CARD_ERROR",
      resourceId: cardId,
      resourceType: "PromoCard",
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
        .json({ success: false, message: "Geçersiz Kart ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const deletePromoCard = async (req, res) => {
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

    logInfo("Fırsat kartı silindi", req, {
      action: "DELETE_PROMO_CARD",
      resourceId: cardId,
      resourceType: "PromoCard",
    });

    res.status(200).json({
      success: true,
      message: "Promosyon kartı silindi.",
      data: { _id: cardId },
    });
  } catch (error) {
    logError("Promosyon kartı silinirken hata oluştu", req, {
      action: "DELETE_PROMO_CARD_ERROR",
      resourceId: cardId,
      resourceType: "PromoCard",
      error: error.message,
    });

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
  updatePromoCard,
  deletePromoCard,
};
