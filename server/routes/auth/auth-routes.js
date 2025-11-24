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
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendEmailVerification,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
  domain: isProduction ? ".gokturklerenerji.com" : undefined,
};

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendEmailVerification);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user: {
      id: user._id,
      email: user.email,
      userName: user.userName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      tcKimlikNo: user.tcKimlikNo,
      adminAccessLevel: user.adminAccessLevel,
      adminModulePermissions: user.adminModulePermissions,
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
    session: true,
  }),
  (req, res) => {
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

    res.cookie("token", token, cookieOptions);

    const redirectUrl = `${process.env.CLIENT_BASE_URL}/shop/home`;
    res.redirect(redirectUrl);
  }
);
router.post("/phone/verify", verifyPhoneNumberLogin);
router.post("/phone/register", registerPhoneNumberUser);

// Test route for email sending
router.post("/test-email", async (req, res) => {
  try {
    const { sendEmailVerificationEmail } = require("../../helpers/emailHelper");
    const testCode = "123456";
    const testEmail = req.body.email || "test@example.com";

    console.log("Test e-postası gönderiliyor:", testEmail);
    const result = await sendEmailVerificationEmail(
      testEmail,
      testCode,
      "Test User"
    );

    if (result) {
      res.json({
        success: true,
        message: "Test e-postası başarıyla gönderildi",
      });
    } else {
      res.json({ success: false, message: "Test e-postası gönderilemedi" });
    }
  } catch (error) {
    console.error("Test e-postası hatası:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Test e-postası hatası",
        error: error.message,
      });
  }
});

module.exports = router;
