const Maintenance = require("../../models/Maintenance");

// Singleton (tek döküman) yapısını yönetmek için bir yardımcı fonksiyon
const findOrCreateStatus = async () => {
  let status = await Maintenance.findOne({ singleton: "maintenance_status" });
  if (!status) {
    status = await new Maintenance().save();
  }
  return status;
};

// Bakım modu durumunu getir
const getMaintenanceStatus = async (req, res) => {
  try {
    const status = await findOrCreateStatus();
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Durum alınamadı.",
        error: error.message,
      });
  }
};

// Bakım modu durumunu güncelle (Sadece Admin için)
const updateMaintenanceStatus = async (req, res) => {
  // NOT: Bu endpoint'i admin yetkisi kontrol eden bir middleware ile korumanız gerekir.
  try {
    const { isActive, message, returnDate } = req.body;

    const updateData = {};
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (message) updateData.message = message;
    if (returnDate) updateData.returnDate = returnDate;
    else updateData.returnDate = null; // Boş gönderilirse tarihi temizle

    const updatedStatus = await Maintenance.findOneAndUpdate(
      { singleton: "maintenance_status" },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true } // upsert:true -> yoksa oluşturur
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Bakım modu güncellendi.",
        data: updatedStatus,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Güncelleme başarısız.",
        error: error.message,
      });
  }
};

module.exports = {
  getMaintenanceStatus,
  updateMaintenanceStatus,
};
