const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Marka adı zorunludur."],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Marka slug zorunludur."],
      trim: true,
      unique: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

BrandSchema.pre("save", function (next) {
  if (this.isModified("name") && (!this.slug || this.slug === "")) {
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

module.exports = mongoose.model("Brand", BrandSchema);
