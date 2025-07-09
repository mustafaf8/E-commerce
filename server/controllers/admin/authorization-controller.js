const User = require("../../models/User");

// GET /admin/authorization/admins -> list all admin users with roles & permissions
exports.listAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select(
      "_id userName email phoneNumber adminAccessLevel adminModulePermissions"
    );
    res.status(200).json({ success: true, data: admins });
  } catch (e) {
   // console.error("listAdmins error:", e);
    res
      .status(500)
      .json({ success: false, message: "Admin listesi alınamadı.", error: e.message });
  }
};

// PUT /admin/authorization/:adminId -> update level & permissions
exports.updateAdminAuthorization = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { adminAccessLevel, adminModulePermissions } = req.body;

    const update = {};
    if (adminAccessLevel !== undefined) update.adminAccessLevel = adminAccessLevel;
    if (adminModulePermissions !== undefined) update.adminModulePermissions = adminModulePermissions;

    const updatedAdmin = await User.findByIdAndUpdate(adminId, update, {
      new: true,
      runValidators: true,
    }).select(
      "_id userName email phoneNumber adminAccessLevel adminModulePermissions"
    );

    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: "Admin bulunamadı" });
    }

    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (e) {
   // console.error("updateAdminAuthorization error:", e);
    res
      .status(500)
      .json({ success: false, message: "Güncelleme başarısız.", error: e.message });
  }
}; 