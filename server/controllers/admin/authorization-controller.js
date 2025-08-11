const User = require("../../models/User");
const { logInfo, logError } = require("../../helpers/logger");

// GET /admin/authorization/admins -> list all admin users with roles & permissions
exports.listAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select(
      "_id userName email phoneNumber adminAccessLevel adminModulePermissions"
    );
    res.status(200).json({ success: true, data: admins });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Admin listesi alınamadı.",
      error: e.message,
    });
  }
};

// PUT /admin/authorization/:adminId -> update level & permissions
exports.updateAdminAuthorization = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { adminAccessLevel, adminModulePermissions } = req.body;

    const update = {};
    if (adminAccessLevel !== undefined)
      update.adminAccessLevel = adminAccessLevel;
    if (adminModulePermissions !== undefined)
      update.adminModulePermissions = adminModulePermissions;

    const updatedAdmin = await User.findByIdAndUpdate(adminId, update, {
      new: true,
      runValidators: true,
    }).select(
      "_id userName email phoneNumber adminAccessLevel adminModulePermissions"
    );

    if (!updatedAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin bulunamadı" });
    }

    logInfo(`Admin yetkileri güncellendi: ${updatedAdmin.userName}`, req, {
      action: "UPDATE_AUTHORIZATION",
      resourceId: adminId,
      resourceType: "User",
      additionalData: {
        targetUser: updatedAdmin.userName,
        newLevel: adminAccessLevel,
        permissions: adminModulePermissions,
      },
    });

    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (e) {
    logError("Admin yetkileri güncellenirken hata oluştu", req, {
      action: "UPDATE_AUTHORIZATION_ERROR",
      resourceId: adminId,
      resourceType: "User",
      error: e.message,
    });

    res.status(500).json({
      success: false,
      message: "Güncelleme başarısız.",
      error: e.message,
    });
  }
};
