const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    level: {
      type: String,
      enum: ["info", "warn", "error", "debug"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    meta: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
      ipAddress: String,
      userAgent: String,
      action: String,
      resourceId: String,
      resourceType: String,
      additionalData: mongoose.Schema.Types.Mixed,
    },
    source: {
      type: String,
      default: "server",
    },
  },
  {
    timestamps: true,
  }
);

// İndeksler ekle
logSchema.index({ timestamp: -1 });
logSchema.index({ level: 1 });
logSchema.index({ "meta.userId": 1 });
logSchema.index({ "meta.action": 1 });

module.exports = mongoose.model("Log", logSchema); 