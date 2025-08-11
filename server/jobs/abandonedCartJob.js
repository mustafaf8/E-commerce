const cron = require("node-cron");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product"); // Ürün detayları için
const AbandonedCartReminder = require("../models/AbandonedCartReminder");
const { sendAbandonedCartEmail } = require("../helpers/emailHelper");

const CHECK_INTERVAL_HOURS = 2;
const ABANDONED_THRESHOLD_MIN_HOURS = 1; 
const ABANDONED_THRESHOLD_MAX_HOURS = 24; 
const REMINDER_COOLDOWN_DAYS = 3; 

const scheduleAbandonedCartEmails = () => {
  // Örneğin her CHECK_INTERVAL_HOURS saatte bir çalışır:
  cron.schedule(`0 */${CHECK_INTERVAL_HOURS} * * *`, async () => {

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
        "items.0": { $exists: true },
        updatedAt: {
          $gte: minAbandonedTime,
          $lt: maxAbandonedTime,
        },
      }).populate("userId", "email userName"); 

      for (const cart of potentialCarts) {
        if (!cart.userId || !cart.userId.email) {
         console.log(
           `Sepet ID ${cart._id}: Kullanıcı bilgisi veya e-postası eksik, atlanıyor.`
          );
          continue;
        }

        // Bu kullanıcıya son REMINDER_COOLDOWN_DAYS içinde hatırlatma gönderilmiş mi?
        const recentReminder = await AbandonedCartReminder.findOne({
          userId: cart.userId._id,
          createdAt: { $gte: reminderCooldownDate },
        });

        if (recentReminder) {
          continue;
        }

        const existingReminderForCart = await AbandonedCartReminder.findOne({
          userId: cart.userId._id,
          cartId: cart._id,
          status: "sent",
        });
        if (existingReminderForCart) {
          continue;
        }

        const populatedCart = await Cart.findById(cart._id).populate({
          path: "items.productId",
          model: "Product",
          select: "title image price salePrice", 
        });

        if (
          !populatedCart ||
          !populatedCart.items ||
          populatedCart.items.length === 0
        ) {
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
        const completePurchaseLink = `${clientUrl}/shop/cart`; 

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

    } catch (error) {
      console.error(
        `(${new Date().toISOString()}) Terk edilmiş sepet e-posta görevi sırasında hata:`,
        error
      );
    }
  });
};

module.exports = { scheduleAbandonedCartEmails };

