// require("dotenv").config();
// const Iyzipay = require("iyzipay");

// const iyzipay = new Iyzipay({
//   apiKey: process.env.IYZIPAY_API_KEY,
//   secretKey: process.env.IYZIPAY_SECRET_KEY,
//   uri: process.env.IYZIPAY_BASE_URL,
// });

// const createCheckoutForm = async (orderDetails) => {
//   const checkoutFormRequest = {
//     locale: Iyzipay.LOCALE.TR,
//     conversationId: orderDetails._id ? String(orderDetails._id) : "123456789",
//     price: orderDetails.totalAmount.toFixed(2),
//     paidPrice: orderDetails.totalAmount.toFixed(2),
//     currency: Iyzipay.CURRENCY.TRY,
//     basketId: orderDetails.cartId || "BASKET_ID",
//     paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
//     callbackUrl: "http://localhost:5173/shop/iyzipay-return",
//     buyer: {
//       id: orderDetails.userId ? String(orderDetails.userId) : "123",
//       name: orderDetails.addressInfo?.name || "İsim Yok",
//       surname: orderDetails.addressInfo?.surname || "Soyisim Yok",
//       gsmNumber: orderDetails.addressInfo?.phone || "+905350000000",
//       email: orderDetails.addressInfo?.email || "email@yok.com",
//       identityNumber: orderDetails.addressInfo?.identityNumber || "00000000000",
//       lastLoginDate: new Date().toISOString(),
//       registrationDate: new Date().toISOString(),
//       ip: orderDetails.ip || "85.34.78.112",
//       registrationAddress: orderDetails.addressInfo?.address || "Adres Yok",
//       city: orderDetails.addressInfo?.city || "Şehir Yok",
//       country: orderDetails.addressInfo?.country || "Ülke Yok",
//       zipCode: orderDetails.addressInfo?.zipCode || "00000",
//     },
//     shippingAddress: {
//       contactName: orderDetails.addressInfo?.name || "İsim Yok",
//       city: orderDetails.addressInfo?.city || "Şehir Yok",
//       country: orderDetails.addressInfo?.country || "Ülke Yok",
//       address: orderDetails.addressInfo?.address || "Adres Yok",
//       zipCode: orderDetails.addressInfo?.zipCode || "00000",
//     },
//     billingAddress: {
//       contactName: orderDetails.addressInfo?.name || "İsim Yok",
//       city: orderDetails.addressInfo?.city || "Şehir Yok",
//       country: orderDetails.addressInfo?.country || "Ülke Yok",
//       address: orderDetails.addressInfo?.address || "Adres Yok",
//       zipCode: orderDetails.addressInfo?.zipCode || "00000",
//     },
//     basketItems: orderDetails.cartItems.map((item) => ({
//       id: item.productId,
//       name: item.title,
//       category1: item.category || "Ürün",
//       itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
//       price: item.price.toFixed(2),
//     })),
//   };

//   return new Promise((resolve, reject) => {
//     iyzipay.checkoutFormInitialize.create(checkoutFormRequest, (err, res) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(res);
//       }
//     });
//   });
// };

// module.exports = {
//   iyzipay,
//   createCheckoutForm,
// };
require("dotenv").config();
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_BASE_URL,
});

module.exports = iyzipay;
