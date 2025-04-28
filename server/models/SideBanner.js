// server/models/SideBanner.js
const mongoose = require("mongoose");

const SideBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Resim URL'si gereklidir."],
    },
    title: {
      type: String, // Opsiyonel başlık
      trim: true,
    },
    link: {
      type: String, // Opsiyonel link
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SideBanner", SideBannerSchema);
