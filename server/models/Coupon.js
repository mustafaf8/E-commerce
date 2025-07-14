const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Kupon kodu zorunludur."],
      unique: true,
      trim: true,
      uppercase: true,
      index: { unique: true, collation: { locale: "en", strength: 2 } }, // case-insensitive unique index
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "İndirim türü zorunludur."],
    },
    discountValue: {
      type: Number,
      required: [true, "İndirim değeri zorunludur."],
      min: [0, "İndirim değeri negatif olamaz."],
      validate: {
        validator: function (value) {
          if (this.discountType === "percentage") {
            return value >= 0 && value <= 100;
          }
          return value >= 0;
        },
        message: "Yüzdelik indirim 0-100 arasında olmalıdır.",
      },
    },
    minPurchase: {
      type: Number,
      default: 0,
      min: [0, "Minimum alışveriş tutarı negatif olamaz."],
    },
    maxUses: {
      type: Number,
      default: null,
      min: [1, "Maksimum kullanım sayısı en az 1 olmalıdır."],
    },
    usesCount: {
      type: Number,
      default: 0,
      min: [0, "Kullanım sayısı negatif olamaz."],
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Açıklama en fazla 200 karakter olabilir."],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    showOnCampaignsPage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Kupon kodunu kaydetmeden önce büyük harfe çevir
CouponSchema.pre("save", function (next) {
  if (this.code) {
    this.code = this.code.toUpperCase();
  }
  next();
});

// Kuponun geçerli olup olmadığını kontrol eden method
CouponSchema.methods.isValidCoupon = function (cartTotal = 0) {
  const now = new Date();

  // Aktif mi?
  if (!this.isActive) {
    return { valid: false, message: "Bu kupon aktif değil." };
  }

  // Süresi dolmuş mu?
  if (this.expiryDate && this.expiryDate < now) {
    return { valid: false, message: "Bu kuponun süresi dolmuş." };
  }

  // Kullanım limiti aşılmış mı?
  if (this.maxUses && this.usesCount >= this.maxUses) {
    return { valid: false, message: "Bu kuponun kullanım limiti dolmuş." };
  }

  // Minimum alışveriş tutarı sağlanıyor mu?
  if (this.minPurchase && cartTotal < this.minPurchase) {
    return {
      valid: false,
      message: `Bu kupon için minimum ${this.minPurchase}₺ alışveriş yapmalısınız.`,
    };
  }

  return { valid: true, message: "Kupon geçerli." };
};

// İndirim tutarını hesaplayan method
CouponSchema.methods.calculateDiscount = function (cartTotal) {
  if (this.discountType === "percentage") {
    return (cartTotal * this.discountValue) / 100;
  } else {
    return Math.min(this.discountValue, cartTotal); // İndirim sepet toplamından fazla olamaz
  }
};

module.exports = mongoose.model("Coupon", CouponSchema);
