const Message = require("../../models/Message");
const { sendEmail } = require("../../helpers/emailHelper");

// Socket.IO instance'ı server.js'den alınacak (sonra bağlanacak)
let io;
function setSocketIo(socketIoInstance) {
  io = socketIoInstance;
}

// POST /api/contact/send
const sendContactMessage = async (req, res) => {
  try {
    const { userId, name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Tüm alanlar zorunludur." });
    }
    const newMessage = await Message.create({
      userId: userId || null,
      name,
      email,
      subject,
      message,
      status: "new",
      replies: [],
    });

    // Adminlere Socket.IO ile bildirim gönder
    if (io) {
      io.emit("new_message_received", {
        messageId: newMessage._id,
        subject,
        name,
        email,
      });
    }

    // Adminlere e-posta gönder (örnek: gokturklerenerji@gmail.com)
    await sendEmail({
      to: process.env.CONTACT_ADMIN_EMAIL || "gokturklerenerji@gmail.com",
      subject: `[Yeni Mesaj] ${subject}`,
      htmlContent: `<b>Yeni mesaj:</b><br>Ad: ${name}<br>Email: ${email}<br>Konu: ${subject}<br>Mesaj: ${message}`,
    });

    return res
      .status(201)
      .json({ success: true, message: "Mesajınız başarıyla iletildi." });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Mesaj gönderilemedi.",
        error: err.message,
      });
  }
};

module.exports = { sendContactMessage, setSocketIo };
