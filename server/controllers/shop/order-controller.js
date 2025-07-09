const Iyzipay = require("iyzipay");
const iyzipay = require("../../helpers/iyzipay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const User = require("../../models/User");
const crypto = require("crypto");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItems, addressInfo, cartId } = req.body;

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

        basketItemsForIyzico.push({
          id: product._id.toString(),
          name: product.title,
          category1: product.category || "Default Kategori",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: itemTotalPrice.toFixed(2),
        });

        orderCartItems.push({
          productId: product._id.toString(),
          title: product.title,
          image: product.image,
          price: price.toString(), // Birim fiyatı
          quantity: item.quantity,
        });
      } else {
       // console.warn(`Checkout sırasında ürün bulunamadı: ${item.productId}`);
      }
    }

    if (orderCartItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Sepette geçerli ürün bulunamadı." });
    }

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
    const backendCallbackUrl = `${process.env.SERVER_BASE_URL}/api/shop/order/iyzico-callback`;

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: conversationId,
      price: calculatedTotal.toFixed(2),
      paidPrice: calculatedTotal.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: pendingOrder._id.toString(),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: backendCallbackUrl,
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: userId,
        name: user.userName.split(" ")[0] || "Ad",
        surname: user.userName.split(" ")[1] || "Soyad",
        gsmNumber: addressInfo.phone || "+905000000000",
        email: user.email || "muhasebe@rmrenerji.com",
        identityNumber: "11111111111",
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

    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) {
       // console.error("Iyzico checkoutFormInitialize Hatası:", err);
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
        pendingOrder.iyzicoToken = result.token;
        pendingOrder.save();

       // console.log("Iyzico paymentPageUrl:", result.paymentPageUrl);

        res.status(200).json({
          success: true,
          paymentPageUrl: result.paymentPageUrl,
          checkoutFormContent: result.checkoutFormContent,
          orderId: pendingOrder._id,
        });
      } else {
       // console.error("Iyzico checkoutFormInitialize Başarısız Sonuç:", result);
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
   // console.error(" Genel Hata:", e);
    res.status(500).json({
      success: false,
      message: "Sipariş oluşturulurken sunucu hatası oluştu.",
    });
  }
};

