// hesapla/server/middleware/adminCheckMiddleware.js

const adminCheckMiddleware = (req, res, next) => {
  // Bu middleware'in her zaman authMiddleware'den sonra kullanıldığını varsayıyoruz.
  if (req.user && req.user.role === "admin") {
    return next(); // Kullanıcı admin ise sonraki adıma geç
  }
  return res.status(403).json({
    success: false,
    message: "Yetkisiz işlem. Bu kaynağa erişim izniniz yok.",
  });
};

module.exports = adminCheckMiddleware;
