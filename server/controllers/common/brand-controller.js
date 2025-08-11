const Brand = require("../../models/Brand");

const getActiveBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  getActiveBrands,
};
