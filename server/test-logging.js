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

    // Farklı log seviyelerini test et
    logInfo("Test info mesajı", null, {
      action: "TEST_INFO",
      additionalData: {
        testType: "info",
        timestamp: new Date().toISOString(),
      },
    });

    logWarn("Test warning mesajı", null, {
      action: "TEST_WARN",
      additionalData: {
        testType: "warning",
        timestamp: new Date().toISOString(),
      },
    });

    logError("Test error mesajı", null, {
      action: "TEST_ERROR",
      additionalData: {
        testType: "error",
        timestamp: new Date().toISOString(),
      },
    });

    logDebug("Test debug mesajı", null, {
      action: "TEST_DEBUG",
      additionalData: {
        testType: "debug",
        timestamp: new Date().toISOString(),
      },
    });

    console.log("Tüm test logları başarıyla oluşturuldu!");
    console.log("MongoDB'deki 'logs' koleksiyonunu kontrol edin.");

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