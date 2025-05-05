// server/models/Brand.js
const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Marka adı zorunludur."],
      trim: true,
      unique: true, // Marka adları benzersiz olmalı
    },
    slug: {
      type: String,
      required: [true, "Marka slug zorunludur."],
      trim: true,
      unique: true,
      lowercase: true,
    },
    // İsteğe bağlı ek alanlar:
    // logo: String,
    // description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Kategori modelindeki gibi slug oluşturma middleware'i (önerilir)
BrandSchema.pre("save", function (next) {
  if (this.isModified("name") && (!this.slug || this.slug === "")) {
    // Basit slugify
    this.slug = this.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Boşlukları - ile değiştir
      .replace(/[^\w-]+/g, "") // Geçersiz karakterleri kaldır
      .replace(/--+/g, "-") // Çoklu tireleri teke indir
      .replace(/^-+/, "") // Baştaki tireleri kaldır
      .replace(/-+$/, ""); // Sondaki tireleri kaldır
  }
  next();
});

module.exports = mongoose.model("Brand", BrandSchema);
