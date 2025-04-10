// const Iyzipay = require("iyzipay");
// const iyzipay = require("../../helpers/iyzipay");
// const Order = require("../../models/Order");
// const Cart = require("../../models/Cart");
// const Product = require("../../models/Product");
// const User = require("../../models/User");
// const crypto = require("crypto");

// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       addressInfo, // Adres bilgileri burada olmalı (addressId, address, city, pincode, phone, notes?)
//       // totalAmount frontend'den geliyor mu? Yoksa backend'de mi hesaplanmalı? Güvenlik için backend'de hesaplamak daha iyi.
//       cartId, // Sepet ID'si geliyor mu?
//     } = req.body;

//     // Kontrol: cartItems dizi mi? (Bu kontrol zaten vardı, loglara göre dizi geliyor)
//     if (!Array.isArray(cartItems) || cartItems.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Sepet ürünleri geçersiz veya boş.",
//       });
//     }

//     // Kontrol: addressInfo var mı ve gerekli alanları içeriyor mu?
//     if (
//       !addressInfo ||
//       !addressInfo.address ||
//       !addressInfo.city ||
//       !addressInfo.pincode ||
//       !addressInfo.phone
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Adres bilgileri eksik veya geçersiz.",
//       });
//     }
//     console.log("Gelen cartItems:", JSON.stringify(cartItems, null, 2)); // Tam olarak ne geldiğini görün
//     if (!Array.isArray(cartItems)) {
//       // Dizi olup olmadığını kontrol edin
//       console.error(
//         "HATA: req.body.cartItems bir dizi değil veya undefined!",
//         cartItems
//       );
//       return res.status(400).json({
//         // İstemci hatası olduğu için 400 döndürün
//         success: false,
//         message: "Geçersiz sepet ürünleri alındı.",
//       });
//     }
//     // Kullanıcı bilgilerini ve toplam tutarı hesapla (Güvenlik için backend'de)
//     const user = await User.findById(userId); // Kullanıcıyı bul
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Kullanıcı bulunamadı." });
//     }

//     // Backend'de ürün ID'lerine göre fiyatları tekrar çekip toplam tutarı hesaplamak DAHA GÜVENLİDİR.
//     // Şimdilik frontend'den gelen cartItems'daki fiyatları kullanıyoruz ama bu güvensiz olabilir.
//     let calculatedTotal = 0;
//     const basketItemsForIyzico = cartItems.map((item) => {
//       // ÖNEMLİ: item.price'ın sayı olduğundan emin olun. Frontend'den string geliyorsa parseFloat kullanın.
//       const itemPrice =
//         typeof item.price === "string" ? parseFloat(item.price) : item.price;
//       calculatedTotal += itemPrice * item.quantity;
//       return {
//         id: item.productId, // Ürün ID'si
//         name: item.title, // Ürün Adı
//         category1: "Default Kategori", // Ürünün kategorisi (Veritabanından alınabilir)
//         itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL, // Veya VIRTUAL
//         price: itemPrice.toFixed(2), // Iyzico genellikle string formatında ve noktadan sonra 2 basamak bekler. Tekrar kontrol etmek gerekebilir.
//         // NOT: Iyzico tekil ürün fiyatını quantity ile çarpılmış istemez, kendisi hesaplar. price: tekil ürün fiyatı olmalı.
//       };
//     });
//     // Tekil fiyatlar gönderildiği için paidPrice'ı ayrıca hesaplamalıyız.
//     const paidPrice = calculatedTotal; // KDV vs. varsa burada eklenmeli.
//     const price = calculatedTotal; // Sepetin KDV'siz toplamı (eğer KDV varsa price farklı olur)

//     const conversationId = crypto.randomUUID(); // Benzersiz ID üret

