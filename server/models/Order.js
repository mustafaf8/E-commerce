const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return !this.isGuestOrder;
      },
      index: true,
    },
    isGuestOrder: {
      type: Boolean,
      default: false,
      index: true,
    },
    guestInfo: {
      fullName: {
        type: String,
        required: function () {
          return this.isGuestOrder;
        },
      },
      email: {
        type: String,
        required: function () {
          return this.isGuestOrder;
        },
      },
      phone: {
        type: String,
        required: function () {
          return this.isGuestOrder;
        },
      },
      tcKimlikNo: {
        type: String,
        required: function () {
          return this.isGuestOrder;
        },
        validate: {
          validator: function(v) {
            return !v || /^\d{11}$/.test(v);
          },
          message: 'TC Kimlik No 11 haneli sayı olmalıdır'
        }
      },
    },
    tcKimlikNo: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          return !v || /^\d{11}$/.test(v);
        },
        message: 'TC Kimlik No 11 haneli sayı olmalıdır'
      }
    },
    cartId: String,
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        image: { type: String },
        quantity: { type: Number, required: true },
        priceUSD: { type: Number, required: true }, 
        exchangeRate: { type: Number, required: true }, 
        priceTRY: { type: Number, required: true }, 
      },
    ],
    addressInfo: {
      fullName: String,
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
      notes: String,
    },
    orderStatus: { type: String, required: true, default: "pending_payment" },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true, default: "pending" },
    totalAmountTRY: { type: Number, required: true }, 
    totalAmountUSD: { type: Number, required: true }, 
    appliedCoupon: {
      code: String,
      discountType: String,
      discountValue: Number,
      discountAmount: Number,
    },
    orderDate: { type: Date, default: Date.now },
    orderUpdateDate: Date,
    paymentId: String,
    iyzicoConversationId: String,
    iyzicoToken: String,
  },
  { timestamps: true, toJSON: { virtuals: true, transform(doc, ret) {
        if (ret.totalAmountTRY !== undefined) {
            ret.totalAmount = ret.totalAmountTRY;
        }
        if (Array.isArray(ret.cartItems)) {
            ret.cartItems = ret.cartItems.map(item => {
                if (item.priceTRY !== undefined) {
                    return { ...item, price: item.priceTRY };
                }
                return item;
            });
        }
        return ret;
    } }, toObject: { virtuals: true } }
);

OrderSchema.virtual('totalAmount').get(function() {
  return this.totalAmountTRY;
});

module.exports = mongoose.model("Order", OrderSchema);
