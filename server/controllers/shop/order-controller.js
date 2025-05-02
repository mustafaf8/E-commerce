const Iyzipay = require("iyzipay");
const iyzipay = require("../../helpers/iyzipay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
    const { userId, cartItems, addressInfo, cartId } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Kullanıcı bulunamadı." });
    if (!addressInfo || !addressInfo.address || !addressInfo.city)
      return res
        .status(400)
        .json({ success: false, message: "Adres bilgileri eksik." });
    if (!Array.isArray(cartItems) || cartItems.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Sepet ürünleri geçersiz." });

    let calculatedTotal = 0;
    const basketItemsForIyzico = [];
    const orderCartItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        const price = product.salePrice > 0 ? product.salePrice : product.price;
        const itemTotalPrice = price * item.quantity;
        calculatedTotal += itemTotalPrice;

        // Iyzico için formatla
        basketItemsForIyzico.push({
          id: product._id.toString(),
          name: product.title,
          category1: product.category || "Default Kategori",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: itemTotalPrice.toFixed(2),
        });

        // Sipariş modeli için formatla
        orderCartItems.push({
          productId: product._id.toString(),
          title: product.title,
          image: product.image,
          price: price.toString(), // Birim fiyatı
          quantity: item.quantity,
        });
      } else {
        console.warn(`Checkout sırasında ürün bulunamadı: ${item.productId}`);
        // Opsiyonel: Hata döndür veya ürünü atla
      }
    }

    if (orderCartItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Sepette geçerli ürün bulunamadı." });
    }

    // --- Bekleyen Siparişi DB'ye Kaydet ---
    const conversationId = crypto.randomUUID();
    const pendingOrder = new Order({
      userId,
      cartId: cartId,
      cartItems: orderCartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod: "iyzico",
      paymentStatus: "pending",
      totalAmount: calculatedTotal,
      orderDate: new Date(),
      iyzicoConversationId: conversationId,
    });
    await pendingOrder.save();
    const backendCallbackUrl = `http://localhost:5000/api/shop/order/iyzico-callback`; // Kendi backend adresin

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: conversationId,
      price: calculatedTotal.toFixed(2), // Sepetin toplam fiyatı
      paidPrice: calculatedTotal.toFixed(2), // Ödenecek fiyat
      currency: Iyzipay.CURRENCY.TRY,
      basketId: pendingOrder._id.toString(), // DB'deki sipariş ID'sini kullanabiliriz
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: backendCallbackUrl, // <<< DİKKAT: Backend Callback URL'i
      enabledInstallments: [2, 3, 6, 9], // İzin verilen taksitler
      buyer: {
        id: userId,
        name: user.userName.split(" ")[0] || "Ad",
        surname: user.userName.split(" ")[1] || "Soyad",
        gsmNumber: addressInfo.phone || "+905000000000",
        email: user.email || "muhasebe@rmrenerji.com",
        identityNumber: "11111111111", // Gerçek TC alınmalı
        registrationAddress: addressInfo.address,
        ip: req.ip || "127.0.0.1",
        city: addressInfo.city,
        country: "Turkey",
        zipCode: addressInfo.pincode,
      },
      shippingAddress: {
        contactName: user.userName,
        city: addressInfo.city,
        country: "Turkey",
        address: addressInfo.address,
        zipCode: addressInfo.pincode,
      },
      billingAddress: {
        contactName: user.userName,
        city: addressInfo.city,
        country: "Turkey",
        address: addressInfo.address,
        zipCode: addressInfo.pincode,
      },
      basketItems: basketItemsForIyzico,
    };

    // --- Iyzico API Çağrısı ---
    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) {
        console.error("Iyzico checkoutFormInitialize Hatası:", err);
        return res.status(500).json({
          success: false,
          message: "Iyzico ödeme başlatılamadı.",
          error: err,
        });
      }

      if (
        result.status === "success" &&
        (result.paymentPageUrl || result.checkoutFormContent)
      ) {
        // Siparişe Iyzico token'ını kaydet (callback'te doğrulamak için)
        pendingOrder.iyzicoToken = result.token;
        pendingOrder.save(); // Token'ı güncelle

        console.log("Iyzico paymentPageUrl:", result.paymentPageUrl);

        // Frontend'e ödeme URL'sini veya formu gönder
        res.status(200).json({
          success: true,
          paymentPageUrl: result.paymentPageUrl, // Tercihen bu
          checkoutFormContent: result.checkoutFormContent, // Alternatif
          orderId: pendingOrder._id, // Frontend'in bilmesi gerekebilir
        });
      } else {
        console.error("Iyzico checkoutFormInitialize Başarısız Sonuç:", result);
        return res.status(500).json({
          success: false,
          message:
            result.errorMessage ||
            "Iyzico ödeme başlatılamadı (başarısız durum).",
          errorCode: result.errorCode,
        });
      }
    });
  } catch (e) {
    console.error(" Genel Hata:", e);
    res.status(500).json({
      success: false,
      message: "Sipariş oluşturulurken sunucu hatası oluştu.",
    });
  }
};

