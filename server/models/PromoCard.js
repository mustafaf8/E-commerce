// server/models/PromoCard.js
const mongoose = require("mongoose");

const PromoCardSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Resim URL'si gereklidir."], // Resim zorunlu
    },
    title: {
      type: String, // Başlık opsiyonel
      trim: true,
    },
    link: {
      type: String, // Link opsiyonel
      trim: true,
    },
  },
  { timestamps: true }
); // createdAt ve updatedAt ekler

module.exports = mongoose.model("PromoCard", PromoCardSchema);
