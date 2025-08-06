const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");

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
  } catch (error) {
    console.error("Ürün puanı güncelleme hatası:", error);
  }
};

// Tüm yorumları getir (admin)
const getAllReviewsAdmin = async (req, res) => {
  try {

    const { status } = req.query;
    
    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const reviews = await ProductReview.find(query)
      .populate("productId", "title")
      .populate("userId", "userName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      result: reviews,
      message: "Yorumlar başarıyla getirildi"
    });
  } catch (error) {
    console.error("Admin yorum getirme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Yorumlar getirilirken bir hata oluştu"
    });
  }
};

// Yorum durumunu güncelle (admin)
const updateReviewStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Geçersiz durum değeri"
      });
    }

    const review = await ProductReview.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("productId", "title")
     .populate("userId", "userName");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Yorum bulunamadı"
      });
    }

    // Ürün puanını ve yorum sayısını güncelle
    await updateProductRating(review.productId);

    res.status(200).json({
      success: true,
      result: review,
      message: `Yorum ${status === "approved" ? "onaylandı" : "reddedildi"}`
    });
  } catch (error) {
    console.error("Yorum durumu güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Yorum durumu güncellenirken bir hata oluştu"
    });
  }
};

// Yorumu sil (admin)
const deleteReviewAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await ProductReview.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Yorum bulunamadı"
      });
    }

    // Ürün puanını ve yorum sayısını güncelle
    await updateProductRating(review.productId);

    res.status(200).json({
      success: true,
      message: "Yorum başarıyla silindi"
    });
  } catch (error) {
    console.error("Yorum silme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Yorum silinirken bir hata oluştu"
    });
  }
};

module.exports = {
  getAllReviewsAdmin,
  updateReviewStatusAdmin,
  deleteReviewAdmin
}; 