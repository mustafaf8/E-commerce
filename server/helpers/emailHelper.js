const SibApiV3Sdk = require("@getbrevo/brevo");

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sender = {
  email: process.env.BREVO_SENDER_EMAIL,
  name: "Deposun Destek",
};

/**
 * Genel amaçlı e-posta gönderme fonksiyonu
 * @param {Object} options E-posta gönderme seçenekleri
 * @param {string} options.to Alıcı e-posta adresi
 * @param {string} options.subject E-posta konusu
 * @param {string} [options.htmlContent] HTML formatında e-posta içeriği
 * @returns {Promise<boolean>} E-posta başarıyla gönderildiyse true döner
 */
const sendEmail = async (options) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  console.log("E-posta gönderim bilgileri:", {
    to: options.to,
    subject: options.subject,
    sender: sender,
    apiKey: process.env.BREVO_API_KEY ? "Mevcut" : "Eksik"
  });

  sendSmtpEmail.sender = sender;
  sendSmtpEmail.to = [{ email: options.to }];
  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.htmlContent;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("E-posta başarıyla gönderildi:", options.to);

    return true;
  } catch (error) {
    console.error(
      `Brevo ile e-posta gönderilemedi ${options.to}:`,
      error.response ? error.response.body : error.message
    );
    console.error("E-posta gönderim hatası detayları:", error);
    return false;
  }
};

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
        <strong>deposun Ekibi</strong>
      </p>
    </div>
  `;

  return sendEmail({
    to: toEmail,
    subject: "🛍️ Unutma, Sepetindeki Harika Ürünler Seni Bekliyor!",
    htmlContent: emailHtml,
  });
};

/**
 * Şifre sıfırlama e-postası gönderir.
 * @param {string} toEmail Alıcının e-posta adresi
 * @param {string} token Sıfırlama token'ı
 * @returns {Promise<boolean>} E-posta başarıyla gönderildiyse true döner.
 */
const sendPasswordResetEmail = async (toEmail, token) => {
  const resetLink = `${process.env.CLIENT_BASE_URL}/auth/reset-password/${token}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #333;">Şifre Sıfırlama Talebi</h2>
      <p>Merhaba,</p>
      <p>Hesabınız için bir şifre sıfırlama talebi aldık. Şifrenizi sıfırlamak için lütfen aşağıdaki butona tıklayın:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Şifreyi Sıfırla</a>
      </div>
      <p>Bu link 1 saat boyunca geçerlidir.</p>
      <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Şifreniz değiştirilmeyecektir.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #888;">Teşekkürler,<br/>Deposun Ekibi</p>
    </div>
  `;

  return sendEmail({
    to: toEmail,
    subject: "Deposun - Şifre Sıfırlama Talebiniz",
    htmlContent: emailHtml,
  });
};

/**
 * E-posta doğrulama e-postası gönderir.
 * @param {string} toEmail Alıcının e-posta adresi
 * @param {string} code 6 haneli doğrulama kodu
 * @param {string} [userName] Kullanıcı adı (opsiyonel)
 * @returns {Promise<boolean>} E-posta başarıyla gönderildiyse true döner.
 */
const sendEmailVerificationEmail = async (toEmail, code, userName = "") => {
  const greetingName = userName || toEmail.split("@")[0] || "Kullanıcı";

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #333;">Hesap Doğrulama</h2>
      <p>Merhaba ${greetingName},</p>
      <p>Deposun hesabınızı etkinleştirmek için aşağıdaki 6 haneli kodu kullanın:</p>
      <div style="text-align: center; margin: 20px 0;">
        <div style="background-color: #f8f9fa; border: 2px solid #16a34a; border-radius: 8px; padding: 20px; display: inline-block;">
          <h1 style="color: #16a34a; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${code}</h1>
        </div>
      </div>
      <p style="text-align: center; color: #666; font-size: 14px;">Bu kod 30 dakika boyunca geçerlidir.</p>
      <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #888;">Teşekkürler,<br/>Deposun Ekibi</p>s
    </div>
  `;

  return sendEmail({
    to: toEmail,
    subject: "Deposun - E-posta Doğrulama Kodu",
    htmlContent: emailHtml,
  });
};

