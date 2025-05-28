const mongoose = require("mongoose");

const AbandonedCartReminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    emailSentAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["sent", "failed", "user_completed_purchase"], // Kullanıcı e-postadan sonra satın aldı gibi durumlar eklenebilir.
      default: "sent",
    },
    // Tekrar gönderim mantığı için ek alanlar:
    // reminderCount: { type: Number, default: 1 },
    // nextReminderAt: { type: Date }
  },
  { timestamps: true }
);

// Aynı kullanıcıya aynı sepet için birden fazla aktif hatırlatma olmaması için
AbandonedCartReminderSchema.index({ userId: 1, cartId: 1, status: 1 });

module.exports = mongoose.model(
  "AbandonedCartReminder",
  AbandonedCartReminderSchema
);
