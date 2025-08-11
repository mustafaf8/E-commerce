const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Kategori adı zorunludur."],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Kategori slug zorunludur."],
      trim: true,
      unique: true,
      lowercase: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    headerOrder: {
      type: Number,
      default: 999, 
    },
  },
  { timestamps: true }
);

CategorySchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
