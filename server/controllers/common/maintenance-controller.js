const Maintenance = require("../../models/Maintenance");

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
    res.status(500).json({
      success: false,
      message: "Durum alınamadı.",
      error: error.message,
    });
  }
};

const updateMaintenanceStatus = async (req, res) => {
  try {
    const { isActive, message, returnDate } = req.body;

    const updateData = {};
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (message) updateData.message = message;
    if (returnDate) updateData.returnDate = returnDate;
    else updateData.returnDate = null;

    const updatedStatus = await Maintenance.findOneAndUpdate(
      { singleton: "maintenance_status" },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Bakım modu güncellendi.",
      data: updatedStatus,
    });
  } catch (error) {
    res.status(500).json({
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
