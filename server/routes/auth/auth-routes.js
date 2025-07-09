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
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
  domain: isProduction ? ".deposun.com" : undefined,
};

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
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

module.exports = router;
