const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: String,
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
      addressId: String, // Gerekmiyorsa kaldırılabilir
      address: String,
      city: String,
      pincode: String,
      phone: String,
      notes: String,
      contactName: String, // Bu alanı eklemek faydalı olabilir
    },
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
    paymentId: String, // Iyzico ödeme sonrası ID

    // === EKLENECEK ALANLAR ===
    iyzicoConversationId: String, // createOrder'da üretilen ID
    iyzicoToken: String, // <<< BU ALANI EKLE >>> checkoutFormInitialize'dan gelen token

    // payerId: String, // Iyzico kullanıyorsan bu gereksiz, silebilirsin
  },
  { timestamps: true }
); // createdAt ve updatedAt otomatik eklenir

module.exports = mongoose.model("Order", OrderSchema);