const handleIyzicoCallback = async (req, res) => {
 // console.log("Iyzico Callback Geldi. Body:", req.body);
  const { token, status: iyzicoStatus } = req.body;

  if (!token) {
   // console.error("Iyzico callback - Token eksik.");
    return res.redirect(
      `${process.env.CLIENT_BASE_URL}/shop/payment-failure?status=error&message=InvalidCallback`
    );
  }

  iyzipay.checkoutForm.retrieve(
    {
      locale: Iyzipay.LOCALE.TR,
      token: token,
    },
    async (err, result) => {
      let orderId = null;
      let redirectUrl = `${process.env.CLIENT_BASE_URL}/shop/payment-failure?status=error&message=UnknownError`;

      try {
        const order = await Order.findOne({ iyzicoToken: token });
        if (order) {
          orderId = order._id.toString();
        } else {
        //  console.error(
        //    `Iyzico callback - Token (${token}) ile eşleşen sipariş bulunamadı.`
       //   );
          redirectUrl = `${process.env.CLIENT_BASE_URL}/shop/payment-failure?status=error&message=OrderNotFoundForToken`;
          return res.redirect(redirectUrl);
        }

        if (err) {
         // console.error(`Iyzico Hatası (Order ID: ${orderId}):`, err);
          await Order.findByIdAndUpdate(orderId, {
            orderStatus: "failed",
            paymentStatus: "callback_error",
            orderUpdateDate: new Date(),
          });
          redirectUrl = `${process.env.CLIENT_BASE_URL}/shop/payment-failure?status=retrieval_error&orderId=${orderId}`;
          return res.redirect(redirectUrl);
        }

        //console.log(
        //  `Iyzico checkoutForm.retrieve Sonucu (Order ID: ${orderId}):`,
        //  result
        //);

        if (
          result.status === "success" &&
          (result.paymentStatus === "SUCCESS" ||
            result.paymentStatus === "success")
        ) {
          if (
            order.orderStatus === "confirmed" ||
            order.orderStatus === "paid"
          ) {
           // console.log(
           //   `Sipariş zaten işlenmiş (Callback - Order ID: ${orderId})`
           // );
            redirectUrl = `${process.env.CLIENT_BASE_URL}/shop/payment-success?status=already_processed&orderId=${orderId}`;
            return res.redirect(redirectUrl);
          }

          // STOK YENİDEN KONTROLÜ
          for (const item of order.cartItems) {
            const product = await Product.findById(item.productId);
            if (!product || product.totalStock < item.quantity) {
             // console.error(
             //   `Stok yetersiz! OrderID: ${orderId}, ProductID: ${item.productId}`
             // );
              order.orderStatus = "failed";
              order.paymentStatus = "stock_error"; // Yeni bir durum
              await order.save();
              redirectUrl = `${process.env.CLIENT_BASE_URL}/shop/payment-failure?status=stock_error&orderId=${orderId}`;
              return res.redirect(redirectUrl);
            }
          }

          order.orderStatus = "confirmed";
          order.paymentStatus = "paid";
          order.paymentId = result.paymentId;
          order.orderUpdateDate = new Date();

          try {
            const productUpdatePromises = [];
            for (let item of order.cartItems) {
              await Product.findByIdAndUpdate(item.productId, {
                $inc: { totalStock: -item.quantity, salesCount: item.quantity },
              });
            }
            await Promise.all(productUpdatePromises);
           // console.log(
           //   `Stok ve satış sayıları güncellendi (Order ID: ${orderId})`
           // );
            if (order.cartId) {
              await Cart.findByIdAndDelete(order.cartId);
            }
          } catch (updateError) {
           // console.error(
           //   `Stok/Sepet güncelleme hatası (Callback - Order ID: ${orderId}):`,
           //   updateError
           // );
          }

          await order.save();
         // console.log(
         //   `Iyzico callback - Ödeme başarılı, sipariş güncellendi (Order ID: ${orderId})`
         // );
          redirectUrl = `${process.env.CLIENT_BASE_URL}/shop/payment-success?status=success&orderId=${orderId}`;
          return res.redirect(redirectUrl);
        } else {
         // console.warn(
         //   `Iyzico callback - Ödeme başarısız (Order ID: ${orderId}). Result:`,
         //   result
         // );
          await Order.findByIdAndUpdate(orderId, {
            orderStatus: "failed",
            paymentStatus: "failed",
            orderUpdateDate: new Date(),
          });
          redirectUrl = `${
            process.env.CLIENT_BASE_URL
          }/shop/payment-failure?status=failed&orderId=${orderId}&errorCode=${
            result.errorCode || "N/A"
          }`;
          return res.redirect(redirectUrl);
        }
      } catch (generalError) {
       // console.error(
       //   `Iyzico callback - Genel Hata (Token: ${token}, Order ID: ${orderId}):`,
       //   generalError
       // );
        redirectUrl = `${
          process.env.CLIENT_BASE_URL
        }/shop/payment-failure?status=server_error${
          orderId ? "&orderId=" + orderId : ""
        }`;
        return res.redirect(redirectUrl);
      }
    }
  );
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({
      userId,
      paymentStatus: "paid",
    }).sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
   // console.error("getAllOrdersByUser error:", e);
    res.status(500).json({
      success: false,
      message: "Siparişler alınırken bir hata oluştu!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Ürün ID formatı." });
    }
    // const order = await Order.findById(id);
    const order = await Order.findById(id).select(
      "-iyzicoToken -iyzicoConversationId -paymentId"
    );

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
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const createGuestOrder = async (req, res) => {
  try {
    const { guestInfo, cartItems } = req.body;

    if (
      !guestInfo ||
      !guestInfo.email ||
      !guestInfo.fullName ||
      !guestInfo.address ||
      !guestInfo.city ||
      !guestInfo.pincode ||
      !guestInfo.phone
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Misafir bilgileri ve adres eksik." });
    }
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Sepet ürünleri geçersiz." });
    }

    let calculatedTotal = 0;
    const basketItemsForIyzico = [];
    const orderCartItemsDetails = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        if (item.quantity > product.totalStock) {
          return res.status(400).json({
            success: false,
            message: `Stokta yeterli ürün bulunmamaktadır: ${product.title}. Maksimum ${product.totalStock} adet eklenebilir.`,
            isStockError: true,
            productId: product._id,
            availableStock: product.totalStock,
          });
        }
        const price = product.salePrice > 0 ? product.salePrice : product.price;
        const itemTotalPrice = price * item.quantity;
        calculatedTotal += itemTotalPrice;

        basketItemsForIyzico.push({
          id: product._id.toString(),
          name: product.title,
          category1: product.category?.toString() || "Default Kategori",
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price: itemTotalPrice.toFixed(2),
        });

        orderCartItemsDetails.push({
          productId: product._id.toString(),
          title: product.title,
          image: product.image,
          price: price.toString(),
          quantity: item.quantity,
        });
      } else {
       // console.warn(`Misafir siparişi: Ürün bulunamadı ID: ${item.productId}`);
        return res.status(404).json({
          success: false,
          message: `Ürün bulunamadı: ID ${item.productId}`,
        });
      }
    }

    if (orderCartItemsDetails.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Sepette geçerli ürün bulunamadı." });
    }

    const conversationId = crypto.randomUUID();

    const pendingOrder = new Order({
      isGuestOrder: true,
      guestInfo: {
        fullName: guestInfo.fullName,
        email: guestInfo.email,
        phone: guestInfo.phone,
      },
      cartItems: orderCartItemsDetails,
      addressInfo: {
        fullName: guestInfo.fullName,
        address: guestInfo.address,
        city: guestInfo.city,
        pincode: guestInfo.pincode,
        phone: guestInfo.phone,
        notes: guestInfo.notes,
      },
      orderStatus: "pending_payment",
      paymentMethod: "iyzico",
      paymentStatus: "pending",
      totalAmount: calculatedTotal,
      orderDate: new Date(),
      iyzicoConversationId: conversationId,
    });
    await pendingOrder.save();

    const backendCallbackUrl = `${
      process.env.SERVER_BASE_URL || "http://localhost:5000"
    }/api/shop/order/iyzico-callback`;

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: conversationId,
      price: calculatedTotal.toFixed(2),
      paidPrice: calculatedTotal.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: pendingOrder._id.toString(),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: backendCallbackUrl,
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: guestInfo.email.replace(/[^a-zA-Z0-9]/g, "") + Date.now(),
        name: guestInfo.fullName.split(" ")[0] || "Ad",
        surname: guestInfo.fullName.split(" ").slice(1).join(" ") || "Soyad",
        gsmNumber: guestInfo.phone,
        email: guestInfo.email,
        identityNumber: "11111111111",
        registrationAddress: guestInfo.address,
        ip: req.ip || "127.0.0.1",
        city: guestInfo.city,
        country: "Turkey",
        zipCode: guestInfo.pincode,
      },
      shippingAddress: {
        contactName: guestInfo.fullName,
        city: guestInfo.city,
        country: "Turkey",
        address: guestInfo.address,
        zipCode: guestInfo.pincode,
      },
      billingAddress: {
        contactName: guestInfo.fullName,
        city: guestInfo.city,
        country: "Turkey",
        address: guestInfo.address,
        zipCode: guestInfo.pincode,
      },
      basketItems: basketItemsForIyzico,
    };

    iyzipay.checkoutFormInitialize.create(request, async (err, result) => {
      if (err) {
       // console.error("Iyzico checkoutFormInitialize Hatası (Guest):", err);
        await Order.findByIdAndDelete(pendingOrder._id);
        return res.status(500).json({
          success: false,
          message: "Iyzico ödeme başlatılamadı (Guest).",
          error: err,
        });
      }

      if (
        result.status === "success" &&
        (result.paymentPageUrl || result.checkoutFormContent)
      ) {
        pendingOrder.iyzicoToken = result.token;
        await pendingOrder.save();

        res.status(200).json({
          success: true,
          paymentPageUrl: result.paymentPageUrl,
          checkoutFormContent: result.checkoutFormContent,
          orderId: pendingOrder._id,
        });
      } else {
       // console.error(
       //   "Iyzico checkoutFormInitialize Başarısız Sonuç (Guest):",
       //   result
       // );
        await Order.findByIdAndDelete(pendingOrder._id);
        return res.status(500).json({
          success: false,
          message:
            result.errorMessage ||
            "Iyzico ödeme başlatılamadı (başarısız durum - Guest).",
          errorCode: result.errorCode,
        });
      }
    });
  } catch (error) {
   // console.error("Misafir siparişi oluşturma genel hata:", error);
    res.status(500).json({
      success: false,
      message: "Misafir siparişi oluşturulurken sunucu hatası oluştu.",
      error: error.message,
    });
  }
};

const trackGuestOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Ürün ID formatı." });
    }
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Sipariş Kodunu Geçersiz.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Sipariş Kodu formatı." });
    }

    const order = await Order.findOne({
      _id: orderId,
      isGuestOrder: true,
    }).select(
      "_id orderDate orderStatus totalAmount paymentStatus guestInfo.fullName isGuestOrder"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Sipariş bulunamadı",
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
   // console.error("Misafir sipariş takip hatası:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Sipariş Kodu formatı." });
    }
    res.status(500).json({
      success: false,
      message: "Sipariş sorgulanırken bir sunucu hatası oluştu.",
    });
  }
};

module.exports = {
  createOrder,
  handleIyzicoCallback,
  getAllOrdersByUser,
  getOrderDetails,
  createGuestOrder,
  trackGuestOrder,
};
