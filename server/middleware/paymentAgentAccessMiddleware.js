const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Allows access to payment endpoints for admin or payment_agent roles.
 * Requires authMiddleware to run before this middleware in the chain.
 */
const paymentAgentAccessMiddleware = async (req, res, next) => {
  if (!req.user) {
    const token =
      req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.CLIENT_SECRET_KEY || "DEFAULT_SECRET_KEY"
        );
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
        }
      } catch (error) {
        console.log("JWT token geçersiz:", error.message);
      }
    }
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Oturum açmanız gerekiyor.",
    });
  }

  const isAuthorized =
    req.user.role === "admin" || req.user.role === "payment_agent";

  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      message: "Yetkisiz işlem. Bu kaynağa erişim izniniz yok.",
    });
  }

  return next();
};

module.exports = paymentAgentAccessMiddleware;

