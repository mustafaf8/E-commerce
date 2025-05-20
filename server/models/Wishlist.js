const mongoose = require("mongoose");
const WishlistItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // İstersen eklenme tarihi gibi ek bilgiler de tutabilirsin
    // addedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: [WishlistItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
