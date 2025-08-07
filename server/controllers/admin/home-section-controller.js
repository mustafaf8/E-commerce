const HomeSection = require("../../models/HomeSection");
const Category = require("../../models/Category");
const { logInfo, logError } = require("../../helpers/logger");

const addHomeSectionAdmin = async (req, res) => {
  try {
    const {
      title,
      displayOrder,
      contentType,
      contentValue,
      itemLimit,
      isActive,
    } = req.body;

    if (!title || !contentType) {
      return res
        .status(400)
        .json({ success: false, message: "Başlık ve İçerik Tipi zorunludur." });
    }
    if (contentType !== "BEST_SELLING" && !contentValue) {
      return res.status(400).json({
        success: false,
        message: "İçerik Değeri (En Çok Satanlar hariç) zorunludur.",
      });
    }

    const newSection = new HomeSection({
      title,
      displayOrder: displayOrder || 0,
      contentType,
      contentValue: contentType === "BEST_SELLING" ? null : contentValue,
      itemLimit: itemLimit || 10,
      isActive: isActive !== undefined ? isActive : true,
    });

    await newSection.save();

    logInfo("Yeni ana sayfa bölümü eklendi", req, {
      action: "ADD_HOME_SECTION",
      resourceId: newSection._id,
      resourceType: "HomeSection",
      additionalData: { sectionTitle: title },
    });

    res.status(201).json({
      success: true,
      message: "Ana sayfa bölümü eklendi.",
      data: newSection,
    });
  } catch (error) {
    logError("Ana sayfa bölümü eklenirken hata oluştu", req, {
      action: "ADD_HOME_SECTION_ERROR",
      resourceId: newSection._id,
      resourceType: "HomeSection",
      error: error.message,
    });

    //console.error("Admin bölüm ekleme hatası:", error);
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

const getAllHomeSectionsAdmin = async (req, res) => {
  try {
    const sections = await HomeSection.find({}).sort({ displayOrder: 1 });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    //console.error("Admin tüm bölümleri getirme hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const updateHomeSectionAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      displayOrder,
      contentType,
      contentValue,
      itemLimit,
      isActive,
    } = req.body;

    // Eğer sadece isActive güncelleniyorsa, diğer alanları kontrol etme
    if (
      Object.keys(req.body).length === 1 &&
      req.body.hasOwnProperty("isActive")
    ) {
      const updatedSection = await HomeSection.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );

      if (!updatedSection) {
        return res
          .status(404)
          .json({ success: false, message: "Güncellenecek bölüm bulunamadı." });
      }

      return res.status(200).json({
        success: true,
        message: "Bölüm durumu güncellendi.",
        data: updatedSection,
      });
    }

    if (!title || !contentType) {
      return res
        .status(400)
        .json({ success: false, message: "Başlık ve İçerik Tipi zorunludur." });
    }

    const updateData = {
      title,
      displayOrder,
      contentType,
      contentValue: contentType === "BEST_SELLING" ? null : contentValue,
      itemLimit,
      isActive,
    };

    // BEST_SELLING tipi için contentValue'yu null yap
    if (contentType === "BEST_SELLING") {
      updateData.contentValue = null;
    }

    const updatedSection = await HomeSection.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Güncellenecek bölüm bulunamadı." });
    }

    logInfo("Ana sayfa bölümü güncellendi", req, {
      action: "UPDATE_HOME_SECTION",
      resourceId: id,
      resourceType: "HomeSection",
      additionalData: { sectionTitle: updatedSection.title },
    });

    res.status(200).json({
      success: true,
      message: "Bölüm güncellendi.",
      data: updatedSection,
    });
  } catch (error) {
    logError("Ana sayfa bölümü güncellenirken hata oluştu", req, {
      action: "UPDATE_HOME_SECTION_ERROR",
      resourceId: id,
      resourceType: "HomeSection",
      error: error.message,
    });

    //console.error("Admin bölüm güncelleme hatası:", error);
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
        .json({ success: false, message: "Geçersiz Bölüm ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const deleteHomeSectionAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSection = await HomeSection.findByIdAndDelete(id);

    if (!deletedSection) {
      return res
        .status(404)
        .json({ success: false, message: "Silinecek bölüm bulunamadı." });
    }
    logInfo("Ana sayfa bölümü silindi", req, {
      action: "DELETE_HOME_SECTION",
      resourceId: id,
      resourceType: "HomeSection",
      additionalData: { sectionTitle: deletedSection.title },
    });

    res
      .status(200)
      .json({ success: true, message: "Bölüm silindi.", data: { _id: id } });
  } catch (error) {
    logError("Ana sayfa bölümü silinirken hata oluştu", req, {
      action: "DELETE_HOME_SECTION_ERROR",
      resourceId: id,
      resourceType: "HomeSection",
      error: error.message,
    });

    //console.error("Admin bölüm silme hatası:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Bölüm ID formatı." });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const updateHomeSectionsOrderAdmin = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        message: "Sıralanmış ID listesi (dizi) gerekli.",
      });
    }

    const updatePromises = orderedIds.map((id, index) =>
      HomeSection.findByIdAndUpdate(id, { displayOrder: index }, { new: true })
    );

    const updatedSections = await Promise.all(updatePromises);

    if (updatedSections.some((section) => section === null)) {
      //console.warn("Sıralama güncellemede bazı bölümler bulunamadı.");
    }

    logInfo("Ana sayfa bölüm sıralaması güncellendi", req, {
      action: "REORDER_HOME_SECTIONS",
    });

    res.status(200).json({
      success: true,
      message: "Bölüm sıralaması güncellendi.",
      data: await HomeSection.find({}).sort({ displayOrder: 1 }),
    });
  } catch (error) {
    logError("Admin bölüm sıralama hatası", req, {
      action: "REORDER_HOME_SECTIONS_ERROR",
      error: error.message,
    });

    //console.error("Admin bölüm sıralama hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  addHomeSectionAdmin,
  getAllHomeSectionsAdmin,
  updateHomeSectionAdmin,
  deleteHomeSectionAdmin,
  updateHomeSectionsOrderAdmin,
};
