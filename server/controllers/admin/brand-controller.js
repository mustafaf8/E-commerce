const Brand = require("../../models/Brand");
const Product = require("../../models/Product");
const mongoose = require("mongoose");
const { logInfo, logError } = require("../../helpers/logger");

const addBrandAdmin = async (req, res) => {
  try {
    const { name, slug, isActive } = req.body;
    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Marka adı ve slug zorunludur." });
    }

    const existingBrand = await Brand.findOne({ $or: [{ name }, { slug }] });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Bu isim veya slug ile zaten bir marka mevcut.",
      });
    }

    // Yeni markayı oluştur ve kaydet
    const newBrand = new Brand({ name, slug, isActive });
    await newBrand.save();

    // Loglama: Yeni marka oluşturuldu
    logInfo("Yeni marka oluşturuldu", req, {
      action: "CREATE_BRAND",
      resourceId: newBrand._id,
      resourceType: "Brand",
      additionalData: {
        brandName: name,
        brandSlug: slug,
        brandIsActive: isActive,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Marka eklendi.", data: newBrand });
  } catch (error) {
    logError("Admin marka ekleme hatası", req, {
      action: "CREATE_BRAND",
      resourceId: newBrand._id,
      resourceType: "Brand",
      error: error.message,
    });

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Doğrulama Hatası",
        errors: error.errors,
      });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Marka Güncelle (Admin)
const updateBrandAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    const { name, slug, isActive } = req.body;

    // Eğer sadece isActive güncelleniyorsa, diğer alanları kontrol etme
    if (
      Object.keys(req.body).length === 1 &&
      req.body.hasOwnProperty("isActive")
    ) {
      const updatedBrand = await Brand.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );

      if (!updatedBrand) {
        return res
          .status(404)
          .json({ success: false, message: "Güncellenecek marka bulunamadı." });
      }

      return res.status(200).json({
        success: true,
        message: "Marka durumu güncellendi.",
        data: updatedBrand,
      });
    }

    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Marka adı ve slug zorunludur." });
    }

    const existingBrand = await Brand.findOne({
      $or: [{ name }, { slug }],
      _id: { $ne: id },
    });
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Bu isim veya slug başka bir markaya ait.",
      });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, slug, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedBrand) {
      return res
        .status(404)
        .json({ success: false, message: "Güncellenecek marka bulunamadı." });
    }
    logInfo("Marka güncellendi", req, {
      action: "UPDATE_BRAND",
      resourceId: id,
      resourceType: "Brand",
      additionalData: { newName: name },
    });
    res.status(200).json({
      success: true,
      message: "Marka güncellendi.",
      data: updatedBrand,
    });
  } catch (error) {
    logError("Admin marka güncelleme hatası", req, {
      action: "UPDATE_BRAN_ERROR",
      resourceId: id,
      resourceType: "Brand",
      error: error.message,
    });

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Doğrulama Hatası",
        errors: error.errors,
      });
    }
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Marka ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const deleteBrandAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    const productCount = await Product.countDocuments({ brand: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Bu marka ${productCount} üründe kullanılıyor. Önce ürünleri düzenleyin veya markayı pasif yapın.`,
      });
    }

    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      logError("Admin marka silindi", req, {
        action: "DELETE_BRAND",
        resourceId: id,
        resourceType: "Brand",
        error: "Marka bulunamadı",
      });

      return res
        .status(404)
        .json({ success: false, message: "Silinecek marka bulunamadı." });
    }
    res
      .status(200)
      .json({ success: true, message: "Marka silindi.", data: { _id: id } });
  } catch (error) {
    logError("Admin marka silme hatası", req, {
      action: "DELETE_BRAND_ERROR",
      resourceId: id,
      resourceType: "Brand",
      error: error.message,
    });

    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Marka ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Tüm Markaları Getir (Admin)
const getAllBrandsAdmin = async (req, res) => {
  try {
    const brands = await Brand.find({}).sort({ name: 1 });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  addBrandAdmin,
  updateBrandAdmin,
  deleteBrandAdmin,
  getAllBrandsAdmin,
};
