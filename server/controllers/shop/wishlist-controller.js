const Wishlist = require("../../models/Wishlist");
const Product = require("../../models/Product");

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Kullanıcı ID'si gerekli." });
    }

    const wishlist = await Wishlist.findOne({ userId });
    // .populate('items.productId'); // <<< İstersen ürün detaylarını getirmek için bunu açabilirsin

    if (!wishlist) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: wishlist.items });
  } catch (error) {
    console.error("Favori listesi getirilirken hata:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı ID'si ve Ürün ID'si gerekli.",
      });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: "Ürün bulunamadı." });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      return res.status(200).json({
        success: true,
        message: "Ürün zaten favorilerinizde.",
        data: { productId },
      });
    } else {
      wishlist.items.push({ productId });
      await wishlist.save();
      res.status(201).json({
        success: true,
        message: "Ürün favorilere eklendi.",
        data: { productId },
      });
    }
  } catch (error) {
    console.error("Favorilere eklenirken hata:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "İşlem çakışması, lütfen tekrar deneyin.",
      });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı ID'si ve Ürün ID'si gerekli.",
      });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Favori listesi bulunamadı." });
    }

    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    if (wishlist.items.length === initialLength) {
      return res
        .status(404)
        .json({ success: false, message: "Ürün favorilerinizde bulunamadı." });
    } else {
      await wishlist.save();
      res.status(200).json({
        success: true,
        message: "Ürün favorilerden çıkarıldı.",
        data: { productId },
      });
    }
  } catch (error) {
    console.error("Favorilerden çıkarılırken hata:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
