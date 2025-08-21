const iyzipay = require("../../helpers/iyzipay");
const DirectPayment = require("../../models/DirectPayment");
const crypto = require("crypto");

// Ödeme işlemini başlatır
exports.initiatePayment = async (req, res) => {
  try {
    const { amount, customerNote } = req.body;
    const adminId = req.user.id;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Geçerli bir tutar giriniz." });
    }

    const conversationId = crypto.randomUUID();
    const paymentAmount = parseFloat(amount).toFixed(2);

    // Ödemeyi veritabanına "pending" olarak kaydet
    const directPayment = new DirectPayment({
      adminId,
      amount: paymentAmount,
      iyzicoConversationId: conversationId,
      customerNote,
    });
    await directPayment.save();

    const backendCallbackUrl = `${process.env.SERVER_BASE_URL}/api/admin/direct-payment/callback`;

    // Iyzico için sabit (statik) bilgiler
    const request = {
      locale: "tr",
      conversationId: conversationId,
      price: paymentAmount,
      paidPrice: paymentAmount,
      currency: "TRY",
      basketId: directPayment._id.toString(), 
      paymentGroup: "PRODUCT",
      callbackUrl: backendCallbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9, 12],
      buyer: {
        id: "DP-001",
        name: "Alışverişsiz",
        surname: "Ödeme",
        gsmNumber: "+905555555555",
        email: "siparis@deposun.com",
        identityNumber: "11111111111",
        registrationAddress: "Fevziçakmak, 10777 Sk. No:1AC, 42250 Karatay/Konya",
        ip: req.ip || "127.0.0.1",
        city: "Konya",
        country: "Turkey",
        zipCode: "42250",
      },
      shippingAddress: {
        contactName: "Deposun E-Ticaret",
        city: "Konya",
        country: "Turkey",
        address: "Fevziçakmak, 10777 Sk. No:1AC, 42250 Karatay/Konya",
        zipCode: "42250",
      },
      billingAddress: {
        contactName: "Deposun E-Ticaret",
        city: "Konya",
        country: "Turkey",
        address: "Fevziçakmak, 10777 Sk. No:1AC, 42250 Karatay/Konya",
        zipCode: "42250",
      },
      basketItems: [
        {
          id: "DP-ITEM-01",
          name: "Alışverişsiz Ödeme",
          category1: "Hizmet Bedeli",
          itemType: "VIRTUAL",
          price: paymentAmount,
        },
      ],
    };

    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err || result.status === 'failure') {
        console.error("Iyzico Hatası:", err || result.errorMessage);
        return res.status(500).json({ success: false, message: "Ödeme başlatılamadı." });
      }
      // checkoutFormContent'i döndür (embed için)
      res.status(200).json({ success: true, checkoutFormContent: result.checkoutFormContent });
    });

  } catch (error) {
    console.error("Alışverişsiz Ödeme Hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Iyzico'dan gelen sonucu işler
exports.handleCallback = async (req, res) => {
  const { token } = req.body;
  const clientRedirectBase = `${process.env.CLIENT_BASE_URL}/admin/payment-status`;

  if (!token) {
    return res.redirect(`${clientRedirectBase}?status=error&message=TokenNotFound`);
  }

  iyzipay.checkoutForm.retrieve({ locale: "tr", token }, async (err, result) => {
    const paymentRecordId = result?.basketId;

    if (err || result.status === 'failure') {
      if (paymentRecordId) {
        await DirectPayment.findByIdAndUpdate(paymentRecordId, { status: "failed" });
      }
      return res.redirect(`${clientRedirectBase}?status=failed&id=${paymentRecordId || ''}&message=${result?.errorMessage || 'UnknownError'}`);
    }

    if (result.paymentStatus === 'SUCCESS') {
      await DirectPayment.findByIdAndUpdate(paymentRecordId, {
        status: "paid",
        paymentId: result.paymentId,
      });
      return res.redirect(`${clientRedirectBase}?status=success&id=${paymentRecordId}`);
    } else {
      await DirectPayment.findByIdAndUpdate(paymentRecordId, { status: "failed" });
      return res.redirect(`${clientRedirectBase}?status=failed&id=${paymentRecordId}`);
    }
  });
};
exports.getPaymentHistory = async (req, res) => {
 try {
   const payments = await DirectPayment.find({})
     .populate("adminId", "userName")
     .sort({ createdAt: -1 })
     .limit(50);
   res.status(200).json({ success: true, data: payments });
 } catch (error) {
   console.error("Ödeme geçmişi alınırken hata:", error);
   res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
 }
};