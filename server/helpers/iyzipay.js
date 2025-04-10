const Iyzipay = require("iyzipay");
require("dotenv").config();

// İyzico API anahtarlarını .env dosyasından al
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.Iyzipay_BASE_URL,
});

// İyzico Checkout Formu oluşturmak için bir fonksiyon
const createCheckoutForm = async (orderDetails) => {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(
      {
        locale: Iyzipay.LOCALE.TR,
        conversationId: orderDetails.conversationId || "123456789",
        price: orderDetails.price, // Ödeme tutarı
        paidPrice: orderDetails.paidPrice, // Gerçek ödeme tutarı
        currency: Iyzipay.CURRENCY.TRY, // Para birimi
        basketId: orderDetails.basketId, // Sepet ID'si
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT, // Ürün grubu
        callbackUrl: orderDetails.callbackUrl, // Ödeme sonrası yönlendirilecek URL
        buyer: orderDetails.buyer, // Müşteri bilgileri
        shippingAddress: orderDetails.shippingAddress, // Teslimat adresi
        billingAddress: orderDetails.billingAddress, // Fatura adresi
        basketItems: orderDetails.basketItems, // Sepet ürünleri
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

// Dışa aktarma
module.exports = {
  iyzipay,
  createCheckoutForm,
};
