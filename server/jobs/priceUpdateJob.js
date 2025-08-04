const cron = require('node-cron');
const Product = require('../models/Product');
const { getExchangeRate } = require('../utils/currencyConverter');

/**
 * TL Fiyat Güncelleme Cron Job
 * 
 * Bu job, belirli aralıklarla tüm ürünlerin TL fiyatlarını günceller.
 * Performans optimizasyonu için kullanılır.
 */

class PriceUpdateJob {
  constructor() {
    this.isRunning = false;
    this.lastRun = null;
    this.nextRun = null;
  }

  /**
   * Cron job'ı başlatır
   */
  start() {
    console.log('TL Fiyat Güncelleme Cron Job başlatılıyor...');
    
    // Her saat başı çalışacak cron job (0 * * * *)
    cron.schedule('0 * * * *', async () => {
      await this.updateAllPrices();
    }, {
      scheduled: true,
      timezone: "Europe/Istanbul"
    });

    // Her gün gece yarısı çalışacak cron job (0 0 * * *)
    cron.schedule('0 0 * * *', async () => {
      await this.updateAllPrices(true); // Force update
    }, {
      scheduled: true,
      timezone: "Europe/Istanbul"
    });

    console.log('TL Fiyat Güncelleme Cron Job başlatıldı.');
  }

  /**
   * Tüm ürünlerin TL fiyatlarını günceller
   * @param {boolean} forceUpdate - Zorla güncelleme yapılıp yapılmayacağı
   */
  async updateAllPrices(forceUpdate = false) {
    if (this.isRunning) {
      console.log('TL fiyat güncelleme işlemi zaten çalışıyor, atlanıyor...');
      return;
    }

    try {
      this.isRunning = true;
      this.lastRun = new Date();
      
      console.log(`TL fiyat güncelleme işlemi başlatılıyor... (${new Date().toLocaleString('tr-TR')})`);
      
      // Güncel döviz kurunu al
      const rate = await getExchangeRate();
      console.log(`Güncel döviz kuru: 1 USD = ${rate} TRY`);

      // Tüm ürünleri güncelle
      const result = await Product.updateAllTLPrices();
      
      this.nextRun = new Date(Date.now() + 60 * 60 * 1000); // 1 saat sonra
      
      console.log(`TL fiyat güncelleme işlemi tamamlandı. ${result.modifiedCount} ürün güncellendi.`);
      console.log(`Sonraki güncelleme: ${this.nextRun.toLocaleString('tr-TR')}`);
      
    } catch (error) {
      console.error('TL fiyat güncelleme hatası:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Manuel olarak fiyat güncellemesi yapar
   */
  async manualUpdate() {
    console.log('Manuel TL fiyat güncellemesi başlatılıyor...');
    await this.updateAllPrices(true);
  }

  /**
   * Job durumunu döndürür
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.nextRun,
      isActive: true
    };
  }

  /**
   * Job'ı durdurur
   */
  stop() {
    console.log('TL Fiyat Güncelleme Cron Job durduruluyor...');
    cron.getTasks().forEach(task => {
      if (task.name.includes('price-update')) {
        task.stop();
      }
    });
    console.log('TL Fiyat Güncelleme Cron Job durduruldu.');
  }
}

// Singleton instance
const priceUpdateJob = new PriceUpdateJob();

module.exports = priceUpdateJob; 