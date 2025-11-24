const User = require("../../models/User");
const { logInfo, logError } = require("../../helpers/logger");
const bcrypt = require("bcryptjs");

// GET /api/users/admins -> Sadece admin rolündeki kullanıcıları getir
exports.getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await User.find({ role: "admin" })
      .select("_id userName email role authProvider createdAt adminAccessLevel")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: adminUsers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin kullanıcılar getirilemedi.",
      error: error.message,
    });
  }
};

// GET /api/users/regular -> Sadece normal rolündeki kullanıcıları getir
exports.getRegularUsers = async (req, res) => {
  try {
    const regularUsers = await User.find({ role: "user" })
      .select("_id userName email role authProvider createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: regularUsers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Normal kullanıcılar getirilemedi.",
      error: error.message,
    });
  }
};

// PUT /api/users/make-admin/:userId -> Kullanıcıyı admin yap
exports.makeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı zaten admin rolüne sahip",
      });
    }

    user.role = "admin";
    // Varsayılan admin yetki seviyesi ve izinler
    user.adminAccessLevel = 3;

    await user.save();

    logInfo(`${user.userName} admin yapıldı`, req, {
      action: "MAKE_ADMIN",
      resourceId: user._id,
      resourceType: "User",
      additionalData: { targetUser: user.userName },
    });

    res.status(200).json({
      success: true,
      message: "Kullanıcı başarıyla admin yapıldı",
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logError("Kullanıcı admin yapılırken hata oluştu", req, {
      action: "MAKE_ADMIN_ERROR",
      resourceId: userId,
      resourceType: "User",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      message: "Kullanıcı admin yapılırken hata oluştu.",
      error: error.message,
    });
  }
};

// PUT /api/users/remove-admin/:userId -> Admin yetkisini geri al
exports.removeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Kullanıcı bulunamadı" });
    }

    if (user.role === "user") {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı zaten normal kullanıcı rolüne sahip",
      });
    }

    // Eğer son admin kullanıcısıysa, işlemi reddet
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message:
          "Son admin kullanıcısının yetkisi alınamaz. En az bir admin kullanıcı olmalıdır.",
      });
    }

    user.role = "user";
    // Admin yetki seviyesi ve izinleri kaldır
    user.adminAccessLevel = undefined;
    user.adminModulePermissions = {};

    await user.save();

    logInfo(`${user.userName} admin yetkisi kaldırıldı`, req, {
      action: "REMOVE_ADMIN",
      resourceId: user._id,
      resourceType: "User",
      additionalData: { targetUser: user.userName },
    });

    res.status(200).json({
      success: true,
      message: "Admin yetkisi başarıyla kaldırıldı",
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logError("Admin yetkisi kaldırılırken hata oluştu", req, {
      action: "REMOVE_ADMIN_ERROR",
      resourceId: userId,
      resourceType: "User",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      message: "Admin yetkisi kaldırılırken hata oluştu.",
      error: error.message,
    });
  }
};

exports.getPaymentAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "payment_agent" })
      .select("_id userName email isActive createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kasiyer listesi alınamadı.",
      error: error.message,
    });
  }
};

exports.addPaymentAgent = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "İsim, e-posta ve şifre alanları zorunludur.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu e-posta adresi ile kayıtlı kullanıcı zaten mevcut.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAgent = await User.create({
      userName,
      email,
      password: hashedPassword,
      role: "payment_agent",
      isActive: true,
    });

    logInfo("Yeni ödeme temsilcisi oluşturuldu", req, {
      action: "CREATE_PAYMENT_AGENT",
      resourceId: newAgent._id,
      resourceType: "User",
      additionalData: { userName },
    });

    res.status(201).json({
      success: true,
      data: {
        _id: newAgent._id,
        userName: newAgent.userName,
        email: newAgent.email,
        isActive: newAgent.isActive,
        createdAt: newAgent.createdAt,
      },
      message: "Kasiyer hesabı oluşturuldu.",
    });
  } catch (error) {
    logError("Ödeme temsilcisi oluşturulamadı", req, {
      action: "CREATE_PAYMENT_AGENT_ERROR",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      message: "Kasiyer hesabı oluşturulamadı.",
      error: error.message,
    });
  }
};

exports.updateAgentStatus = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive değeri boolean olmalıdır.",
      });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "payment_agent") {
      return res
        .status(404)
        .json({ success: false, message: "Kasiyer bulunamadı." });
    }

    agent.isActive = isActive;
    await agent.save();

    logInfo("Ödeme temsilcisi durumu güncellendi", req, {
      action: "UPDATE_PAYMENT_AGENT_STATUS",
      resourceId: agent._id,
      resourceType: "User",
      additionalData: { isActive },
    });

    res.status(200).json({
      success: true,
      data: {
        _id: agent._id,
        userName: agent.userName,
        email: agent.email,
        isActive: agent.isActive,
      },
      message: "Durum güncellendi.",
    });
  } catch (error) {
    logError("Ödeme temsilcisi durumu güncellenemedi", req, {
      action: "UPDATE_PAYMENT_AGENT_STATUS_ERROR",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      message: "Durum güncellenemedi.",
      error: error.message,
    });
  }
};

exports.deletePaymentAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = await User.findById(agentId);

    if (!agent || agent.role !== "payment_agent") {
      return res
        .status(404)
        .json({ success: false, message: "Kasiyer bulunamadı." });
    }

    await agent.deleteOne();

    logInfo("Ödeme temsilcisi silindi", req, {
      action: "DELETE_PAYMENT_AGENT",
      resourceId: agent._id,
      resourceType: "User",
    });

    res.status(200).json({
      success: true,
      message: "Kasiyer hesabı silindi.",
    });
  } catch (error) {
    logError("Ödeme temsilcisi silinemedi", req, {
      action: "DELETE_PAYMENT_AGENT_ERROR",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      message: "Kasiyer hesabı silinemedi.",
      error: error.message,
    });
  }
};
