require("dotenv").config(); // Ortam değişkenlerini yükle

// Gerekli kütüphaneleri import et
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session"); // express-session
const passport = require("passport"); // passport
const admin = require("firebase-admin");

// --- YENİ: Firebase Admin SDK Başlatma ---
try {
  // Servis hesabı anahtar dosyasının doğru yolunu belirttiğinizden emin olun
  const serviceAccount = require("./config/firebase-service-account.json"); // <-- DOSYA YOLUNU KONTROL EDİN

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK başarıyla başlatıldı.");
} catch (error) {
  console.error("Firebase Admin SDK başlatılamadı:", error);
  // Başlatma hatası kritikse uygulamayı durdurmak iyi bir pratik olabilir
  // process.exit(1);
}

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonPromoCardRouter = require("./routes/common/promo-card-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const shopWishlistRouter = require("./routes/shop/wishlist-routes");
const commonSideBannerRouter = require("./routes/common/side-banner-routes");

// Passport yapılandırmasını (strateji, serialize, deserialize) yükle
// Bu satırın, auth-controller.js dosyasındaki passport ile ilgili kodları çalıştırması gerekir.
require("./controllers/auth/auth-controller");

// MongoDB bağlantısını kur
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error)); // Hata logunu iyileştir

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware Tanımlamaları (DOĞRU SIRAYLA) ---

// 1. CORS Middleware
app.use(
  cors({
    // Geliştirme ortamı için localhost'a izin ver, production için .env'deki CLIENT_URL'e
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

// 2. Cookie Parser
app.use(cookieParser());

// 3. JSON ve URL Encoded Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Express Session Middleware (Passport'tan ÖNCE!)
//    SESSION_SECRET'ı .env dosyanızda tanımladığınızdan emin olun!
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "cok_guclu_bir_varsayilan_secret_kullanin_env_yoksa", // Güçlü bir secret kullanın
    resave: false, // Gereksiz tekrar kaydetmeyi önle
    saveUninitialized: false, // Boş session kaydetmeyi önle
    cookie: {
      secure: process.env.NODE_ENV === "production", // Production'da true (HTTPS gerekli)
      httpOnly: true, // JavaScript'ten erişimi engelle (Güvenlik)
      maxAge: 1000 * 60 * 60 * 24, // Örnek: Cookie 1 gün geçerli
      sameSite: "Lax", // CSRF korumasına yardımcı olur
    },
  })
);

// 5. Passport Initialize Middleware (Session'dan SONRA)
app.use(passport.initialize());

// 6. Passport Session Middleware (Initialize'dan SONRA)
//    express-session'dan sonra gelmeli ki session'ları kullanabilsin
app.use(passport.session());

// --- Middleware Tanımlamaları Sonu ---

// --- Rota Tanımlamaları (Tüm temel middleware'lerden SONRA) ---
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/side-banners", commonSideBannerRouter);
app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/shop/wishlist", shopWishlistRouter);
app.use("/api/common/promo-cards", commonPromoCardRouter);
// --- Rota Tanımlamaları Sonu ---

// Sunucuyu dinlemeye başla
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
