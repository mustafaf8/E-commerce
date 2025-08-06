const mongoose = require("mongoose");
require("dotenv").config();

const ProductReview = require("../models/Review");

async function updateReviewsStatus() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB'ye bağlandı");

    // Status alanı olmayan yorumları bul ve güncelle
    const reviewsToUpdate = await ProductReview.find({ status: { $exists: false } });
    
    if (reviewsToUpdate.length === 0) {
      console.log("Güncellenecek yorum bulunamadı.");
      return;
    }

    console.log(`${reviewsToUpdate.length} yorum güncellenecek...`);

    // Tüm yorumları "pending" status'ü ile güncelle
    const result = await ProductReview.updateMany(
      { status: { $exists: false } },
      { $set: { status: "pending" } }
    );

    console.log(`${result.modifiedCount} yorum başarıyla güncellendi.`);

    // Güncellenen yorumları kontrol et
    const updatedReviews = await ProductReview.find({ status: "pending" });
    console.log(`Toplam ${updatedReviews.length} yorum "pending" durumunda.`);

  } catch (error) {
    console.error("Hata:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB bağlantısı kapatıldı");
  }
}

// Script'i çalıştır
updateReviewsStatus(); 