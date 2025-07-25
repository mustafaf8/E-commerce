const User = require("../../models/User");

// GET /api/users/admins -> Sadece admin rolündeki kullanıcıları getir
exports.getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await User.find({ role: "admin" }).select("_id userName email role authProvider createdAt");
    res.status(200).json({ success: true, data: adminUsers });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: "Admin kullanıcılar getirilemedi.",
      error: error.message 
    });
  }
};

// GET /api/users/regular -> Sadece normal rolündeki kullanıcıları getir
exports.getRegularUsers = async (req, res) => {
  try {
    const regularUsers = await User.find({ role: "user" }).select("_id userName email role authProvider createdAt");
    res.status(200).json({ success: true, data: regularUsers });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: "Normal kullanıcılar getirilemedi.",
      error: error.message 
    });
  }
};

// PUT /api/users/make-admin/:userId -> Kullanıcıyı admin yap
exports.makeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }
    
    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Kullanıcı zaten admin rolüne sahip" });
    }
    
    user.role = "admin";
    // Varsayılan admin yetki seviyesi ve izinler
    user.adminAccessLevel = 3; // Sınırlı yetki
    
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: "Kullanıcı başarıyla admin yapıldı",
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: "Kullanıcı admin yapılırken hata oluştu.",
      error: error.message 
    });
  }
};

// PUT /api/users/remove-admin/:userId -> Admin yetkisini geri al
exports.removeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" });
    }
    
    if (user.role === "user") {
      return res.status(400).json({ success: false, message: "Kullanıcı zaten normal kullanıcı rolüne sahip" });
    }
    
    // Eğer son admin kullanıcısıysa, işlemi reddet
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res.status(400).json({ 
        success: false, 
        message: "Son admin kullanıcısının yetkisi alınamaz. En az bir admin kullanıcı olmalıdır." 
      });
    }
    
    user.role = "user";
    // Admin yetki seviyesi ve izinleri kaldır
    user.adminAccessLevel = undefined;
    user.adminModulePermissions = {};
    
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: "Admin yetkisi başarıyla kaldırıldı",
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: "Admin yetkisi kaldırılırken hata oluştu.",
      error: error.message 
    });
  }
}; 