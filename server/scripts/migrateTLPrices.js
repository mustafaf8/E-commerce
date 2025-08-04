require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const { getExchangeRate } = require("../utils/currencyConverter");

/**
 * TL Fiyat Migration Script
 *
 * Bu script, mevcut ürünlerin TL fiyatlarını hesaplayarak veritabanına kaydeder.
 * Sadece bir kez çalıştırılmalıdır.
 */

async function migrateTLPrices() {
  try {
    //  console.log("MongoDB'ye bağlanılıyor...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB bağlantısı başarılı.");

    //  console.log("Güncel döviz kuru alınıyor...");
    const rate = await getExchangeRate();
    //  console.log(`Güncel döviz kuru: 1 USD = ${rate} TRY`);

    //  console.log("Tüm ürünler getiriliyor...");
    const products = await Product.find({});
    //  console.log(`${products.length} ürün bulundu.`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // TL fiyatları hesapla
        const priceTL = product.priceUSD
          ? Math.round(product.priceUSD * rate)
          : 0;
        const salePriceTL = product.salePriceUSD
          ? Math.round(product.salePriceUSD * rate)
          : null;

        // Ürünü güncelle
        await Product.findByIdAndUpdate(product._id, {
          priceTL,
          salePriceTL,
          priceLastUpdated: new Date(),
          price: priceTL,
          salePrice: salePriceTL,
        });

        updatedCount++;

        if (updatedCount % 100 === 0) {
          console.log(`${updatedCount} ürün güncellendi...`);
        }
      } catch (error) {
        console.error(
          `Ürün ${product._id} güncellenirken hata:`,
          error.message
        );
        errorCount++;
      }
    }

    // console.log("\n=== Migration Tamamlandı ===");
    // console.log(`Toplam ürün: ${products.length}`);
    // console.log(`Başarıyla güncellenen: ${updatedCount}`);
    console.log(`Hata alan: ${errorCount}`);
    // console.log("========================\n");
  } catch (error) {
    console.error("Migration hatası:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB bağlantısı kapatıldı.");
    process.exit(0);
  }
}

// Script'i çalıştır
if (require.main === module) {
  migrateTLPrices();
}

module.exports = migrateTLPrices;
