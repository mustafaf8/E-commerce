const { logError } = require('../helpers/logger'); // Logger yardımcımızı import ediyoruz

const errorHandler = (err, req, res, next) => {
  // Varsayılan hata durum kodunu ayarla
  err.statusCode = err.statusCode || 500;

  // Hatanın loglanması (her ortamda çalışır)
  // logError fonksiyonu hatayı hem konsola basar hem de veritabanına kaydeder.
  // req objesini de göndererek hangi istek sırasında hata oluştuğunu loglayabiliriz.
  logError(err.message, req, {
    action: 'UNHANDLED_ERROR',
    statusCode: err.statusCode,
    stack: err.stack,
  });

  // PRODUCTION ORTAMI İÇİN
  if (process.env.NODE_ENV === 'production') {
    let errorMessage = 'Sunucuda beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    
    // Bilinen ve kullanıcıya gösterilebilecek hatalar için (err.isOperational)
    // Mesajı özelleştirebiliriz. Örneğin, "Stok yetersiz" gibi.
    if (err.isOperational) {
      errorMessage = err.message;
    }

    return res.status(err.statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
  
  // DEVELOPMENT ORTAMI İÇİN
  // Geliştirme ortamındaysak, hatanın tüm detaylarını görmek isteriz.
  res.status(err.statusCode).json({
    success: false,
    error: {
      message: err.message,
      statusCode: err.statusCode,
      stack: err.stack,
    },
  });
};

module.exports = errorHandler;