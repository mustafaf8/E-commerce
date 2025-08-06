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
    // TL fiyatları için yeni alanlar
    priceTL: {
      type: Number,
      default: 0,
    },
    salePriceTL: {
      type: Number,
      default: null,
    },
    // TL fiyatlarının son güncellenme zamanı
    priceLastUpdated: {
      type: Date,
      default: Date.now,
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
    numReviews: {
      type: Number,
      default: 0
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

// Optimize edilmiş TL fiyat hesaplama metodu
ProductSchema.methods.calculateTLPrices = async function(forceUpdate = false) {
  try {
    const now = new Date();
    const cacheExpiry = 60 * 60 * 1000; // 1 saat cache süresi
    
    // Cache kontrolü - eğer TL fiyatlar güncel ise ve force update istenmiyorsa
    if (!forceUpdate && 
        this.priceTL && 
        this.salePriceTL !== undefined && 
        this.priceLastUpdated && 
        (now - this.priceLastUpdated) < cacheExpiry) {
      
      // Cache'den TL fiyatları kullan
      this.price = this.priceTL;
      this.salePrice = this.salePriceTL;
      return this;
    }

    // Yeni kur ile hesaplama yap
    const rate = await getExchangeRate();
    const toNumber = (val) => (val !== undefined && val !== null ? Number(val) : null);

    const calcTL = (usd) => {
      if (usd === null || isNaN(usd)) return 0;
      const tl = usd * rate;
      return Math.round(tl);
    };

    const usdPrice = toNumber(this.priceUSD);
    const usdSale = toNumber(this.salePriceUSD);

    // TL fiyatları hesapla ve sakla
    this.priceTL = usdPrice !== null ? calcTL(usdPrice) : 0;
    this.salePriceTL = usdSale !== null ? calcTL(usdSale) : null;
    this.priceLastUpdated = now;

    // Virtual alanları güncelle
    this.price = this.priceTL;
    this.salePrice = this.salePriceTL;

    return this;
  } catch (error) {
    console.error("TL fiyat hesaplama hatası:", error);
    const fallbackRate = 30;
    if (this.priceUSD) {
      this.priceTL = Math.round(Number(this.priceUSD) * fallbackRate);
      this.price = this.priceTL;
    }
    if (this.salePriceUSD) {
      this.salePriceTL = Math.round(Number(this.salePriceUSD) * fallbackRate);
      this.salePrice = this.salePriceTL;
    }
    this.priceLastUpdated = new Date();
    return this;
  }
};

// Toplu TL fiyat güncelleme metodu
ProductSchema.statics.updateAllTLPrices = async function() {
  try {
    console.log("Tüm ürünlerin TL fiyatları güncelleniyor...");
    const rate = await getExchangeRate();
    const now = new Date();
    
    const result = await this.updateMany(
      {},
      [
        {
          $set: {
            priceTL: {
              $round: [
                { $multiply: ["$priceUSD", rate] },
                0
              ]
            },
            salePriceTL: {
              $cond: {
                if: { $ne: ["$salePriceUSD", null] },
                then: {
                  $round: [
                    { $multiply: ["$salePriceUSD", rate] },
                    0
                  ]
                },
                else: null
              }
            },
            priceLastUpdated: now,
            price: {
              $round: [
                { $multiply: ["$priceUSD", rate] },
                0
              ]
            },
            salePrice: {
              $cond: {
                if: { $ne: ["$salePriceUSD", null] },
                then: {
                  $round: [
                    { $multiply: ["$salePriceUSD", rate] },
                    0
                  ]
                },
                else: null
              }
            }
          }
        }
      ]
    );
    
    console.log(`${result.modifiedCount} ürünün TL fiyatları güncellendi.`);
    return result;
  } catch (error) {
    console.error("Toplu TL fiyat güncelleme hatası:", error);
    throw error;
  }
};

module.exports = mongoose.model("Product", ProductSchema);
