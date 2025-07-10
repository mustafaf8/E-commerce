const { sendEmail } = require("../../helpers/emailHelper");

const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Email içeriğini HTML formatında oluştur
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #333;">Yeni İletişim Formu Mesajı</h2>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Gönderen:</strong> ${name}</p>
          <p><strong>E-posta:</strong> ${email}</p>
          <p><strong>Konu:</strong> ${subject}</p>
        </div>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          <h3 style="color: #444; margin-top: 0;">Mesaj:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    // Düz metin versiyonu
    const emailText = `
      Yeni İletişim Formu Mesajı
      
      Gönderen: ${name}
      E-posta: ${email}
      Konu: ${subject}
      
      Mesaj:
      ${message}
    `;

    // Email gönder
    const emailSent = await sendEmail({
      to: "admin@deposun.com",
      subject: `İletişim Formu: ${subject}`,
      text: emailText,
      html: emailHtml,
      replyTo: email // Yanıt verilecek adres olarak gönderenin emailini ayarla
    });

    if (!emailSent) {
      throw new Error("E-posta gönderilemedi");
    }

    res.status(200).json({
      success: true,
      message: "Mesajınız başarıyla gönderildi."
    });

  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin."
    });
  }
};

module.exports = {
  sendContactEmail
}; 