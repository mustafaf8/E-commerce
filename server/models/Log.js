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
    source: {
      type: String,
      default: "server",
    },
  },
  {
    timestamps: true,
  }
);

logSchema.index({ timestamp: -1 });
logSchema.index({ level: 1 });
logSchema.index({ userId: 1 });
logSchema.index({ action: 1 });
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 500000 });

module.exports = mongoose.model("Log", logSchema);
