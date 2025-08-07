const Message = require("../../models/Message");

// GET /api/shop/messages
const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({ userId }).sort({ createdAt: -1 });
    return res.json({ success: true, messages });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Mesajlar alınamadı.",
        error: err.message,
      });
  }
};

module.exports = { getUserMessages };
