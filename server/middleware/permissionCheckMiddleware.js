// server/middleware/permissionCheckMiddleware.js
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

/**
 * Belirli bir modül ve yetki türü için yetki kontrolü yapan middleware
 * @param {string} moduleId - Kontrol edilecek modülün ID'si 
 * @param {string} permissionType - Kontrol edilecek izin türü (view veya manage)
 * @returns {function} Express middleware fonksiyonu
 */
const permissionCheckMiddleware = (moduleId, permissionType = "view") => {
  return asyncHandler(async (req, res, next) => {
    try {
      // req.user'ın admin ID'sini alın (isAdmin middleware'inden geliyor olmalı)
      const adminId = req.user._id;
      
      if (!adminId) {
        return res.status(401).json({
          success: false,
          message: "Yetkilendirme bilgisi bulunamadı."
        });
      }
      
      // Veritabanından admin bilgilerini çek
      const user = await User.findById(adminId);
      
      if (!user || user.role !== "admin") {
        return res.status(401).json({
          success: false,
          message: "Admin kullanıcı bulunamadı."
        });
      }
      
      // Tam yetkili adminler her zaman erişebilir (Level 1)
      if (user.adminAccessLevel === 1) {
        return next();
      }
      
      // Modül izinlerini kontrol et
      const modulePermissions = user.adminModulePermissions || {};
      let modulePermObj;
      
      // Map veya normal obje olup olmadığını kontrol et
      if (modulePermissions instanceof Map) {
        modulePermObj = modulePermissions.get(moduleId);
      } else {
        modulePermObj = modulePermissions[moduleId];
      }
      
      const hasPermission = modulePermObj && 
        (permissionType === "view" 
          ? modulePermObj.view 
          : modulePermObj.manage);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Bu işlem için ${permissionType === "view" ? "görüntüleme" : "yönetim"} yetkiniz bulunmamaktadır.`
        });
      }
      
      // Yetki kontrolü başarılı, bir sonraki middleware'e geç
      next();
    } catch (error) {
      next(error);
    }
  });
};

module.exports = permissionCheckMiddleware;
