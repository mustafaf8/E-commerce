const Coupon = require("../../models/Coupon");
const { logInfo, logError } = require("../../helpers/logger");

// Tüm kuponları getir
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error("Kuponları getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Kuponlar getirilirken hata oluştu.",
    });
  }
};

// Yeni kupon oluştur
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxUses,
      expiryDate,
      description,
      imageUrl,
      showOnCampaignsPage,
    } = req.body;

    // Kupon kodu zaten var mı kontrol et
    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Bu kupon kodu zaten kullanılıyor.",
      });
    }

    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      minPurchase: minPurchase || 0,
      maxUses: maxUses || null,
      expiryDate: expiryDate || null,
      description: description || "",
      imageUrl: imageUrl || null,
      showOnCampaignsPage: showOnCampaignsPage || false,
    });

    await newCoupon.save();

    logInfo("Kupon oluşturuldu", req, {
      action: "CREATE_COUPON",
      resourceId: newCoupon._id,
      resourceType: "Coupon",
      additionalData: {
        couponCode: code,
        discountType: discountType,
        discountValue: discountValue,
      },
    });

    res.status(201).json({
      success: true,
      message: "Kupon başarıyla oluşturuldu.",
      data: newCoupon,
    });
  } catch (error) {
    logError("Kupon oluşturma hatası", req, {
      action: "CREATE_COUPON_ERROR",
      resourceId: newCoupon._id,
      resourceType: "Coupon",
      error: error.message,
    });

    console.error("Kupon oluşturma hatası:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Kupon oluşturulurken hata oluştu.",
    });
  }
};

// Kupon güncelle
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Eğer code güncelleniyorsa, benzersizlik kontrolü yap
    if (updateData.code) {
      const existingCoupon = await Coupon.findOne({
        code: updateData.code.toUpperCase(),
        _id: { $ne: id },
      });

      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Bu kupon kodu zaten kullanılıyor.",
        });
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({
        success: false,
        message: "Kupon bulunamadı.",
      });
    }

    logInfo("Kupon güncellendi", req, {
      action: "UPDATE_COUPON",
      resourceId: id,
      resourceType: "Coupon",
      additionalData: {
        couponCode: code,
        discountType: discountType,
        discountValue: discountValue,
      },
    });

    res.status(200).json({
      success: true,
      message: "Kupon başarıyla güncellendi.",
      data: updatedCoupon,
    });
  } catch (error) {
    logError("Kupon güncelleme hatası", req, {
      action: "UPDATE_COUPON_ERROR",

      resourceId: id,
      resourceType: "Coupon",
      error: error.message,
    });
    console.error("Kupon güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Kupon güncellenirken hata oluştu.",
    });
  }
};

// Kupon sil
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({
        success: false,
        message: "Kupon bulunamadı.",
      });
    }
    logInfo("Kupon silindi", req, {
      action: "DELETE_COUPON",
      resourceId: id,
      resourceType: "Coupon",
      additionalData: {
        couponCode: deletedCoupon.code,
      },
    });

    res.status(200).json({
      success: true,
      message: "Kupon başarıyla silindi.",
    });
  } catch (error) {
    logError("Kupon silme hatası", req, {
      action: "DELETE_COUPON_ERROR",
      resourceId: id,
      resourceType: "Coupon",
      error: error.message,
    });

    console.error("Kupon silme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Kupon silinirken hata oluştu.",
    });
  }
};

// Belirli bir kuponu getir
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Kupon bulunamadı.",
      });
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error("Kupon getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Kupon getirilirken hata oluştu.",
    });
  }
};

// Kupon durumunu değiştir (aktif/pasif)
const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Kupon bulunamadı.",
      });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Kupon ${coupon.isActive ? "aktif" : "pasif"} hale getirildi.`,
      data: coupon,
    });
  } catch (error) {
    console.error("Kupon durum değiştirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Kupon durumu değiştirilirken hata oluştu.",
    });
  }
};

module.exports = {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  toggleCouponStatus,
};
