const User = require("../../models/User");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const Coupon = require("../../models/Coupon");

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Ürün bulunamadı.",
      });
    }
    if (product.totalStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stokta yeterli ürün bulunmamaktadır. En fazla ${product.totalStock} adet eklenebilir.`,
        isStockError: true,
        availableStock: product.totalStock,
      });
    }
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "image title priceUSD salePriceUSD totalStock",
    });

    const finalPopulatedItems = await Promise.all(populatedCart.items.map(async (item) => {
      const productWithPrices = await item.productId.calculateTLPrices();
      return {
        productId: productWithPrices._id,
        image: productWithPrices.image,
        title: productWithPrices.title,
        price: productWithPrices.price,
        salePrice: productWithPrices.salePrice,
        quantity: item.quantity,
        totalStock: productWithPrices.totalStock,
      };
    }));

    res.status(200).json({
      success: true,
      data: { ...populatedCart._doc, items: finalPopulatedItems },
    });
  } catch (error) {
   // console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is manadatory!",
      });
    }

    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title priceUSD salePriceUSD totalStock",
    });

    if (!cart) {
      const newCart = new Cart({ userId, items: [] });
      await newCart.save();
     // console.log(`Yeni kullanıcı için boş sepet oluşturuldu: ${userId}`);
      return res.status(200).json({
        success: true,
        data: { ...newCart._doc, items: [] },
      });
    }
    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = await Promise.all(validItems.map(async (item) => {
      const productWithPrices = await item.productId.calculateTLPrices();
      return {
        productId: productWithPrices._id,
        image: productWithPrices.image,
        title: productWithPrices.title,
        price: productWithPrices.price,
        salePrice: productWithPrices.salePrice,
        quantity: item.quantity,
      };
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
   // console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    if (
      !userId ||
      !productId ||
      quantity === undefined ||
      typeof quantity !== "number" ||
      quantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Geçersiz veri: Kullanıcı ID, Ürün ID ve geçerli miktar (0 veya daha büyük) gereklidir.",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Sepet bulunamadı!" });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Ürün sepette bulunamadı!" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Stok kontrolü için ürün bulunamadı.",
      });
    }
    if (product.totalStock === undefined || product.totalStock < 0) {
     // console.error(
     //   `Ürün (${productId}) için geçersiz stok değeri: ${product.totalStock}`
     // );
      return res.status(500).json({
        success: false,
        message: "Ürün stok bilgisi alınırken hata oluştu.",
      });
    }

    if (quantity > product.totalStock) {
      return res.status(400).json({
        success: false,
        message: `Stokta yeterli ürün bulunmamaktadır. En fazla ${product.totalStock} adet eklenebilir.`,
        isStockError: true,
        availableStock: product.totalStock,
      });
    }

    if (quantity === 0) {
      cart.items.splice(findCurrentProductIndex, 1);
    } else {
      cart.items[findCurrentProductIndex].quantity = quantity;
    }

    await cart.save();

    // Populate edilmiş sepeti döndür
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "image title priceUSD salePriceUSD totalStock",
    });
    const finalPopulatedItems = await Promise.all(populatedCart.items.map(async (item) => {
      const productWithPrices = await item.productId.calculateTLPrices();
      return {
        productId: productWithPrices._id,
        image: productWithPrices.image,
        title: productWithPrices.title,
        price: productWithPrices.price,
        salePrice: productWithPrices.salePrice,
        quantity: item.quantity,
        totalStock: productWithPrices.totalStock,
      };
    }));

    res.status(200).json({
      success: true,
      message: "Cart item quantity updated.",
      data: { ...populatedCart._doc, items: finalPopulatedItems },
    });
  } catch (error) {
   // console.error("Error updating cart item quantity:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Geçersiz ID formatı: ${error.path} için ${error.valueType} bekleniyordu.`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while updating quantity.",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const authenticatedUserId = req.user?.id;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required in params!",
      });
    }

    if (authenticatedUserId !== userId) {
     // console.warn(
     //   `Yetkisiz silme denemesi: req.user.id (<span class="math-inline">\{authenticatedUserId\}\) \!\=\= params\.userId \(</span>{userId})`
     // );
      return res
        .status(403)
        .json({ success: false, message: "Yetkisiz işlem." });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found!" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart." });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "image title priceUSD salePriceUSD totalStock",
    });
    const finalPopulatedItems = await Promise.all(populatedCart.items.map(async (item) => {
      const productWithPrices = await item.productId.calculateTLPrices();
      return {
        productId: productWithPrices._id,
        image: productWithPrices.image,
        title: productWithPrices.title,
        price: productWithPrices.price,
        salePrice: productWithPrices.salePrice,
        quantity: item.quantity,
        totalStock: productWithPrices.totalStock,
      };
    }));

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      data: { ...populatedCart._doc, items: finalPopulatedItems },
    });
  } catch (error) {
   // console.error("Error deleting cart item:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: `Geçersiz ID formatı: ${error.path} için ${error.valueType} bekleniyordu.`,
      });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting item." });
  }
};
const syncLocalCart = async (req, res) => {
  try {
    const { userId, localCartItems } = req.body;

    if (!userId || !Array.isArray(localCartItems)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz senkronizasyon verisi." });
    }

    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = new Cart({ userId, items: [] });
    }

    for (const localItem of localCartItems) {
      const product = await Product.findById(localItem.productId);
      if (!product) {
       // console.warn(
       //   `Senkronizasyon: Ürün bulunamadı ID: ${localItem.productId}`
       // );
        continue; // Ürün yoksa bu adımı atla
      }

      const existingItemIndex = userCart.items.findIndex(
        (item) => item.productId.toString() === localItem.productId
      );

      if (existingItemIndex > -1) {
        const newQuantity =
          userCart.items[existingItemIndex].quantity + localItem.quantity;
        userCart.items[existingItemIndex].quantity = Math.min(
          newQuantity,
          product.totalStock
        );
      } else {
        userCart.items.push({
          productId: localItem.productId,
          quantity: Math.min(localItem.quantity, product.totalStock),
        });
      }
    }

    await userCart.save();

    const populatedCart = await Cart.findById(userCart._id).populate({
      path: "items.productId",
      select: "image title priceUSD salePriceUSD totalStock",
    });

    const finalPopulatedItems = await Promise.all(populatedCart.items.map(async (item) => {
      const productWithPrices = await item.productId.calculateTLPrices();
      return {
        productId: productWithPrices._id,
        image: productWithPrices.image,
        title: productWithPrices.title,
        price: productWithPrices.price,
        salePrice: productWithPrices.salePrice,
        quantity: item.quantity,
        totalStock: productWithPrices.totalStock,
      };
    }));

    res.status(200).json({
      success: true,
      message: "Sepet senkronize edildi.",
      data: { ...populatedCart._doc, items: finalPopulatedItems },
    });
  } catch (error) {
   // console.error("Sepet senkronizasyon hatası:", error);
    res
      .status(500)
      .json({ success: false, message: "Sunucu hatası (senkronizasyon)." });
  }
};
// Kupon uygula
const applyCoupon = async (req, res) => {
  try {
    const { couponCode, cartTotal } = req.body;

    if (!couponCode || typeof cartTotal !== 'number') {
      return res.status(400).json({
        success: false,
        message: "Kupon kodu ve sepet tutarı gereklidir.",
      });
    }

    // Kuponu bul (case-insensitive)
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase() 
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Geçersiz kupon kodu.",
      });
    }

    // Kuponun geçerliliğini kontrol et
    const validation = coupon.isValidCoupon(cartTotal);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    // İndirim tutarını hesapla
    const discountAmount = coupon.calculateDiscount(cartTotal);
    const newTotal = Math.max(cartTotal - discountAmount, 0);

    res.status(200).json({
      success: true,
      message: "Kupon başarıyla uygulandı.",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount: discountAmount,
      originalTotal: cartTotal,
      newTotal: newTotal,
    });

  } catch (error) {
    console.error("Kupon uygulama hatası:", error);
    res.status(500).json({
      success: false,
      message: "Kupon uygulanırken hata oluştu.",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
  syncLocalCart,
  applyCoupon,
};
