const mongoose = require("mongoose");

const DirectPaymentSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "error"],
      default: "pending",
    },
    iyzicoConversationId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    customerNote: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DirectPayment", DirectPaymentSchema);