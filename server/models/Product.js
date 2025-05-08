const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Ürün resmi zorunludur."], // Gerekliyse true yapın
    },
    title: {
      type: String,
      required: [true, "Ürün başlığı zorunludur."],
      trim: true,
      index: true, // Aramalar için index eklenebilir
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Ürün fiyatı zorunludur."],
      min: [0, "Fiyat negatif olamaz."], // Minimum değer kontrolü
    },
    salePrice: {
      type: Number,
      required: [true, "Ürün fiyatı zorunludur."],
      min: [0, "Fiyat negatif olamaz."], // Minimum değer kontrolü
    },
    totalStock: {
      type: Number,
      required: [true, "Stok miktarı zorunludur."],
      min: [0, "Stok negatif olamaz."],
      default: 0,
    },
    averageReview: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    salesCount: {
      type: Number,
      default: 0,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Yeni Category modeline referans
      required: true, // Kategori zorunlu olsun
      index: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand", // Yeni Brand modeline referans
      required: false, // Marka zorunlu olmayabilir, isteğe bağlıysa false yap
      index: true,
    },
    salesCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
