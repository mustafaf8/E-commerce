const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Ürün resmi zorunludur."],
    },
    title: {
      type: String,
      required: [true, "Ürün başlığı zorunludur."],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Ürün fiyatı zorunludur."],
      min: [0, "Fiyat negatif olamaz."],
    },
    salePrice: {
      type: Number,
      required: [true, "Ürün fiyatı zorunludur."],
      min: [0, "Fiyat negatif olamaz."],
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
      ref: "Category",
      required: true,
      index: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: false,
      index: true,
    },
    salesCount: {
      type: Number,
      default: 0,
      index: true,
    },
    costPrice: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Maliyet negatif olamaz."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
