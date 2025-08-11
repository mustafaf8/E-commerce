const mongoSanitize = require('express-mongo-sanitize');

// Bu paket, gelen isteklerdeki verileri (req.body, req.query, req.params)
// NoSQL enjeksiyon saldırılarına karşı temizler.
// Özellikle '$' ve '.' karakterlerini içeren anahtarları kaldırarak
// MongoDB operatörlerinin enjekte edilmesini engeller.
const nosqlInjectionSanitize = () => {
  return mongoSanitize({
    // Bu seçenek, yasaklanmış anahtarlar bulunduğunda ne yapılacağını belirler.
    // `true` olarak ayarlandığında, bu anahtarlar veriden tamamen kaldırılır.
    // Örneğin, { "$gt": "" } içeren bir obje boş bir objeye ({}) dönüşür.
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`[NoSQL Sanitize] Yasaklanmış bir anahtar kaldırıldı: Anahtar: "${key}" İstek Yolu: "${req.originalUrl}"`);
    },
  });
};

module.exports = nosqlInjectionSanitize;