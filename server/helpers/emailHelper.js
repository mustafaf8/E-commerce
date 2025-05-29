const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Terk edilmiş sepet hatırlatma e-postası gönderir.
 * @param {string} toEmail Alıcının e-posta adresi
 * @param {string} userName Alıcının kullanıcı adı
 * @param {Array<object>} cartItems Sepetteki ürünler (title, image, quantity, price, salePrice içeren objeler)
 * @param {string} completePurchaseLink Sepeti tamamlama bağlantısı
 * @returns {Promise<boolean>} E-posta başarıyla gönderildiyse true, aksi takdirde false döner.
 */
const sendAbandonedCartEmail = async (
  toEmail,
  userName,
  cartItems,
  completePurchaseLink
) => {
  let itemsHtml = cartItems
    .map((item) => {
      const effectivePrice = item.salePrice > 0 ? item.salePrice : item.price;
      return `
      <div style="border-bottom: 1px solid #eeeeee; padding: 12px 0; display: flex; align-items: center;">
        <img src="${item.image}" alt="${
        item.title
      }" style="width: 65px; height: 65px; object-fit: cover; margin-right: 15px; border-radius: 6px; border: 1px solid #ddd;">
        <div style="flex-grow: 1;">
          <h4 style="margin:0; font-size: 15px; color: #333333; font-weight: 600;">${
            item.title
          }</h4>
          <p style="margin: 4px 0; font-size: 13px; color: #555555;">Miktar: ${
            item.quantity
          }</p>
          <p style="margin: 4px 0; font-size: 14px; color: #111111; font-weight: bold;">Fiyat: ${Number(
            effectivePrice
          ).toFixed(2)} TL</p>
        </div>
      </div>
    `;
    })
    .join("");

  if (cartItems.length === 0) {
    itemsHtml =
      "<p>Sepetinizde şu anda ürün bulunmuyor gibi görünüyor. Yeni ürünler keşfetmeye ne dersiniz?</p>";
  }

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 30px auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #2c3e50; font-size: 26px; font-weight: bold;">Sepetinizdeki Ürünler Sizi Bekliyor!</h1>
      </div>
      <p style="font-size: 16px; color: #34495e; line-height: 1.6;">Merhaba ${userName},</p>
      <p style="font-size: 16px; color: #34495e; line-height: 1.6;">
        Görünüşe göre sepetinizde bazı harika ürünler bıraktınız. Alışverişinize kaldığınız yerden devam etmek ister misiniz?
      </p>
      <div style="margin: 25px 0;">
        ${itemsHtml}
      </div>
      <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
        <a href="${completePurchaseLink}" style="background-color: #3498db; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 17px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Alışverişi Tamamla
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
      <p style="font-size: 13px; color: #7f8c8d; text-align: center;">
        Eğer bu ürünleri zaten satın aldıysanız veya artık ilgilenmiyorsanız, bu e-postayı dikkate almayabilirsiniz.
      </p>
      <p style="font-size: 13px; color: #7f8c8d; text-align: center; margin-top: 10px;">
        Teşekkürler,<br/>
        <strong>MERN Shop Ekibi</strong>
      </p>
    </div>
  `;

  const mailOptions = {
    from: `"Deposun Shop Destek" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🛍️ Unutma, Sepetindeki Harika Ürünler Seni Bekliyor!",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Terk edilmiş sepet e-postası başarıyla gönderildi: ${toEmail}`
    );
    return true;
  } catch (error) {
    console.error(`E-posta gönderilemedi ${toEmail}:`, error);
    return false;
  }
};

module.exports = { sendAbandonedCartEmail };
