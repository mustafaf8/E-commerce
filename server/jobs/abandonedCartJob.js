const cron = require("node-cron");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product"); // Ürün detayları için
const AbandonedCartReminder = require("../models/AbandonedCartReminder");
const { sendAbandonedCartEmail } = require("../helpers/emailHelper");

const CHECK_INTERVAL_HOURS = 2; // Kaç saatte bir kontrol edilecek
const ABANDONED_THRESHOLD_MIN_HOURS = 1; // En az kaç saat aktif olmayan sepetler
const ABANDONED_THRESHOLD_MAX_HOURS = 24; // En fazla kaç saat aktif olmayan sepetler (çok eski sepetlere göndermemek için)
const REMINDER_COOLDOWN_DAYS = 3; // Aynı kullanıcıya en az kaç gün sonra tekrar hatırlatma yapılabilir

const scheduleAbandonedCartEmails = () => {
  // Örneğin her CHECK_INTERVAL_HOURS saatte bir çalışır:
  cron.schedule(`0 */${CHECK_INTERVAL_HOURS} * * *`, async () => {
    console.log(
      `(${new Date().toISOString()}) Terk edilmiş sepet e-posta görevi başlatılıyor...`
    );

    const now = new Date();
    const minAbandonedTime = new Date(
      now.getTime() - ABANDONED_THRESHOLD_MAX_HOURS * 60 * 60 * 1000
    );
    const maxAbandonedTime = new Date(
      now.getTime() - ABANDONED_THRESHOLD_MIN_HOURS * 60 * 60 * 1000
    );
    const reminderCooldownDate = new Date(
      now.getTime() - REMINDER_COOLDOWN_DAYS * 24 * 60 * 60 * 1000
    );

    try {
      const potentialCarts = await Cart.find({
        "items.0": { $exists: true }, // Sepette en az bir ürün olmalı
        updatedAt: {
          $gte: minAbandonedTime,
          $lt: maxAbandonedTime,
        },
      }).populate("userId", "email userName"); // Kullanıcı bilgilerini al (sadece email ve userName yeterli)

      console.log(
        `Kontrol edilecek ${potentialCarts.length} potansiyel terk edilmiş sepet bulundu.`
      );

      for (const cart of potentialCarts) {
        if (!cart.userId || !cart.userId.email) {
           console.log(`Sepet ID ${cart._id}: Kullanıcı bilgisi veya e-postası eksik, atlanıyor.`);
          continue;
        }

        // Bu kullanıcıya son REMINDER_COOLDOWN_DAYS içinde hatırlatma gönderilmiş mi?
        const recentReminder = await AbandonedCartReminder.findOne({
          userId: cart.userId._id,
          createdAt: { $gte: reminderCooldownDate }, // Son gönderim zamanına bak
        });

        if (recentReminder) {
          // console.log(`Kullanıcı ${cart.userId.email} için son ${REMINDER_COOLDOWN_DAYS} günde zaten hatırlatma gönderilmiş (Sepet ID: ${cart._id}), atlanıyor.`);
          continue;
        }

        // Bu spesifik sepet için daha önce 'sent' durumunda bir hatırlatma var mı?
        // Bu, aynı sepet tekrar tekrar tetiklenirse diye ek bir kontrol.
        const existingReminderForCart = await AbandonedCartReminder.findOne({
          userId: cart.userId._id,
          cartId: cart._id,
          status: "sent",
        });
        if (existingReminderForCart) {
          // console.log(`Sepet ID ${cart._id} için zaten 'sent' durumunda bir hatırlatma mevcut, atlanıyor.`);
          continue;
        }

        // Ürün detaylarını almak için sepeti tekrar populate et
        const populatedCart = await Cart.findById(cart._id).populate({
          path: "items.productId",
          model: "Product",
          select: "title image price salePrice", // E-posta için gerekli alanlar
        });

        if (
          !populatedCart ||
          !populatedCart.items ||
          populatedCart.items.length === 0
        ) {
          console.warn(
            `Sepet ID ${cart._id}: Populate sonrası ürün bulunamadı veya sepet boş, atlanıyor.`
          );
          continue;
        }

        const cartItemsForEmail = populatedCart.items.map((item) => ({
          title: item.productId.title,
          image: item.productId.image,
          quantity: item.quantity,
          price: item.productId.price,
          salePrice: item.productId.salePrice,
        }));

        const clientUrl =
          process.env.CLIENT_BASE_URL || "http://localhost:5173";
        // Kullanıcıyı direkt sepetine veya bir "sepetinizi tamamlayın" sayfasına yönlendirebilirsiniz.
        const completePurchaseLink = `${clientUrl}/shop/cart`; // Veya /shop/checkout

        console.log(
          `Kullanıcı ${cart.userId.email} için e-posta gönderiliyor (Sepet ID: ${cart._id})...`
        );
        const emailSentSuccessfully = await sendAbandonedCartEmail(
          cart.userId.email,
          cart.userId.userName,
          cartItemsForEmail,
          completePurchaseLink
        );

        if (emailSentSuccessfully) {
          await AbandonedCartReminder.create({
            userId: cart.userId._id,
            cartId: cart._id,
            status: "sent",
          });
          console.log(
            `Kullanıcı ${cart.userId.email} için hatırlatma kaydedildi (Sepet ID: ${cart._id}).`
          );
        } else {
          await AbandonedCartReminder.create({
            userId: cart.userId._id,
            cartId: cart._id,
            status: "failed",
          });
          console.error(
            `Kullanıcı ${cart.userId.email} için e-posta gönderimi başarısız oldu (Sepet ID: ${cart._id}).`
          );
        }
      }
      console.log(
        `(${new Date().toISOString()}) Terk edilmiş sepet e-posta görevi tamamlandı.`
      );
    } catch (error) {
      console.error(
        `(${new Date().toISOString()}) Terk edilmiş sepet e-posta görevi sırasında hata:`,
        error
      );
    }
  });
};

