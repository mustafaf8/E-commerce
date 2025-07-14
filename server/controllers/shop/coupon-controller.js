const Coupon = require("../../models/Coupon");

// Kampanya sayfası için aktif ve gösterilecek kuponları getir
const getActiveCampaignCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      showOnCampaignsPage: true,
      imageUrl: { $ne: null },
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error("Kampanya kuponlarını getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Kampanya kuponları getirilirken hata oluştu.",
    });
  }
};

module.exports = {
  getActiveCampaignCoupons,
};
