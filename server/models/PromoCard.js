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
    // İsteğe bağlı olarak ekleyebileceğiniz alanlar:
    // order: { type: Number, default: 0 }, // Sıralama için
    // isActive: { type: Boolean, default: true }, // Aktif/Pasif durumu
  },
  { timestamps: true }
); // createdAt ve updatedAt ekler

module.exports = mongoose.model("PromoCard", PromoCardSchema);
