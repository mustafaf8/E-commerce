require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const admin = require("firebase-admin");

try {
  const serviceAccount = require("./config/firebase-service-account.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK başarıyla başlatıldı.");
} catch (error) {
  console.error("Firebase Admin SDK başlatılamadı:", error);
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

require("./controllers/auth/auth-controller");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
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

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "cok_guclu_bir_varsayilan_secret_kullanin_env_yoksa",
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

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
