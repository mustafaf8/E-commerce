const mongoose = require("mongoose");
require("dotenv").config();

// Logger'ı import et
const { logInfo, logError, logWarn, logDebug } = require("./helpers/logger");

// Test fonksiyonu
const testLogging = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB'ye bağlandı");

    // Mock request objesi oluştur (kullanıcı bilgileri ile)
    const mockReq = {
      ip: "192.168.1.100",
      get: (header) => {
        if (header === "User-Agent") {
          return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
        }
        return null;
      },
      user: {
        _id: "507f1f77bcf86cd799439011", // Mock user ID
        username: "testuser",
        email: "test@example.com"
      }
    };

    // Farklı log seviyelerini test et (kullanıcı bilgileri ile)
    logInfo("Test info mesajı - kullanıcı ile", mockReq, {
      action: "TEST_INFO",
      additionalData: {
        testType: "info",
        timestamp: new Date().toISOString(),
      },
    });

    logWarn("Test warning mesajı - kullanıcı ile", mockReq, {
      action: "TEST_WARN",
      additionalData: {
        testType: "warning",
        timestamp: new Date().toISOString(),
      },
    });

    logError("Test error mesajı - kullanıcı ile", mockReq, {
      action: "TEST_ERROR",
      additionalData: {
        testType: "error",
        timestamp: new Date().toISOString(),
      },
    });

    // Kullanıcı olmadan da test et
    logDebug("Test debug mesajı - kullanıcı olmadan", null, {
      action: "TEST_DEBUG",
      additionalData: {
        testType: "debug",
        timestamp: new Date().toISOString(),
      },
    });

    console.log("Tüm test logları başarıyla oluşturuldu!");
    console.log("MongoDB'deki 'logs' koleksiyonunu kontrol edin.");
    console.log("Admin panelinde logları görüntüleyin.");

  } catch (error) {
    console.error("Test sırasında hata:", error);
  } finally {
    // Bağlantıyı kapat
    await mongoose.disconnect();
    console.log("MongoDB bağlantısı kapatıldı");
  }
};

// Test'i çalıştır
testLogging(); 