// server/models/Wishlist.js
const mongoose = require("mongoose");

const WishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Product modeline referans
      required: true,
    },
    // İstersen eklenme tarihi gibi ek bilgiler de tutabilirsin
    // addedAt: { type: Date, default: Date.now }
  },
  { _id: false }
); // Bu alt döküman için ayrı _id oluşturma

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User modeline referans
      required: true,
      unique: true, // Her kullanıcı için sadece bir tane favori listesi olsun
      index: true, // userId'ye göre hızlı arama için index
    },
    items: [WishlistItemSchema], // Favori ürünleri içeren dizi
  },
  { timestamps: true }
); // createdAt ve updatedAt alanları ekler

module.exports = mongoose.model("Wishlist", WishlistSchema);
