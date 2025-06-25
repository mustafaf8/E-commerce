const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  updateUserDetails,
  verifyPhoneNumberLogin,
  registerPhoneNumberUser,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// --- Cookie ayarları için yardımcı değişken ---
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  // 'SameSite=None' bayrağı, 'secure=true' gerektirir. Bu, canlı (HTTPS) için çalışır.
  // Yerel (HTTP) ortamında ise 'secure' true olamaz, bu yüzden 'Lax' kullanırız.
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
  // Canlıda cookie'nin hangi domaine ait olacağını belirtiriz.
  // Yerelde bu alanı boş bırakırız ki tarayıcı 'localhost' olarak ayarlasın.
  domain: isProduction ? ".rmrenerji.online" : undefined,
};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  console.log("/check-auth user:", user);
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user: {
      id: user._id,
      email: user.email,
      userName: user.userName,
      role: user.role,
      phoneNumber: user.phoneNumber,
    },
  });
});
router.put("/update", authMiddleware, updateUserDetails);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_BASE_URL}/auth/login?error=google_auth_failed`,
    session: true, // Passport session kullanıyorsanız bu kalmalı
  }),
  (req, res) => {
    // Oturum açan kullanıcı bilgisi req.user içinde gelir.
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

    // DİNAMİK VE DOĞRU COOKIE AYARLARINI KULLANARAK COOKIE'Yİ AYARLA
    res.cookie("token", token, cookieOptions);

    // Kullanıcıyı frontend'e yönlendir
    const redirectUrl = `${process.env.CLIENT_BASE_URL}/shop/home`;
    res.redirect(redirectUrl);
  }
);
router.post("/phone/verify", verifyPhoneNumberLogin);
router.post("/phone/register", registerPhoneNumberUser);

module.exports = router;
