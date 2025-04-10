// server/controllers/shop/wishlist-controller.js
const Wishlist = require("../../models/Wishlist");
const Product = require("../../models/Product"); // Gerekirse Product modelini de import et

// Kullanıcının favori listesini getir
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Kullanıcı ID'si gerekli." });
    }

    // Kullanıcının favori listesini bul ve ürün detaylarını populate et
    // Frontend şu an sadece ID bekliyor gibi görünüyor,
    // ama populate etmek daha verimli olabilir. Frontend'i buna göre güncelleyebiliriz.
    // Şimdilik frontend'in beklediği gibi sadece ID'leri içeren item'ları döndürelim.
    const wishlist = await Wishlist.findOne({ userId });
    // .populate('items.productId'); // <<< İstersen ürün detaylarını getirmek için bunu açabilirsin

    if (!wishlist) {
      // Eğer kullanıcı için liste yoksa, boş liste döndür
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: wishlist.items }); // Sadece items dizisini döndür
  } catch (error) {
    console.error("Favori listesi getirilirken hata:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Ürünü favorilere ekle
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Kullanıcı ID'si ve Ürün ID'si gerekli.",
        });
    }

    // Ürünün var olup olmadığını kontrol et (opsiyonel ama önerilir)
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, message: "Ürün bulunamadı." });
    }

    // Kullanıcının favori listesini bul veya yoksa oluştur
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    // Ürün zaten favorilerde mi kontrol et
    const itemIndex = wishlist.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Zaten varsa tekrar ekleme, başarı mesajı döndür
      return res
        .status(200)
        .json({
          success: true,
          message: "Ürün zaten favorilerinizde.",
          data: { productId },
        });
    } else {
      // Favorilere ekle
      wishlist.items.push({ productId });
      await wishlist.save();
      res
        .status(201)
        .json({
          success: true,
          message: "Ürün favorilere eklendi.",
          data: { productId },
        });
    }
  } catch (error) {
    console.error("Favorilere eklenirken hata:", error);
    // Duplicate key hatası (aynı anda eklemeye çalışılırsa vs.) yönetilebilir
    if (error.code === 11000) {
      return res
        .status(409)
        .json({
          success: false,
          message: "İşlem çakışması, lütfen tekrar deneyin.",
        });
    }
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

// Ürünü favorilerden çıkar
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params; // Parametrelerden al
    if (!userId || !productId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Kullanıcı ID'si ve Ürün ID'si gerekli.",
        });
    }

    // Kullanıcının favori listesini bul
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Favori listesi bulunamadı." });
    }

    // Ürün listede mi kontrol et
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    if (wishlist.items.length === initialLength) {
      // Ürün listede bulunamadıysa
      return res
        .status(404)
        .json({ success: false, message: "Ürün favorilerinizde bulunamadı." });
    } else {
      // Değişikliği kaydet
      await wishlist.save();
      res
        .status(200)
        .json({
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
