require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const admin = require("firebase-admin");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const http = require("http");
const { Server } = require("socket.io");

const apiLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 dakika
  max: 1500, // her IP'den 3 dakikada en fazla xxx istek
  standardHeaders: true,
  legacyHeaders: false,
  message: "Çok fazla istek yaptınız, lütfen 15 dakika sonra tekrar deneyin.",
});

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 dakika
  max: 15, // 5 dakikada 10 giriş denemesi
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
  //console.log("Firebase Admin SDK başarıyla başlatıldı.");
} catch (error) {
  console.error("Firebase Admin SDK başlatılamadı:", error.message);
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
const adminCategoryRouter = require("./routes/admin/category-routes");
const adminHomeSectionRouter = require("./routes/admin/home-section-routes");
const commonCategoryRouter = require("./routes/common/category-routes");
const shopHomeSectionRouter = require("./routes/shop/home-section-routes");
const adminBrandRouter = require("./routes/admin/brand-routes");
const commonBrandRouter = require("./routes/common/brand-routes");
const adminCouponRouter = require("./routes/admin/coupon-routes");
const adminStatsRouter = require("./routes/admin/statsAdminRoutes");
const adminAuthorizationRouter = require("./routes/admin/authorization-routes");
const adminUserRouter = require("./routes/admin/user-routes");
const maintenanceRouter = require("./routes/common/maintenance-routes");
const currencyRouter = require("./routes/common/currency-routes");
const shopCouponRouter = require("./routes/shop/coupon-routes");
const errorHandler = require("./middleware/errorHandler");
const { scheduleAbandonedCartEmails } = require("./jobs/abandonedCartJob");
const { startScheduledRateUpdates } = require("./utils/currencyConverter");
const priceUpdateJob = require("./jobs/priceUpdateJob");
require("./controllers/auth/auth-controller");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

const app = express();
const serverInstance = http.createServer(app);
app.set("trust proxy", 1);
app.use(helmet());
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_BASE_URL,
  "https://deposun.com",
  "http://localhost:5173",
];

// Socket.io kurulumu (allowedOrigins kullanarak CORS ayarı)
const io = new Server(serverInstance, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});


let activeVisitorCount = 0;

io.on("connection", (socket) => {
  console.log(`[Socket.IO] Yeni bağlantı: ${socket.id}`);

  // Ziyaretçi olarak kayıt
  socket.on("register_visitor", () => {
    console.log(`[Socket.IO] ${socket.id} ziyaretçi olarak kayıt oldu.`);
    socket.data.isVisitor = true;
    activeVisitorCount += 1;
    console.log(`[Socket.IO] Aktif ziyaretçi: ${activeVisitorCount}. Adminlere yayınlanıyor.`);
    io.to("admins").emit("visitor_count", activeVisitorCount);
  });

  // Admin olarak kayıt ve mevcut sayıyı gönder
  socket.on("register_admin", () => {
    console.log(`[Socket.IO] ${socket.id} admin olarak kayıt oldu.`);
    socket.join("admins");
    console.log(`[Socket.IO] Yeni admine mevcut sayı (${activeVisitorCount}) gönderiliyor: ${socket.id}.`);
    socket.emit("visitor_count", activeVisitorCount);
  });

  // Bağlantı koptuğunda ziyaretçi sayaç güncellemesi
  socket.on("disconnect", (reason) => {
    console.log(`[Socket.IO] Bağlantı kesildi: ${socket.id}. Sebep: ${reason}`);
    if (socket.data.isVisitor) {
      activeVisitorCount = Math.max(activeVisitorCount - 1, 0);
      console.log(`[Socket.IO] Ziyaretçi ayrıldı. Aktif ziyaretçi: ${activeVisitorCount}. Adminlere yayınlanıyor.`);
      io.to("admins").emit("visitor_count", activeVisitorCount);
    }
  });
});


const IYZICO_CALLBACK_PATH = "/api/shop/order/iyzico-callback";

app.use((req, res, next) => {
  if (req.path === IYZICO_CALLBACK_PATH) {
    return next();
  }

  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(
          new Error(
            "Bu origin için CORS politikası tarafından izin verilmiyor."
          )
        );
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })(req, res, next);
});

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecretKeyForSession",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60, // 24 saat
    }),
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
app.use("/api/admin/coupons", adminCouponRouter);
app.use("/api/admin/stats", adminStatsRouter);
app.use("/api/admin/authorization", adminAuthorizationRouter);
app.use("/api/admin/users", adminUserRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/common/currency", currencyRouter);
app.use(errorHandler);
if (process.env.NODE_ENV !== "test") {
  scheduleAbandonedCartEmails();
  startScheduledRateUpdates();
  priceUpdateJob.start();
}
app.use("/api/shop/coupons", shopCouponRouter);

serverInstance.listen(PORT, () =>
  console.log(`Server (with Socket.io) is now running on port ${PORT}`)
);
