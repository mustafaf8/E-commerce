# Loglama Sistemi Dokümantasyonu

Bu proje, Winston ve Winston-MongoDB kütüphaneleri kullanılarak geliştirilmiş kapsamlı bir loglama sistemine sahiptir.

## 🚀 Özellikler

- **Çoklu Transport**: Loglar hem konsola hem de MongoDB'ye yazılır
- **Structured Logging**: JSON formatında yapılandırılmış loglar
- **Kullanıcı Takibi**: IP adresi, kullanıcı bilgileri ve işlem detayları
- **Admin Paneli**: Logları görüntüleme ve filtreleme
- **İstatistikler**: Log seviyeleri ve işlem türleri bazında istatistikler

## 📁 Dosya Yapısı

```
server/
├── models/
│   └── Log.js                    # Log modeli
├── helpers/
│   └── logger.js                 # Winston logger yapılandırması
├── controllers/admin/
│   └── log-controller.js         # Log yönetimi API'leri
├── routes/admin/
│   └── log-routes.js             # Log route'ları
└── test-logging.js               # Test dosyası
```

## 🔧 Kurulum

### 1. Bağımlılıklar

Winston ve Winston-MongoDB zaten `package.json`'da mevcut:

```json
{
  "winston": "^3.17.0",
  "winston-mongodb": "^7.0.0"
}
```

### 2. Environment Variables

`.env` dosyasına ekleyin:

```env
LOG_LEVEL=info  # debug, info, warn, error
```

## 📝 Kullanım

### Logger Import

```javascript
const { logInfo, logError, logWarn, logDebug, logWithUser } = require("./helpers/logger");
```

### Basit Loglama

```javascript
// Info log
logInfo("Kullanıcı giriş yaptı");

// Error log
logError("Veritabanı bağlantı hatası");

// Warning log
logWarn("Düşük stok uyarısı");

// Debug log
logDebug("Debug bilgisi");
```

### Kullanıcı Bilgileri ile Loglama

```javascript
// Request objesi ile
logInfo("Ürün eklendi", req, {
  action: "ADD_PRODUCT",
  resourceId: productId,
  resourceType: "Product",
  additionalData: {
    productName: "Test Ürün",
    price: 100
  }
});
```

### Kritik İşlem Loglama

```javascript
try {
  // Kritik işlem
  await deleteProduct(productId);
  
  // Başarılı işlem logu
  logInfo("Ürün başarıyla silindi", req, {
    action: "DELETE_PRODUCT",
    resourceId: productId,
    resourceType: "Product"
  });
} catch (error) {
  // Hata logu
  logError("Ürün silme hatası", req, {
    action: "DELETE_PRODUCT_ERROR",
    resourceId: productId,
    error: error.message
  });
}
```

## 🔍 API Endpoints

### Logları Getir

```
GET /api/admin/logs
```

**Query Parameters:**
- `page`: Sayfa numarası (varsayılan: 1)
- `limit`: Sayfa başına log sayısı (varsayılan: 50)
- `level`: Log seviyesi (info, warn, error, debug)
- `action`: İşlem türü
- `userId`: Kullanıcı ID'si
- `startDate`: Başlangıç tarihi
- `endDate`: Bitiş tarihi
- `search`: Arama terimi

**Örnek:**
```
GET /api/admin/logs?page=1&limit=20&level=error&action=DELETE_PRODUCT
```

### Log İstatistikleri

```
GET /api/admin/logs/stats
```

**Query Parameters:**
- `startDate`: Başlangıç tarihi
- `endDate`: Bitiş tarihi

### Tekil Log Detayı

```
GET /api/admin/logs/:id
```

## 🧪 Test

Loglama sistemini test etmek için:

```bash
npm run test-logging
```

Bu komut farklı log seviyelerinde test mesajları oluşturacak.

## 📊 Log Yapısı

### MongoDB'deki Log Kaydı

```json
{
  "_id": "ObjectId",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "level": "info",
  "message": "Ürün başarıyla silindi",
  "meta": {
    "userId": "ObjectId",
    "username": "admin@example.com",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "action": "DELETE_PRODUCT",
    "resourceId": "product123",
    "resourceType": "Product",
    "additionalData": {
      "productTitle": "Test Ürün",
      "productCategory": "Electronics"
    }
  },
  "source": "server",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

## 🔐 Güvenlik

- Loglar sadece admin kullanıcılar tarafından görüntülenebilir
- Hassas bilgiler (şifreler, token'lar) loglanmaz
- IP adresleri ve kullanıcı bilgileri güvenli şekilde saklanır

## 🚨 Kritik İşlemler

Aşağıdaki işlemler otomatik olarak loglanır:

- ✅ Ürün silme işlemleri
- ✅ Kullanıcı giriş/çıkış işlemleri
- ✅ Admin paneli erişimleri
- ✅ Sistem başlatma/durdurma
- ✅ Hata durumları

## 📈 Performans

- Loglar asenkron olarak yazılır
- MongoDB indeksleri optimize edilmiştir
- Sayfalama ile büyük log dosyaları yönetilir
- Eski loglar otomatik olarak temizlenebilir

## 🔧 Özelleştirme

### Yeni Log Seviyesi Ekleme

```javascript
// helpers/logger.js
const logCustom = (message, req = null, additionalMeta = {}) => {
  logWithUser("custom", message, req, additionalMeta);
};
```

### Yeni Transport Ekleme

```javascript
// helpers/logger.js
const logger = winston.createLogger({
  transports: [
    // Mevcut transport'lar...
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    })
  ]
});
```

## 📞 Destek

Loglama sistemi ile ilgili sorunlar için:

1. MongoDB bağlantısını kontrol edin
2. Winston bağımlılıklarının yüklü olduğundan emin olun
3. Environment variables'ları kontrol edin
4. Test dosyasını çalıştırarak sistemin çalışıp çalışmadığını doğrulayın 