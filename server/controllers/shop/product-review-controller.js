const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, userName, reviewMessage, reviewValue } = req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] },
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "Ürünü değerlendirmek için satın almanız gerekiyor.",
      });
    }

    const checkExistinfReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistinfReview) {
      return res.status(400).json({
        success: false,
        message: "Bu ürünü zaten değerlendirdiniz!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
      status: "pending" // Açıkça pending olarak belirt
    });

    await newReview.save();

    // Ürün puanını ve yorum sayısını güncelle (sadece approved yorumlar için)
    const approvedReviews = await ProductReview.find({ 
      productId, 
      status: "approved" 
    });
    
    const numReviews = approvedReviews.length;
    const averageReview = numReviews > 0 
      ? approvedReviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / numReviews 
      : 0;
    
    await Product.findByIdAndUpdate(productId, { 
      averageReview,
      numReviews 
    });

    res.status(201).json({
      success: true,
      data: newReview,
      message: "Yorumunuz başarıyla eklendi ve onay için bekliyor."
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Sadece approved yorumları getir
    const reviews = await ProductReview.find({ 
      productId, 
      status: "approved" 
    });
    
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
   // console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
