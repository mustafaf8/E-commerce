const axios = require('axios');

const cache = {
    rate: null,
    lastFetch: 0,
};

const CACHE_DURATION = 4 * 60 * 60 * 1000; 

const DEFAULT_RATE = 40;

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

/**
 * @returns {Promise<number>} 
 */
const getExchangeRate = async () => {
    const now = Date.now();
    if (cache.rate && (now - cache.lastFetch < CACHE_DURATION)) {
        return cache.rate;
    }

    if (!API_KEY) {
        console.warn("EXCHANGE_RATE_API_KEY bulunamadı. Varsayılan kur kullanılıyor.");
        return DEFAULT_RATE;
    }

    try {
        //console.log("API'den yeni döviz kuru çekiliyor...");
        const response = await axios.get(API_URL);

        if (response.data && response.data.result === 'success' && response.data.conversion_rates.TRY) {
            const rate = response.data.conversion_rates.TRY;
            cache.rate = rate;
            cache.lastFetch = now;
            //console.log(`Döviz kuru başarıyla güncellendi: 1 USD = ${rate} TRY`);
            return rate;
        } else {
            console.error("Döviz kuru API yanıtı geçersiz:", response.data);
            return DEFAULT_RATE;
        }
    } catch (error) {
        console.error("Döviz kuru API'sinden veri alınırken hata oluştu:", error.message);
        return cache.rate || DEFAULT_RATE;
    }
};


const startScheduledRateUpdates = () => {
    getExchangeRate();
    setInterval(getExchangeRate, CACHE_DURATION);
};

module.exports = {
    getExchangeRate,
    startScheduledRateUpdates,
}; 