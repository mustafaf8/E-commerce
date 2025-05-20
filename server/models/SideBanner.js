const mongoose = require("mongoose");
const SideBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Resim URL'si gereklidir."],
    },
    title: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SideBanner", SideBannerSchema);
