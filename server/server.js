require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const admin = require("firebase-admin");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 800, // her IP'den 15 dakikada en fazla 100 istek
  standardHeaders: true,
  legacyHeaders: false,
  message: "Çok fazla istek yaptınız, lütfen 15 dakika sonra tekrar deneyin.",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 15, // 15 dakikada 10 giriş denemesi
  message:
    "Çok fazla giriş denemesi yapıldı, lütfen daha sonra tekrar deneyin.",
});

try {
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  if (!serviceAccount.private_key || !serviceAccount.client_email) {
    throw new Error(
      "Firebase service account bilgileri .env dosyasında eksik veya hatalı."
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  // console.log("Firebase Admin SDK başarıyla başlatıldı.");
} catch (error) {
  // console.error("Firebase Admin SDK başlatılamadı:", error.message);
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

const adminCategoryRouter = require("./routes/admin/category-routes"); // Yeni
const adminHomeSectionRouter = require("./routes/admin/home-section-routes"); // Yeni
const commonCategoryRouter = require("./routes/common/category-routes"); // Yeni
const shopHomeSectionRouter = require("./routes/shop/home-section-routes");
const adminBrandRouter = require("./routes/admin/brand-routes"); // Yeni
const commonBrandRouter = require("./routes/common/brand-routes");
const adminStatsRouter = require("./routes/admin/statsAdminRoutes");
const adminAuthorizationRouter = require("./routes/admin/authorization-routes");
const maintenanceRouter = require("./routes/common/maintenance-routes");
const contactRouter = require("./routes/common/contact-routes");
const errorHandler = require("./middleware/errorHandler");
const { scheduleAbandonedCartEmails } = require("./jobs/abandonedCartJob");
require("./controllers/auth/auth-controller");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_BASE_URL,
  "https://deposun.com",
  "http://localhost:5173",
  "http://localhost",
  "capacitor://localhost",
];

const IYZICO_CALLBACK_PATH = "/api/shop/order/iyzico-callback";

app.use(
  cors({
    origin: "*", // GEÇİCİ OLARAK TÜM KAYNAKLARA İZİN VER
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecretKeyForSession",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "Lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
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
app.use("/api/admin/categories", adminCategoryRouter);
app.use("/api/admin/home-sections", adminHomeSectionRouter);
app.use("/api/common/categories", commonCategoryRouter);
app.use("/api/shop/home-sections", shopHomeSectionRouter);
app.use("/api/admin/brands", adminBrandRouter);
app.use("/api/common/brands", commonBrandRouter);
app.use("/api/admin/stats", adminStatsRouter);
app.use("/api/admin/authorization", adminAuthorizationRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/contact", contactRouter);
app.use(errorHandler);
if (process.env.NODE_ENV !== "test") {
  scheduleAbandonedCartEmails();
}

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
