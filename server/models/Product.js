const mongoose = require("mongoose");
const { getExchangeRate } = require("../utils/currencyConverter");
const { roundToMarketingPrice } = require("../utils/priceUtils");

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
    priceUSD: {
      type: Number,
      required: [true, "Ürün fiyatı (USD) zorunludur."],
      min: [0, "Fiyat negatif olamaz."],
    },
    salePriceUSD: {
      type: Number,
      required: false,
      default: null,
      min: [0, "İndirimli fiyat negatif olamaz."],
    },
    price: {
      type: Number,
    },
    salePrice: {
      type: Number,
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
    costPrice: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Maliyet negatif olamaz."],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Yardımcı method: TL fiyatlarını hesapla
ProductSchema.methods.calculateTLPrices = async function() {
  try {
    const rate = await getExchangeRate();
    const toNumber = (val) => (val !== undefined && val !== null ? Number(val) : null);

    const calcTL = (usd) => {
      if (usd === null || isNaN(usd)) return 0;
      const tl = usd * rate;
      return Math.round(tl); // tam sayıya yuvarla, .00 formatı frontend'de eklenecek
    };

    const usdPrice = toNumber(this.priceUSD);
    const usdSale = toNumber(this.salePriceUSD);

    this.price = usdPrice !== null ? calcTL(usdPrice) : this.price || 0;
    this.salePrice = usdSale !== null ? calcTL(usdSale) : null;

    return this;
  } catch (error) {
    console.error("TL fiyat hesaplama hatası:", error);
    const fallbackRate = 30;
    if (this.priceUSD) this.price = Math.round(Number(this.priceUSD) * fallbackRate);
    if (this.salePriceUSD) this.salePrice = Math.round(Number(this.salePriceUSD) * fallbackRate);
    return this;
  }
};

module.exports = mongoose.model("Product", ProductSchema);
