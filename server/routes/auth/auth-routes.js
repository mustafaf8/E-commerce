// const express = require("express");
// const {
//   registerUser,
//   loginUser,
//   logoutUser,
//   authMiddleware,
//   updateUserDetails,
// } = require("../../controllers/auth/auth-controller");

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.get("/check-auth", authMiddleware, (req, res) => {
//   const user = req.user;
//   res.status(200).json({
//     success: true,
//     message: "Authenticated user!",
//     user,
//   });
// });
// router.put("/update", authMiddleware, updateUserDetails);

// module.exports = router;

// server/routes/auth/auth-routes.js
const express = require("express");
const passport = require("passport"); // passport import edildi
const jwt = require("jsonwebtoken"); // <--- BU SATIRI EKLEYİN
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  updateUserDetails,
} = require("../../controllers/auth/auth-controller"); // Controller fonksiyonları

const router = express.Router();

// Mevcut Rotalar
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); // logoutUser fonksiyonu güncellenmiş olmalı
router.get("/check-auth", authMiddleware, (req, res) => {
  // authMiddleware güncellenmiş olmalı
  const user = req.user; // authMiddleware tarafından eklenen kullanıcı bilgisi
  console.log("/check-auth user:", user);
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user: {
      // Sadece gerekli ve güvenli bilgileri gönder
      id: user._id,
      email: user.email,
      userName: user.userName,
      role: user.role,
      // profilePicture: user.profilePicture
    },
  });
});
router.put("/update", authMiddleware, updateUserDetails); // authMiddleware güncellenmiş olmalı

// --- YENİ: Google Auth Rotaları ---

// 1. Google ile Giriş Başlatma Rotası
// Bu rotaya tıklandığında kullanıcı Google'ın onay ekranına yönlendirilir.
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Google Callback Rotası
// Google, kullanıcıyı onayladıktan sonra bu rotaya yönlendirir.
router.get(
  "/google/callback",
  passport.authenticate("google", {
    // Başarısız olursa frontend'deki login sayfasına hata mesajıyla yönlendir
    failureRedirect:
      process.env.NODE_ENV === "production"
        ? `${process.env.CLIENT_URL}/auth/login?error=google_auth_failed`
        : "http://localhost:5173/auth/login?error=google_auth_failed",
    session: true, // <<< Session kullanmak istiyorsak true olmalı
  }),
  (req, res) => {
    // Başarılı kimlik doğrulama sonrası çalışır.
    // Passport strategy'deki 'done(null, user)' sayesinde req.user ayarlanır.
    // Passport session kullanıyorsak req.login() otomatik çağrılır.

    // Kullanıcıyı frontend'deki ana sayfaya veya profil sayfasına yönlendir.
    console.log("Google callback successful, user:", req.user);

    // Başarılı giriş sonrası token OLUŞTURMA (Session kullanmıyorsak veya ek olarak istiyorsak)
    const token = jwt.sign(
      {
        id: req.user._id,
        role: req.user.role,
        email: req.user.email,
        userName: req.user.userName,
      },
      process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY",
      { expiresIn: "1h" }
    );

    // Token'ı cookie'ye yaz
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    const redirectUrl =
      process.env.NODE_ENV === "production"
        ? `${process.env.CLIENT_URL}/shop/home` // Veya kullanıcının geldiği sayfa
        : "http://localhost:5173/shop/home"; // Geliştirme ortamı için

    res.redirect(redirectUrl);
  }
);

module.exports = router;