module.exports = { scheduleAbandonedCartEmails };

// const cron = require("node-cron");
// const Cart = require("../models/Cart");
// const User = require("../models/User");
// const Product = require("../models/Product"); // Ürün detayları için
// const AbandonedCartReminder = require("../models/AbandonedCartReminder");
// const { sendAbandonedCartEmail } = require("../helpers/emailHelper");

// // TEST İÇİN ZAMAN AYARLARI (DAHA SONRA GERÇEK DEĞERLERE DÖNDÜRÜN!)
// const CHECK_INTERVAL_SECONDS = 10; // Kaç saniyede bir kontrol edilecek
// const ABANDONED_THRESHOLD_MIN_SECONDS = 10; // En az kaç saniye aktif olmayan sepetler
// const ABANDONED_THRESHOLD_MAX_SECONDS = 60; // En fazla kaç saniye aktif olmayan sepetler (çok eskiyi alma)
// const REMINDER_COOLDOWN_MINUTES_TEST = 1; // TEST: Aynı kullanıcıya en az kaç dakika sonra tekrar hatırlatma

// const scheduleAbandonedCartEmails = () => {
//   // Her CHECK_INTERVAL_SECONDS saniyede bir çalışır:
//   cron.schedule(`*/${CHECK_INTERVAL_SECONDS} * * * * *`, async () => {
//     // Saniye bazlı cron
//     console.log(
//       `(${new Date().toISOString()}) [TEST] Terk edilmiş sepet e-posta görevi başlatılıyor...`
//     );

//     const now = new Date();
//     // saniye cinsinden hesaplama
//     const minAbandonedTime = new Date(
//       now.getTime() - ABANDONED_THRESHOLD_MAX_SECONDS * 1000
//     );
//     const maxAbandonedTime = new Date(
//       now.getTime() - ABANDONED_THRESHOLD_MIN_SECONDS * 1000
//     );
//     const reminderCooldownDate = new Date(
//       now.getTime() - REMINDER_COOLDOWN_MINUTES_TEST * 60 * 1000
//     );