/**
 * Sipariş onay e-postası gönderir.
 * @param {import("mongoose").Document} order Order belgesi (confirmed & paid)
 */
const sendOrderConfirmationEmail = async (order) => {
  if (!order) return false;

  try {
    // Alıcı bilgileri
    const isGuest = order.isGuestOrder;
    let recipientName = isGuest
      ? order.guestInfo?.fullName || "Müşteri"
      : order.userId?.userName || "Müşteri";
    let recipientEmail = isGuest ? order.guestInfo?.email : order.userId?.email;

    // Eğer kayıtlı kullanıcı ama populate edilmemişse, DB'den çek
    if (!isGuest && (!recipientEmail || !recipientName)) {
      try {
        const User = require("../models/User");
        const dbUser = await User.findById(order.userId).select(
          "userName email"
        );
        if (dbUser) {
          recipientEmail = recipientEmail || dbUser.email;
          if (!recipientName || recipientName === "Müşteri") {
            recipientName =
              dbUser.userName || dbUser.email?.split("@")[0] || "Müşteri";
          }
        }
      } catch (popErr) {
        console.error(
          "E-posta gönderimi: kullanıcı bilgisi çekilemedi",
          popErr.message
        );
      }
    }

    if (!recipientEmail) {
      console.warn("Onay e-postası: E-posta adresi bulunamadı.");
      return false;
    }

    // Ürün listesi HTML
    const itemsHtml = order.cartItems
      .map((item) => {
        const effectivePrice = item.priceTRY;
        const totalLine = (effectivePrice * item.quantity).toFixed(2);
        return `
          <tr>
            <td style="padding:8px 4px; border:1px solid #ddd;">
              <img src="${item.image}" alt="${
          item.title
        }" style="width:60px;height:60px;object-fit:cover;border-radius:4px;" />
            </td>
            <td style="padding:8px 4px; border:1px solid #ddd; font-size:14px;">${
              item.title
            }</td>
            <td style="padding:8px 4px; border:1px solid #ddd; text-align:center;">${
              item.quantity
            }</td>
            <td style="padding:8px 4px; border:1px solid #ddd; text-align:right;">${effectivePrice.toFixed(
              2
            )} TL</td>
            <td style="padding:8px 4px; border:1px solid #ddd; text-align:right;">${totalLine} TL</td>
          </tr>
        `;
      })
      .join("");

    // Finansal özet
    const subTotal = order.cartItems.reduce(
      (sum, it) => sum + it.priceTRY * it.quantity,
      0
    );
    const couponDiscount = order.appliedCoupon?.discountAmount || 0;
      const shippingFee = 0; 
    const grandTotal = order.totalAmountTRY;

    const emailHtml = `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:680px;margin:20px auto;border:1px solid #e5e5e5;border-radius:6px;padding:24px;background:#fafafa;">
        <h2 style="color:#333;text-align:center;">Siparişiniz Alındı! (No: ${
          order._id
        })</h2>
        <p>Merhaba ${recipientName},</p>
        <p>Siparişiniz başarıyla alındı. Detaylar aşağıdadır:</p>
        <h3 style="margin-top:24px;">Ürünler</h3>
        <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr>
              <th style="border:1px solid #ddd;padding:8px 4px;text-align:left;">&nbsp;</th>
              <th style="border:1px solid #ddd;padding:8px 4px;text-align:left;">Ürün</th>
              <th style="border:1px solid #ddd;padding:8px 4px;">Adet</th>
              <th style="border:1px solid #ddd;padding:8px 4px;text-align:right;">Birim</th>
              <th style="border:1px solid #ddd;padding:8px 4px;text-align:right;">Toplam</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3 style="margin-top:24px;">Özet</h3>
        <table style="width:100%;font-size:14px;">
          <tr><td>Ara Toplam:</td><td style="text-align:right;">${subTotal.toFixed(
            2
          )} TL</td></tr>
          ${
            couponDiscount > 0
              ? `<tr><td>Kupon İndirimi (${
                  order.appliedCoupon.code
                }):</td><td style="text-align:right;">- ${couponDiscount.toFixed(
                  2
                )} TL</td></tr>`
              : ""
          }
          ${
            shippingFee > 0
              ? `<tr><td>Kargo:</td><td style="text-align:right;">${shippingFee.toFixed(
                  2
                )} TL</td></tr>`
              : ""
          }
          <tr style="font-weight:bold;"><td>Genel Toplam:</td><td style="text-align:right;">${grandTotal.toFixed(
            2
          )} TL</td></tr>
        </table>

        <h3 style="margin-top:24px;">Teslimat Adresi</h3>
        <p style="white-space:pre-line;">${order.addressInfo.fullName}\n${
      order.addressInfo.address
    }\n${order.addressInfo.city} ${order.addressInfo.pincode || ""}</p>

        <p style="margin-top:32px;">Herhangi bir sorunuz için bu e-postayı yanıtlayabilir veya <a href="https://deposun.com/shop/home" target="_blank">Siparişlerim</a> sayfamızı ziyaret edebilirsiniz.</p>
        <p style="margin-top:24px;">Teşekkürler,<br/>Deposun Ekibi</p>
      </div>
    `;

    return await sendEmail({
      to: recipientEmail,
      subject: `Siparişiniz Alındı! - No: ${order._id}`,
      htmlContent: emailHtml,
    });
  } catch (err) {
    console.error("Onay e-postası gönderilemedi:", err.message);
    return false;
  }
};

