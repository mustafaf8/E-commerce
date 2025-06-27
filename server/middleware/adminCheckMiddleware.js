const adminCheckMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Yetkisiz işlem. Bu kaynağa erişim izniniz yok.",
  });
};

module.exports = adminCheckMiddleware;