//     // Iyzico için doğru formatta request objesi
//     const request = {
//       locale: Iyzipay.LOCALE.TR,
//       conversationId: conversationId,
//       price: price.toFixed(2), // Sepetin vergisiz toplam fiyatı (Number veya String, dokümana bakın)
//       paidPrice: paidPrice.toFixed(2), // Ödenecek toplam tutar (Number veya String, dokümana bakın)
//       currency: Iyzipay.CURRENCY.TRY,
//       basketId: cartId || `BASKET_${userId}_${Date.now()}`, // Varsa cartId yoksa üret
//       paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
//       callbackUrl: "http://localhost:5173/shop/iyzipay-return", // Başarılı/Başarısız dönüş URL'si
//       enabledInstallments: [2, 3, 6, 9], // İzin verilen taksit sayıları
//       buyer: {
//         id: userId,
//         name: user.userName.split(" ")[0] || "Ad", // Kullanıcı adından ayır veya varsayılan
//         surname: user.userName.split(" ")[1] || "Soyad", // Kullanıcı adından ayır veya varsayılan
//         gsmNumber: addressInfo.phone, // Adresten alınıyor, User modelinde varsa oradan alınabilir.
//         email: user.email,
//         identityNumber: "11111111111", // TC Kimlik No (Gerçek uygulamada alınmalı)
//         // lastLoginDate: "2015-10-05 12:43:35", // Opsiyonel
//         // registrationDate: "2013-04-21 15:12:09", // Opsiyonel
//         registrationAddress: addressInfo.address, // Adres
//         ip: req.ip || "127.0.0.1", // İstek IP'si
//         city: addressInfo.city, // Şehir
//         country: "Turkey", // Ülke
//         zipCode: addressInfo.pincode, // Posta Kodu
//       },
//       shippingAddress: {
//         contactName: user.userName, // Kullanıcı adı
//         city: addressInfo.city,
//         country: "Turkey",
//         address: addressInfo.address,
//         zipCode: addressInfo.pincode,
//       },
//       billingAddress: {
//         // Genellikle shipping ile aynı olur, farklıysa ayrı alınmalı.
//         contactName: user.userName,
//         city: addressInfo.city,
//         country: "Turkey",
//         address: addressInfo.address,
//         zipCode: addressInfo.pincode,
//       },
//       basketItems: basketItemsForIyzico, // Yukarıda map ile oluşturulan dizi
//     };

//     console.log("Iyzico'ya Giden Request:", JSON.stringify(request, null, 2)); // Göndermeden önce logla

//     // Ödeme formunu başlatma isteği (payment.create yerine)
//     iyzipay.checkoutFormInitialize.create(request, async (err, result) => {
//       if (err) {
//         console.error("Iyzico checkoutFormInitialize Hatası:", err);
//         return res.status(500).json({
//           success: false,
//           message: "Iyzico ödeme formu başlatılamadı.",
//           error: err,
//         });
//       }

//       console.log("Iyzico checkoutFormInitialize Sonucu:", result);

//       // Iyzico'dan başarılı yanıt geldi, durumu kontrol et
//       if (result.status === "success" && result.checkoutFormContent) {
//         // --- Siparişi Veritabanına Kaydetme ---
//         // ÖNEMLİ: Siparişi burada "pending" veya "iyzico_initialized" gibi bir statüde kaydedip,
//         // ödeme başarılı olduğunda (callbackUrl'e gelindiğinde ve ödeme kontrol edildiğinde)
//         // statüsünü güncellemek daha doğru bir akıştır.
//         // Şimdilik doğrudan kaydediyoruz ama ödeme tamamlanmazsa bu sipariş askıda kalır.

//         const newlyCreatedOrder = new Order({
//           userId,
//           cartId: request.basketId, // Iyzico'ya gönderilen basketId
//           cartItems, // Orijinal cartItems (fiyat vs. burada saklanabilir)
//           addressInfo, // addressInfo objesi
//           orderStatus: "pending", // Başlangıç durumu
//           paymentMethod: "iyzico",
//           paymentStatus: "pending", // Başlangıç durumu
//           totalAmount: paidPrice, // Hesaplanan toplam tutar
//           orderDate: new Date(),
//           iyzicoConversationId: conversationId, // Iyzico conversationId'yi sakla
//           iyzicoToken: result.token, // Iyzico token'ını sakla (Callback'te kontrol için)
//           // paymentId ve payerId ödeme tamamlanınca gelecek.
//         });

//         await newlyCreatedOrder.save();
//         // --- Sipariş Kaydetme Sonu ---