const handleIyzicoCallback = async (req, res) => {
  console.log("Iyzico Callback Geldi. Body:", req.body);
  const { token, status: iyzicoStatus } = req.body; // Iyzico'dan gelen token

  if (!token) {
    console.error("Iyzico callback - Token eksik.");
    // Kullanıcıyı bir hata sayfasına yönlendir
    return res.redirect(
      `http://localhost:5173/shop/payment-failure?status=error&message=InvalidCallback`
    );
  }

  // Iyzico'dan ödeme detaylarını al
  iyzipay.checkoutForm.retrieve(
    {
      locale: Iyzipay.LOCALE.TR,
      token: token,
    },
    async (err, result) => {
      let orderId = null; // Yönlendirme için Order ID'yi bulmaya çalışacağız
      let redirectUrl = `http://localhost:5173/shop/payment-failure?status=error&message=UnknownError`; // Varsayılan hata URL'i

      try {
        // Token ile siparişi bul (createOrder'da kaydettiğimiz token ile eşleşmeli)
        const order = await Order.findOne({ iyzicoToken: token });
        if (order) {
          orderId = order._id.toString(); // Yönlendirme için ID'yi al
        } else {
          console.error(
            `Iyzico callback - Token (${token}) ile eşleşen sipariş bulunamadı.`
          );
          // Yine de bir hata sayfasına yönlendir, belki genel bir hata mesajıyla
          redirectUrl = `http://localhost:5173/shop/payment-failure?status=error&message=OrderNotFoundForToken`;
          return res.redirect(redirectUrl);
        }

        if (err) {
          console.error(`Iyzico Hatası (Order ID: ${orderId}):`, err);
          await Order.findByIdAndUpdate(orderId, {
            orderStatus: "failed",
            paymentStatus: "callback_error",
            orderUpdateDate: new Date(),
          });
          redirectUrl = `http://localhost:5173/shop/payment-failure?status=retrieval_error&orderId=${orderId}`;
          return res.redirect(redirectUrl);
        }

        console.log(
          `Iyzico checkoutForm.retrieve Sonucu (Order ID: ${orderId}):`,
          result
        );

        if (
          result.status === "success" &&
          (result.paymentStatus === "SUCCESS" ||
            result.paymentStatus === "success")
        ) {
          // Sipariş zaten işlenmiş mi tekrar kontrol et (güvenlik için)
          if (
            order.orderStatus === "confirmed" ||
            order.orderStatus === "paid"
          ) {
            console.log(
              `Sipariş zaten işlenmiş (Callback - Order ID: ${orderId})`
            );
            redirectUrl = `http://localhost:5173/shop/payment-success?status=already_processed&orderId=${orderId}`;
            return res.redirect(redirectUrl);
          }

          order.orderStatus = "confirmed";
          order.paymentStatus = "paid";
          order.paymentId = result.paymentId; // Iyzico'dan gelen ID
          order.orderUpdateDate = new Date();

          try {
            const productUpdatePromises = [];
            for (let item of order.cartItems) {
              await Product.findByIdAndUpdate(item.productId, {
                $inc: { totalStock: -item.quantity, salesCount: item.quantity },
              });
            }
            // Tüm ürün güncellemelerinin bitmesini bekle (paralel çalıştır)
            await Promise.all(productUpdatePromises);
            console.log(
              `Stok ve satış sayıları güncellendi (Order ID: ${orderId})`
            );
            if (order.cartId) {
              await Cart.findByIdAndDelete(order.cartId);
            }
          } catch (updateError) {
            console.error(
              `Stok/Sepet güncelleme hatası (Callback - Order ID: ${orderId}):`,
              updateError
            );
            // Bu durumda sipariş başarılı ama sonrası adımlarda hata oldu. Belki status'u farklı yapmalı?
          }

          await order.save();
          console.log(
            `Iyzico callback - Ödeme başarılı, sipariş güncellendi (Order ID: ${orderId})`
          );
          redirectUrl = `http://localhost:5173/shop/payment-success?status=success&orderId=${orderId}`;
          return res.redirect(redirectUrl);
        } else {
          // Ödeme Başarısız
          console.warn(
            `Iyzico callback - Ödeme başarısız (Order ID: ${orderId}). Result:`,
            result
          );
          await Order.findByIdAndUpdate(orderId, {
            orderStatus: "failed",
            paymentStatus: "failed",
            orderUpdateDate: new Date(),
          });
          redirectUrl = `http://localhost:5173/shop/payment-failure?status=failed&orderId=${orderId}&errorCode=${
            result.errorCode || "N/A"
          }`;
          return res.redirect(redirectUrl);
        }
      } catch (generalError) {
        console.error(
          `Iyzico callback - Genel Hata (Token: ${token}, Order ID: ${orderId}):`,
          generalError
        );
        // Genel bir hata durumunda bile kullanıcıyı bilgilendir
        redirectUrl = `http://localhost:5173/shop/payment-failure?status=server_error${
          orderId ? "&orderId=" + orderId : ""
        }`;
        return res.redirect(redirectUrl);
      }
    }
  );
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Doğrudan paymentStatus'u 'paid' olanları filtrele
    const orders = await Order.find({
      userId,
      paymentStatus: "paid", // <<< Sadece 'paid' olanları getir
    }).sort({ orderDate: -1 }); // En yeniden eskiye sırala

    res.status(200).json({
      success: true,
      data: orders, // Boş olsa bile başarıyla döndür
    });
  } catch (e) {
    console.error("getAllOrdersByUser error:", e);
    res.status(500).json({
      success: false,
      message: "Siparişler alınırken bir hata oluştu!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  handleIyzicoCallback,
  getAllOrdersByUser,
  getOrderDetails,
};