/**
 * Sipariş onaylandığında admin e-posta adresine bildirim gönderir.
 * @param {import("mongoose").Document} order Order belgesi (confirmed)
 */
const sendOrderNotificationToAdmin = async (order) => {
  if (!order) return false;

  try {
    // Alıcı bilgileri
    const isGuest = order.isGuestOrder;
    let customerName = isGuest
      ? order.guestInfo?.fullName || "Misafir Müşteri"
      : order.userId?.userName || "Kayıtlı Müşteri";
    let customerEmail = isGuest
      ? order.guestInfo?.email
      : order.userId?.email;

    // Eğer kayıtlı kullanıcı ama populate edilmemişse, DB'den çek
    if (!isGuest && (!customerEmail || !customerName)) {
      try {
        const User = require("../models/User");
        const dbUser = await User.findById(order.userId).select("userName email");
        if (dbUser) {
          customerEmail = customerEmail || dbUser.email;
          if (!customerName || customerName === "Kayıtlı Müşteri") {
            customerName = dbUser.userName || dbUser.email?.split("@")[0] || "Kayıtlı Müşteri";
          }
        }
      } catch (popErr) {
        console.error("Admin bildirim e-postası: kullanıcı bilgisi çekilemedi", popErr.message);
      }
    }

    // Ürün listesi HTML
    const itemsHtml = order.cartItems
      .map((item) => {
        const effectivePrice = item.priceTRY;
        const totalLine = (effectivePrice * item.quantity).toFixed(2);
        return `
          <tr>
            <td style="padding:8px 4px; border:1px solid #ddd;">
              <img src="${item.image}" alt="${item.title}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;" />
            </td>
            <td style="padding:8px 4px; border:1px solid #ddd; font-size:14px;">${item.title}</td>
            <td style="padding:8px 4px; border:1px solid #ddd; text-align:center;">${item.quantity}</td>
            <td style="padding:8px 4px; border:1px solid #ddd; text-align:right;">${effectivePrice.toFixed(2)} TL</td>
            <td style="padding:8px 4px; border:1px solid #ddd; text-align:right;">${totalLine} TL</td>
          </tr>
        `;
      })
      .join("");

    // Finansal özet
    const subTotal = order.cartItems.reduce(
      (sum, it) => sum + it.priceTRY * it.quantity,
      0
    );
    const couponDiscount = order.appliedCoupon?.discountAmount || 0;
    const shippingFee = 0; 
    const grandTotal = order.totalAmountTRY;

    const emailHtml = `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:680px;margin:20px auto;border:1px solid #e5e5e5;border-radius:6px;padding:24px;background:#fafafa;">
        <h2 style="color:#333;text-align:center;">Yeni Sipariş Bildirimi - No: ${order._id}</h2>
        <p><strong>Yeni bir sipariş onaylandı!</strong></p>
        
        <h3 style="margin-top:24px;">Müşteri Bilgileri</h3>
        <table style="width:100%;font-size:14px;margin-bottom:20px;">
          <tr><td><strong>Müşteri Adı:</strong></td><td>${customerName}</td></tr>
          <tr><td><strong>E-posta:</strong></td><td>${customerEmail || "Belirtilmemiş"}</td></tr>
          <tr><td><strong>Sipariş Tarihi:</strong></td><td>${new Date(order.orderDate).toLocaleString('tr-TR')}</td></tr>
          <tr><td><strong>Ödeme Yöntemi:</strong></td><td>${order.paymentMethod}</td></tr>
          <tr><td><strong>Sipariş Durumu:</strong></td><td style="color:green;font-weight:bold;">${order.orderStatus}</td></tr>
        </table>

        <h3 style="margin-top:24px;">Ürünler</h3>
        <table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr>
              <th style="border:1px solid #ddd;padding:8px 4px;text-align:left;">&nbsp;</th>
              <th style="border:1px solid #ddd;padding:8px 4px;text-align:left;">Ürün</th>
              <th style="border:1px solid #ddd;padding:8px 4px;">Adet</th>
              <th style="border:1px solid #ddd;padding:8px 4px;text-align:right;">Birim</th>
              <th style="border:1px solid #ddd;padding:8px 4px;text-align:right;">Toplam</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h3 style="margin-top:24px;">Özet</h3>
        <table style="width:100%;font-size:14px;">
          <tr><td>Ara Toplam:</td><td style="text-align:right;">${subTotal.toFixed(2)} TL</td></tr>
          ${couponDiscount > 0 ? `<tr><td>Kupon İndirimi (${order.appliedCoupon.code}):</td><td style="text-align:right;">- ${couponDiscount.toFixed(2)} TL</td></tr>` : ""}
          ${shippingFee > 0 ? `<tr><td>Kargo:</td><td style="text-align:right;">${shippingFee.toFixed(2)} TL</td></tr>` : ""}
          <tr style="font-weight:bold;"><td>Genel Toplam:</td><td style="text-align:right;">${grandTotal.toFixed(2)} TL</td></tr>
        </table>

        <h3 style="margin-top:24px;">Teslimat Adresi</h3>
        <p style="white-space:pre-line;">${order.addressInfo.fullName}\n${order.addressInfo.address}\n${order.addressInfo.city} ${order.addressInfo.pincode || ""}</p>

        <p style="margin-top:32px;">Bu siparişi yönetmek için admin panelini kullanabilirsiniz.</p>
        <p style="margin-top:24px;">Teşekkürler,<br/>Deposun Sistemi</p>
      </div>
    `;

    return await sendEmail({
      to: "siparis@deposun.com",
      subject: `Yeni Sipariş Bildirimi - No: ${order._id}`,
      htmlContent: emailHtml,
    });
  } catch (err) {
    console.error("Admin bildirim e-postası gönderilemedi:", err.message);
    return false;
  }
};

module.exports = {
  sendAbandonedCartEmail,
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendEmail,
  sendOrderConfirmationEmail,
  sendOrderNotificationToAdmin,
};
