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
        productId: String,
        title: String,
        image: String,
        price: String,
        quantity: Number,
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
    totalAmount: { type: Number, required: true },
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
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
