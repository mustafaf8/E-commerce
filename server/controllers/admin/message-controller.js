const Message = require("../../models/Message");
const { sendEmail } = require("../../helpers/emailHelper");
const User = require("../../models/User");
const { logInfo, logError } = require("../../helpers/logger");

// GET /api/admin/messages?status=new
const getAllMessages = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const messages = await Message.find(filter)
      .populate("userId", "userName email")
      .sort({ createdAt: -1 });
    return res.json({ success: true, messages });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Mesajlar alınamadı.",
      error: err.message,
    });
  }
};

// POST /api/admin/messages/reply/:id
const replyToMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { reply } = req.body;
    if (!reply)
      return res
        .status(400)
        .json({ success: false, message: "Yanıt boş olamaz." });
    const adminId = req.user.id;
    const message = await Message.findById(messageId);
    if (!message)
      return res
        .status(404)
        .json({ success: false, message: "Mesaj bulunamadı." });
    message.replies.push({ adminId, message: reply });
    message.status = "replied";
    await message.save();

    // Kullanıcıya e-posta ile yanıt bildirimi gönder
    await sendEmail({
      to: message.email,
      subject: `Mesajınıza Yanıt Geldi: ${message.subject}`,
      htmlContent: `<b>Mesajınız:</b><br>${message.message}<br><br><b>Yanıtımız:</b><br>${reply}`,
    });
    logInfo("Mesaj yanıtlandı", req, {
      action: "REPLY_MESSAGE",
      resourceId: messageId,
      resourceType: "Message",
    });
    return res.json({ success: true, message: "Yanıt gönderildi." });
  } catch (err) {
    logError("Mesaj yanıtlanırken hata oluştu", req, {
      action: "REPLY_MESSAGE_ERROR",
      resourceId: messageId,
      resourceType: "Message",
      error: err.message,
    });
    return res.status(500).json({
      success: false,
      message: "Yanıt gönderilemedi.",
      error: err.message,
    });
  }
};

// PUT /api/admin/messages/status/:id
const updateMessageStatus = async (req, res) => {
  try {
    const messageId = req.params.id;
    const { status } = req.body;
    if (!["new", "read", "replied"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz durum." });
    }
    const message = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );
    if (!message)
      return res
        .status(404)
        .json({ success: false, message: "Mesaj bulunamadı." });

    logInfo("Mesaj durumu güncellendi", req, {
      action: "UPDATE_MESSAGE_STATUS",
      resourceId: messageId,
      resourceType: "Message",
    });

    return res.json({
      success: true,
      message: "Durum güncellendi.",
      data: message,
    });
  } catch (err) {
    logError("Mesaj durumu güncellenirken hata oluştu", req, {
      action: "UPDATE_MESSAGE_STATUS_ERROR",
      resourceId: messageId,
      resourceType: "Message",
      error: err.message,
    });
    return res.status(500).json({
      success: false,
      message: "Durum güncellenemedi.",
      error: err.message,
    });
  }
};

module.exports = { getAllMessages, replyToMessage, updateMessageStatus };
