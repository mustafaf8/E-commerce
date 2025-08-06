require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const ProductReview = require("../models/Review");

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Ürün puanını ve yorum sayısını güncelle
const updateProductRating = async (productId) => {
  try {
    const approvedReviews = await ProductReview.find({
      productId,
      status: "approved",
    });

    const numReviews = approvedReviews.length;
    const averageReview =
      numReviews > 0
        ? approvedReviews.reduce((acc, item) => item.reviewValue + acc, 0) / numReviews
        : 0;

    await Product.findByIdAndUpdate(productId, {
      averageReview: averageReview,
      numReviews: numReviews,
    });

    return { numReviews, averageReview };
  } catch (error) {
    console.error("Ürün puanı güncelleme hatası:", error);
    return null;
  }
};

// Tüm ürünlerin yorum sayılarını güncelle
const updateAllProductReviews = async () => {
  try {
    console.log("Tüm ürünlerin yorum sayıları güncelleniyor...");
    
    const products = await Product.find({});
    let updatedCount = 0;
    
    for (const product of products) {
      const result = await updateProductRating(product._id);
      if (result) {
        updatedCount++;
        console.log(`Ürün: ${product.title} - Yorum sayısı: ${result.numReviews}, Ortalama puan: ${result.averageReview.toFixed(2)}`);
      }
    }
    
    console.log(`Toplam ${updatedCount} ürün güncellendi.`);
  } catch (error) {
    console.error("Toplu güncelleme hatası:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Scripti çalıştır
updateAllProductReviews(); 