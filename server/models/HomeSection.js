const mongoose = require("mongoose");
const HomeSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ["BEST_SELLING", "CATEGORY", "BRAND", "TAG", "CUSTOM_FILTER"],
      default: "CATEGORY",
    },
    contentValue: {
      type: String,
      required: function () {
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
      type: Number,
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeSection", HomeSectionSchema);
