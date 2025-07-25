const axios = require('axios');

// Basit bir in-memory cache
const cache = {
    rate: null,
    lastFetch: 0,
};

// Cache süresi (milisaniye cinsinden), 1 saat
const CACHE_DURATION = 4 * 60 * 60 * 1000; 

// Varsayılan kur (API hatası durumunda kullanılır)
const DEFAULT_RATE = 40;

// API anahtarı için ortam değişkeni
const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

/**
 * Güncel USD/TRY kurunu alır.
 * Önbelleğe alınmış veriyi kullanır veya API'den yeni veri çeker.
 * @returns {Promise<number>} Güncel veya varsayılan USD/TRY kuru.
 */
const getExchangeRate = async () => {
    const now = Date.now();
    // Cache kontrolü
    if (cache.rate && (now - cache.lastFetch < CACHE_DURATION)) {
       // console.log("Döviz kuru cache'den okundu.");
        return cache.rate;
    }

    if (!API_KEY) {
        console.warn("EXCHANGE_RATE_API_KEY bulunamadı. Varsayılan kur kullanılıyor.");
        return DEFAULT_RATE;
    }

    try {
        console.log("API'den yeni döviz kuru çekiliyor...");
        const response = await axios.get(API_URL);

        if (response.data && response.data.result === 'success' && response.data.conversion_rates.TRY) {
            const rate = response.data.conversion_rates.TRY;
            // Cache'i güncelle
            cache.rate = rate;
            cache.lastFetch = now;
            console.log(`Döviz kuru başarıyla güncellendi: 1 USD = ${rate} TRY`);
            return rate;
        } else {
            console.error("Döviz kuru API yanıtı geçersiz:", response.data);
            return DEFAULT_RATE;
        }
    } catch (error) {
        console.error("Döviz kuru API'sinden veri alınırken hata oluştu:", error.message);
        // Hata durumunda cache'deki eski veriyi (varsa) veya varsayılanı kullan
        return cache.rate || DEFAULT_RATE;
    }
};

/**
 * Belirtilen aralıklarla döviz kurunu arka planda günceller.
 */
const startScheduledRateUpdates = () => {
    getExchangeRate();
    setInterval(getExchangeRate, CACHE_DURATION);
};

module.exports = {
    getExchangeRate,
    startScheduledRateUpdates,
}; 