//         // Frontend'e Iyzico'nun checkout form içeriğini ve SİPARİŞ ID'sini gönder
//         res.status(200).json({
//           // 201 yerine 200 OK daha uygun olabilir form içeriği döndüğü için
//           success: true,
//           checkoutFormContent: result.checkoutFormContent, // Bu HTML içeriği frontend'de gösterilecek
//           orderId: newlyCreatedOrder._id, // Oluşturulan siparişin ID'si (callback'te lazım olabilir)
//         });
//       } else {
//         console.error("Iyzico checkoutFormInitialize Başarısız Sonuç:", result);
//         return res.status(500).json({
//           success: false,
//           message:
//             result.errorMessage ||
//             "Iyzico ödeme formu başlatılamadı (başarısız durum).",
//           errorCode: result.errorCode,
//         });
//       }
//     });
//   } catch (e) {
//     console.error("createOrder Genel Hata:", e); // Daha açıklayıcı log
//     res.status(500).json({
//       success: false,
//       message: "Sipariş oluşturulurken sunucu hatası oluştu.",
//     });
//   }
// };

// const capturePayment = async (req, res) => {
//   try {
//     const { paymentId, payerId, orderId } = req.body;

//     let order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order can not be found",
//       });
//     }

//     order.paymentStatus = "paid";
//     order.orderStatus = "confirmed";
//     order.paymentId = paymentId;
//     order.payerId = payerId;

//     for (let item of order.cartItems) {
//       let product = await Product.findById(item.productId);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Not enough stock for this product ${product.title}`,
//         });
//       }

//       product.totalStock -= item.quantity;
//       await product.save();
//     }

//     const getCartId = order.cartId;
//     await Cart.findByIdAndDelete(getCartId);

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order confirmed",
//       data: order,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const getAllOrdersByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const orders = await Order.find({ userId });

//     if (!orders.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No orders found!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const getOrderDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// module.exports = {
//   createOrder,
//   capturePayment,
//   getAllOrdersByUser,
//   getOrderDetails,
// };

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

    // --- Doğrulamalar (Kullanıcı, Adres vb.) ---
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

    // --- Sepet Ürünlerini Doğrula ve Toplamı Hesapla ---
    let calculatedTotal = 0;
    const basketItemsForIyzico = [];
    const orderCartItems = []; // DB'ye kaydedilecek ürünler

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
          price: itemTotalPrice.toFixed(2), // Ürünün toplam fiyatı (miktar * birim fiyat)
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
      // Henüz token veya paymentId yok
    });
    await pendingOrder.save(); // Siparişi kaydet

    // --- Iyzico checkoutFormInitialize İsteği Hazırla ---
    // !! Callback URL'i backend'deki yeni endpoint'e ayarlıyoruz !!
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
        email: user.email,
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
        // Genellikle shipping ile aynı
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
        // Sipariş oluşturuldu ama Iyzico başlatılamadı, belki siparişi iptal et?
        // Veya kullanıcıya hata gösterip tekrar denemesini sağla
        return res.status(500).json({
          success: false,
          message: "Iyzico ödeme formu başlatılamadı.",
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
            "Iyzico ödeme formu başlatılamadı (başarısız durum).",
          errorCode: result.errorCode,
        });
      }
    });
  } catch (e) {
    console.error("createOrder Genel Hata:", e);
    res.status(500).json({
      success: false,
      message: "Sipariş oluşturulurken sunucu hatası oluştu.",
    });
  }
};

// YENİ Callback İşleyici Fonksiyon
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
          console.error(
            `Iyzico checkoutForm.retrieve Hatası (Order ID: ${orderId}):`,
            err
          );
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

        // Ödeme sonucunu işle
        if (
          result.status === "success" &&
          (result.paymentStatus === "SUCCESS" ||
            result.paymentStatus === "success")
        ) {
          // Ödeme Başarılı

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

          // Stok Güncelle & Sepeti Sil (Hata yönetimi eklenebilir)
          try {
            for (let item of order.cartItems) {
              await Product.findByIdAndUpdate(item.productId, {
                $inc: { totalStock: -item.quantity },
              });
            }
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

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
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
