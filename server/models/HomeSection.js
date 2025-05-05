// server/models/HomeSection.js
const mongoose = require("mongoose");

const HomeSectionSchema = new mongoose.Schema(
  {
    title: {
      // Carousel başlığı (örn: "Kadın Yeni Sezon")
      type: String,
      required: true,
      trim: true,
    },
    displayOrder: {
      // Ana sayfadaki gösterim sırası
      type: Number,
      required: true,
      default: 0,
      index: true, // Sıralama için index
    },
    contentType: {
      // Carousel içeriğinin türü
      type: String,
      required: true,
      enum: ["BEST_SELLING", "CATEGORY", "BRAND", "TAG", "CUSTOM_FILTER"], // Olası türler
      default: "CATEGORY",
    },
    contentValue: {
      // İçerik türüne bağlı değer (örn: category slug, brand slug, tag)
      // CUSTOM_FILTER için { key: 'price', value: '>100' } gibi JSON olabilir
      type: String, // Veya Mixed tip olabilir
      required: function () {
        // BEST_SELLING dışındakiler için zorunlu
        return this.contentType !== "BEST_SELLING";
      },
      trim: true,
    },
    // İsteğe bağlı: contentValue'nun hangi modele referans verdiğini belirtmek için
    // contentRef: {
    //   type: String,
    //   enum: ['Category', 'Brand', 'Tag'] // Product modelindeki alanlara göre
    // },
    itemLimit: {
      // Carousel'da kaç ürün gösterilecek
      type: Number,
      default: 10,
    },
    isActive: {
      // Ana sayfada gösterilsin mi?
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeSection", HomeSectionSchema);
