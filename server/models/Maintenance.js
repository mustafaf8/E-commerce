const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema(
  {
    // Yalnızca tek bir döküman olmasını sağlamak için sabit bir ID kullanabiliriz.
    singleton: {
      type: String,
      default: "maintenance_status",
      unique: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    message: {
      type: String,
      trim: true,
      default:
        "Sitemiz şu anda planlı bir bakım çalışması nedeniyle geçici olarak hizmet dışıdır. Anlayışınız için teşekkür ederiz.",
    },
    returnDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
