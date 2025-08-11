const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminCheckMiddleware = async (req, res, next) => {
  // Eğer req.user yoksa, JWT token'dan çıkar
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

  // Kullanıcı oturum açmış mı kontrol et
  if (!req.user) {
    console.log("Kullanıcı oturum açmamış");
    return res.status(401).json({
      success: false,
      message: "Oturum açmanız gerekiyor.",
    });
  }

  // Admin kontrolü - daha esnek
  const isAdmin =
    req.user.role === "admin" ||
    req.user.role === "Admin" ||
    (req.user.adminAccessLevel && req.user.adminAccessLevel <= 3) ||
    req.user.isAdmin === true;

  if (isAdmin) {
    return next();
  }

  console.log("Admin erişimi reddedildi");
  return res.status(403).json({
    success: false,
    message: "Yetkisiz işlem. Bu kaynağa erişim izniniz yok.",
  });
};

module.exports = adminCheckMiddleware;
