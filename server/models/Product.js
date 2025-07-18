const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Ürün resmi zorunludur."],
    },
    images: [{
      type: String,
      trim: true,
    }],
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
      required: false,
      default: null,
    },
    totalStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    technicalSpecs: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
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
