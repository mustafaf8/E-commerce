const Category = require("../../models/Category");
const Product = require("../../models/Product");
const mongoose = require("mongoose");
const { logInfo, logError } = require("../../helpers/logger");

// Yeni Kategori Ekle (Admin)
const addCategoryAdmin = async (req, res) => {
  try {
    const { name, slug, isActive, parent } = req.body;
    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Kategori adı ve slug zorunludur." });
    }

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Bu isim veya slug ile zaten bir kategori mevcut.",
      });
    }

    const newCategory = new Category({
      name,
      slug,
      isActive,
      parent: parent || null,
    });
    await newCategory.save();
    // YENİ: Loglama
    logInfo("Yeni kategori eklendi", req, {
      action: "ADD_CATEGORY",
      resourceId: newCategory._id,
      resourceType: "Category",
      additionalData: { categoryName: name, categorySlug: slug },
    });
    res
      .status(201)
      .json({ success: true, message: "Kategori eklendi.", data: newCategory });
  } catch (error) {
    logError("Kategori eklenirken hata oluştu", req, {
      action: "ADD_CATEGORY_ERROR",
      error: error.message,
      additionalData: { name, slug },
    });
    //console.error("Admin kategori ekleme hatası:", error);
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

// Kategori Güncelle (Admin)
const updateCategoryAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    const { name, slug, isActive, parent } = req.body;

    // Eğer sadece isActive güncelleniyorsa, diğer alanları kontrol etme
    if (Object.keys(req.body).length === 1 && req.body.hasOwnProperty("isActive")) {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );

      if (!updatedCategory) {
        return res
          .status(404)
          .json({ success: false, message: "Güncellenecek kategori bulunamadı." });
      }

      // YENİ: Loglama
      logInfo("Kategori durumu güncellendi", req, {
        action: "UPDATE_CATEGORY_STATUS",
        resourceId: id,
        resourceType: "Category",
        additionalData: { isActive }
      });

      return res.status(200).json({
        success: true,
        message: "Kategori durumu güncellendi.",
        data: updatedCategory,
      });
    }
    
    // Normal güncelleme için isim ve slug kontrolü
    if (!name || !slug) {
      return res
        .status(400)
        .json({ success: false, message: "Kategori adı ve slug zorunludur." });
    }

    // Güncellenen ismin veya slug'ın başka bir kategoriye ait olup olmadığını kontrol et
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
      _id: { $ne: id },
    }); // Kendisi hariç kontrol et
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Bu isim veya slug başka bir kategoriye ait.",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug, isActive, parent: parent || null },
      { new: true, runValidators: true } // Güncellenmiş veriyi döndür ve validasyonları çalıştır
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Güncellenecek kategori bulunamadı.",
      });
    }
    // YENİ: Loglama
    logInfo("Kategori güncellendi", req, {
      action: "UPDATE_CATEGORY",
      resourceId: id,
      resourceType: "Category",
      additionalData: { newName: name, newSlug: slug },
    });
    res.status(200).json({
      success: true,
      message: "Kategori güncellendi.",
      data: updatedCategory,
    });
  } catch (error) {
    // YENİ: Hata Loglama
    logError("Kategori güncellenirken hata oluştu", req, {
      action: "UPDATE_CATEGORY_ERROR",
      resourceId: id,
      resourceType: "Category",
      error: error.message,
    });
    //console.error("Admin kategori güncelleme hatası:", error);
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
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const deleteCategoryAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    const productCount = await Product.countDocuments({ category: id });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Bu kategori ${productCount} üründe kullanılıyor. Önce ürünleri düzenleyin veya kategoriyi pasif yapın.`,
        isUsedError: true,
      });
    }

    // Alt kategorilerin parent referansını güncelle
    await Category.updateMany({ parent: id }, { parent: null });

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Silinecek kategori bulunamadı." });
    }
    // YENİ: Loglama
    logInfo("Kategori silindi", req, {
      action: "DELETE_CATEGORY",
      resourceId: id,
      resourceType: "Category",
      additionalData: { categoryName: deletedCategory.name },
    });

    res
      .status(200)
      .json({ success: true, message: "Kategori silindi.", data: { _id: id } });
  } catch (error) {
    logError("Kategori silinirken hata oluştu", req, {
      action: "DELETE_CATEGORY_ERROR",
      resourceId: id,
      resourceType: "Category",
      error: error.message,
    });
    //console.error("Admin kategori silme hatası:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Kategori ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Kategorileri hiyerarşik yapıda döndürmek için yardımcı fonksiyon
const buildCategoryTree = (categories, parentId = null) => {
  const tree = [];

  for (const category of categories) {
    // parent null ise ana kategori, değilse alt kategori
    const categoryParentId = category.parent
      ? category.parent._id || category.parent
      : null;

    if (categoryParentId?.toString() === parentId?.toString()) {
      const children = buildCategoryTree(categories, category._id);
      const categoryWithChildren = {
        ...category.toObject(),
        children: children,
      };
      tree.push(categoryWithChildren);
    }
  }

  return tree;
};

const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("parent", "name slug")
      .sort({ name: 1 });

    // Hiyerarşik yapıyı oluştur
    const categoryTree = buildCategoryTree(categories);

    res.status(200).json({ success: true, data: categoryTree });
  } catch (error) {
    //console.error("Admin tüm kategorileri getirme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Header için ana kategorileri getir (sadece parent null olanlar)
const getHeaderCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      parent: null,
      isActive: true,
    }).sort({ headerOrder: 1, name: 1 });

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    //console.error("Header kategorileri getirme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Header sıralamasını güncelle
const updateHeaderOrder = async (req, res) => {
  try {
    const { categoryOrders } = req.body; // [{id: "categoryId", order: 1}, ...]

    if (!Array.isArray(categoryOrders)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz sıralama verisi.",
      });
    }

    // Her kategori için sıralamayı güncelle
    for (const item of categoryOrders) {
      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        return res.status(400).json({
          success: false,
          message: "Geçersiz kategori ID formatı.",
        });
      }

      await Category.findByIdAndUpdate(
        item.id,
        { headerOrder: item.order },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Header sıralaması güncellendi.",
    });
  } catch (error) {
    //console.error("Header sıralaması güncelleme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  addCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getAllCategoriesAdmin,
  getHeaderCategories,
  updateHeaderOrder,
};
