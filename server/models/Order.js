// // const mongoose = require("mongoose");

// // const OrderSchema = new mongoose.Schema(
// //   {
// //     userId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //       index: true,
// //     },
// //     cartId: String,
// //     cartItems: [
// //       {
// //         productId: String,
// //         title: String,
// //         image: String,
// //         price: String,
// //         quantity: Number,
// //       },
// //     ],
// //     addressInfo: {
// //       addressId: String, // Gerekmiyorsa kaldırılabilir
// //       address: String,
// //       city: String,
// //       pincode: String,
// //       phone: String,
// //       notes: String,
// //       contactName: String, // Bu alanı eklemek faydalı olabilir
// //     },
// //     orderStatus: String,
// //     paymentMethod: String,
// //     paymentStatus: String,
// //     totalAmount: Number,
// //     orderDate: Date,
// //     orderUpdateDate: Date,
// //     paymentId: String, // Iyzico ödeme sonrası ID

// //     // === EKLENECEK ALANLAR ===
// //     iyzicoConversationId: String, // createOrder'da üretilen ID
// //     iyzicoToken: String, // <<< BU ALANI EKLE >>> checkoutFormInitialize'dan gelen token

// //     // payerId: String, // Iyzico kullanıyorsan bu gereksiz, silebilirsin
// //   },
// //   { timestamps: true }
// // ); // createdAt ve updatedAt otomatik eklenir

// // module.exports = mongoose.model("Order", OrderSchema);

// // server/models/Order.js
// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     userId: {
//       // Giriş yapmış kullanıcı için User modeline referans
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: function () {
//         return !this.isGuestOrder;
//       }, // Misafir değilse zorunlu
//       index: true,
//     },
//     isGuestOrder: {
//       // Misafir siparişi mi?
//       type: Boolean,
//       default: false,
//     },
//     guestInfo: {
//       // Misafir bilgileri (eğer isGuestOrder true ise)
//       fullName: String,
//       email: String,
//       phone: String,
//     },
//     // ... (mevcut diğer alanlar: cartId, cartItems, addressInfo vb.)
//     cartId: String, // Bu alan misafirler için local sepete referans olabilir veya null
//     cartItems: [
//       {
//         productId: String,
//         title: String,
//         image: String,
//         price: String,
//         quantity: Number,
//       },
//     ],
//     addressInfo: {
//       // Teslimat adresi hem misafir hem de kayıtlı kullanıcı için kullanılır
//       // contactName alanı addressInfo içine alınabilir veya guestInfo.fullName kullanılır
//       fullName: String, // Siparişteki alıcı adı (guestInfo veya User modelinden gelebilir)
//       address: String,
//       city: String,
//       pincode: String,
//       phone: String,
//       notes: String,
//     },
//     orderStatus: String,
//     paymentMethod: String,
//     paymentStatus: String,
//     totalAmount: Number,
//     orderDate: Date,
//     orderUpdateDate: Date,
//     paymentId: String,
//     iyzicoConversationId: String,
//     iyzicoToken: String,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", OrderSchema);

// server/models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      // Giriş yapmış kullanıcı için User modeline referans
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Misafir siparişi değilse (isGuestOrder false veya tanımsızsa) userId zorunludur.
      // Misafir siparişi ise (isGuestOrder true ise) userId zorunlu değildir (null olabilir).
      required: function () {
        return !this.isGuestOrder;
      },
      index: true,
    },
    isGuestOrder: {
      // Bu sipariş bir misafire mi ait?
      type: Boolean,
      default: false,
      index: true,
    },
    guestInfo: {
      // Eğer isGuestOrder true ise, misafir bilgileri burada saklanır
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
    },
    cartId: String, // Misafirler için local sepet ID'si veya null
    cartItems: [
      {
        productId: String, // Veya mongoose.Schema.Types.ObjectId, ref: 'Product'
        title: String,
        image: String,
        price: String, // Veya Number
        quantity: Number,
      },
    ],
    addressInfo: {
      // Teslimat adresi hem misafir hem de kayıtlı kullanıcı için kullanılır
      fullName: String, // Siparişteki alıcı adı (guestInfo'dan veya User modelinden gelebilir)
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true }, // Bu, guestInfo.phone ile aynı olabilir veya ayrı girilebilir
      notes: String,
    },
    orderStatus: { type: String, required: true, default: "pending_payment" },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true, default: "pending" },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    orderUpdateDate: Date,
    paymentId: String,
    iyzicoConversationId: String,
    iyzicoToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