//     try {
//       const potentialCarts = await Cart.find({
//         "items.0": { $exists: true },
//         updatedAt: {
//           $gte: minAbandonedTime,
//           $lt: maxAbandonedTime,
//         },
//       }).populate("userId", "email userName");

//       console.log(
//         `[TEST] Kontrol edilecek ${potentialCarts.length} potansiyel terk edilmiş sepet bulundu.`
//       );

//       for (const cart of potentialCarts) {
//         if (!cart.userId || !cart.userId.email) {
//           continue;
//         }

//         const recentReminder = await AbandonedCartReminder.findOne({
//           userId: cart.userId._id,
//           createdAt: { $gte: reminderCooldownDate },
//         });

//         if (recentReminder) {
//           console.log(
//             `[TEST] Kullanıcı ${cart.userId.email} için son ${REMINDER_COOLDOWN_MINUTES_TEST}dk içinde zaten hatırlatma gönderilmiş (Sepet ID: ${cart._id}), atlanıyor.`
//           );
//           continue;
//         }

//         const existingReminderForCart = await AbandonedCartReminder.findOne({
//           userId: cart.userId._id,
//           cartId: cart._id,
//           status: "sent",
//         });
//         if (existingReminderForCart) {
//           console.log(
//             `[TEST] Sepet ID ${cart._id} için zaten 'sent' durumunda bir hatırlatma mevcut, atlanıyor.`
//           );
//           continue;
//         }

//         const populatedCart = await Cart.findById(cart._id).populate({
//           path: "items.productId",
//           model: "Product",
//           select: "title image price salePrice",
//         });

//         if (
//           !populatedCart ||
//           !populatedCart.items ||
//           populatedCart.items.length === 0
//         ) {
//           console.warn(
//             `[TEST] Sepet ID ${cart._id}: Populate sonrası ürün bulunamadı veya sepet boş, atlanıyor.`
//           );
//           continue;
//         }

//         const cartItemsForEmail = populatedCart.items.map((item) => ({
//           title: item.productId.title,
//           image: item.productId.image,
//           quantity: item.quantity,
//           price: item.productId.price,
//           salePrice: item.productId.salePrice,
//         }));

//         const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
//         const completePurchaseLink = `${clientUrl}/shop/cart`;

//         console.log(
//           `[TEST] Kullanıcı ${cart.userId.email} için e-posta gönderiliyor (Sepet ID: ${cart._id})...`
//         );
//         const emailSentSuccessfully = await sendAbandonedCartEmail(
//           cart.userId.email,
//           cart.userId.userName,
//           cartItemsForEmail,
//           completePurchaseLink
//         );

//         const reminderStatus = emailSentSuccessfully ? "sent" : "failed";
//         await AbandonedCartReminder.create({
//           userId: cart.userId._id,
//           cartId: cart._id,
//           status: reminderStatus,
//         });

//         if (emailSentSuccessfully) {
//           console.log(
//             `[TEST] Kullanıcı ${cart.userId.email} için hatırlatma '${reminderStatus}' olarak kaydedildi (Sepet ID: ${cart._id}).`
//           );
//         } else {
//           console.error(
//             `[TEST] Kullanıcı ${cart.userId.email} için e-posta gönderimi başarısız oldu (Sepet ID: ${cart._id}). Durum: '${reminderStatus}'`
//           );
//         }
//       }
//       console.log(
//         `(${new Date().toISOString()}) [TEST] Terk edilmiş sepet e-posta görevi tamamlandı.`
//       );
//     } catch (error) {
//       console.error(
//         `(${new Date().toISOString()}) [TEST] Terk edilmiş sepet e-posta görevi sırasında hata:`,
//         error
//       );
//     }
//   });
// };

// module.exports = { scheduleAbandonedCartEmails };
