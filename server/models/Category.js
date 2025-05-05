// server/models/Category.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Kategori adı zorunludur."],
      trim: true,
      unique: true, // Kategori adları benzersiz olmalı
    },
    slug: {
      // URL ve filtreleme için kullanılır (örn: "kadin-giyim")
      type: String,
      required: [true, "Kategori slug zorunludur."],
      trim: true,
      unique: true,
      lowercase: true,
    },
    isActive: {
      // Admin panelinde görünürlük için
      type: Boolean,
      default: true,
    },
    // İsteğe bağlı: parentCategory, icon, description vb. eklenebilir
  },
  { timestamps: true }
);

// Slug oluşturma middleware'i (opsiyonel ama önerilir)
CategorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    // Basit bir slugify örneği, daha gelişmiş kütüphaneler kullanılabilir
    this.slug = this.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
      .replace(/[^\w-]+/g, "") // Geçersiz karakterleri kaldır
      .replace(/--+/g, "-") // Çoklu tireleri teke indir
      .replace(/^-+/, "") // Baştaki tireleri kaldır
      .replace(/-+$/, ""); // Sondaki tireleri kaldır
  }
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
