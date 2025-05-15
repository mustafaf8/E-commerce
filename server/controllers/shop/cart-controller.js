// const Cart = require("../../models/Cart");
// const Product = require("../../models/Product");

// const addToCart = async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;

//     if (!userId || !productId || quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid data provided!",
//       });
//     }

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = new Cart({ userId, items: [] });
//     }

//     const findCurrentProductIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );

//     if (findCurrentProductIndex === -1) {
//       cart.items.push({ productId, quantity });
//     } else {
//       cart.items[findCurrentProductIndex].quantity += quantity;
//     }

//     await cart.save();
//     res.status(200).json({
//       success: true,
//       data: cart,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

// const fetchCartItems = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "User id is manadatory!",
//       });
//     }

//     const cart = await Cart.findOne({ userId }).populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found!",
//       });
//     }

//     const validItems = cart.items.filter(
//       (productItem) => productItem.productId
//     );

//     if (validItems.length < cart.items.length) {
//       cart.items = validItems;
//       await cart.save();
//     }

//     const populateCartItems = validItems.map((item) => ({
//       productId: item.productId._id,
//       image: item.productId.image,
//       title: item.productId.title,
//       price: item.productId.price,
//       salePrice: item.productId.salePrice,
//       quantity: item.quantity,
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         ...cart._doc,
//         items: populateCartItems,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

// const updateCartItemQty = async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;

//     if (!userId || !productId || quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid data provided!",
//       });
//     }

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found!",
//       });
//     }

//     const findCurrentProductIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );

//     if (findCurrentProductIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart item not present !",
//       });
//     }

//     cart.items[findCurrentProductIndex].quantity = quantity;
//     await cart.save();

//     await cart.populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     const populateCartItems = cart.items.map((item) => ({
//       productId: item.productId ? item.productId._id : null,
//       image: item.productId ? item.productId.image : null,
//       title: item.productId ? item.productId.title : "Product not found",
//       price: item.productId ? item.productId.price : null,
//       salePrice: item.productId ? item.productId.salePrice : null,
//       quantity: item.quantity,
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         ...cart._doc,
//         items: populateCartItems,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

// const deleteCartItem = async (req, res) => {
//   try {
//     const { userId, productId } = req.params;
//     if (!userId || !productId) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid data provided!",
//       });
//     }

//     const cart = await Cart.findOne({ userId }).populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found!",
//       });
//     }

//     cart.items = cart.items.filter(
//       (item) => item.productId._id.toString() !== productId
//     );

//     await cart.save();

//     await cart.populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     const populateCartItems = cart.items.map((item) => ({
//       productId: item.productId ? item.productId._id : null,
//       image: item.productId ? item.productId.image : null,
//       title: item.productId ? item.productId.title : "Product not found",
//       price: item.productId ? item.productId.price : null,
//       salePrice: item.productId ? item.productId.salePrice : null,
//       quantity: item.quantity,
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         ...cart._doc,
//         items: populateCartItems,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

// module.exports = {
//   addToCart,
//   updateCartItemQty,
//   deleteCartItem,
//   fetchCartItems,
// };

const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

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
        message: "Product not found",
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
      select: "image title price salePrice totalStock", // Gerekli alanları seçin
    });

    const finalPopulatedItems = populatedCart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      totalStock: item.productId.totalStock,
    }));

    res.status(200).json({
      success: true,
      data: { ...populatedCart._doc, items: finalPopulatedItems }, // Populate edilmiş sepeti döndür
    });
  } catch (error) {
    console.log(error);
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

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

// const updateCartItemQty = async (req, res) => {
//   try {
//     const userId = req.user?.id; // authMiddleware'den gelen kullanıcı ID'sini kullanın
//     const { productId, quantity } = req.body;

//     if (
//       !userId ||
//       !productId ||
//       quantity === undefined ||
//       typeof quantity !== "number" ||
//       quantity < 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Geçersiz veri sağlandı! Kullanıcı ID, ürün ID ve geçerli miktar (0 veya daha büyük) gereklidir.",
//       });
//     }
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Stok kontrolü için ürün bulunamadı.",
//       });
//     }
//     // Negatif olmayan stok kontrolü
//     if (product.totalStock === undefined || product.totalStock < 0) {
//       console.error(
//         `Ürün (${productId}) için geçersiz stok değeri: ${product.totalStock}`
//       );
//       return res.status(500).json({
//         success: false,
//         message: "Ürün stok bilgisi alınırken hata oluştu.",
//       });
//     }
//     if (quantity > product.totalStock) {
//       return res.status(400).json({
//         success: false,
//         message: `Stokta yeterli ürün bulunmamaktadır. En fazla ${product.totalStock} adet eklenebilir.`,
//         isStockError: true, // Bu bayrağı client'a göndermek faydalı olabilir
//         availableStock: product.totalStock,
//       });
//     }

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found!",
//       });
//     }

//     const findCurrentProductIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );

//     if (findCurrentProductIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart item not present !",
//       });
//     }

//     cart.items[findCurrentProductIndex].quantity = quantity;
//     await cart.save();

//     await cart.populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     const populateCartItems = cart.items.map((item) => ({
//       productId: item.productId ? item.productId._id : null,
//       image: item.productId ? item.productId.image : null,
//       title: item.productId ? item.productId.title : "Product not found",
//       price: item.productId ? item.productId.price : null,
//       salePrice: item.productId ? item.productId.salePrice : null,
//       quantity: item.quantity,
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         ...cart._doc,
//         items: populateCartItems,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

// server/controllers/shop/cart-controller.js
const updateCartItemQty = async (req, res) => {
  try {
    const userId = req.user?.id; // authMiddleware'den gelen kullanıcı ID'si
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
      console.error(
        `Ürün (${productId}) için geçersiz stok değeri: ${product.totalStock}`
      );
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
      cart.items.splice(findCurrentProductIndex, 1); // Miktar 0 ise ürünü sil
    } else {
      cart.items[findCurrentProductIndex].quantity = quantity;
    }

    await cart.save();

    // Populate edilmiş sepeti döndür
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });
    const finalPopulatedItems = populatedCart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      totalStock: item.productId.totalStock,
    }));

    res.status(200).json({
      success: true,
      message: "Cart item quantity updated.",
      data: { ...populatedCart._doc, items: finalPopulatedItems },
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
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

// const deleteCartItem = async (req, res) => {
//   try {
//     const { userId, productId } = req.params;
//     if (!userId || !productId) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid data provided!",
//       });
//     }

//     const cart = await Cart.findOne({ userId }).populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found!",
//       });
//     }

//     cart.items = cart.items.filter(
//       (item) => item.productId._id.toString() !== productId
//     );

//     await cart.save();

//     await cart.populate({
//       path: "items.productId",
//       select: "image title price salePrice",
//     });

//     const populateCartItems = cart.items.map((item) => ({
//       productId: item.productId ? item.productId._id : null,
//       image: item.productId ? item.productId.image : null,
//       title: item.productId ? item.productId.title : "Product not found",
//       price: item.productId ? item.productId.price : null,
//       salePrice: item.productId ? item.productId.salePrice : null,
//       quantity: item.quantity,
//     }));

//     res.status(200).json({
//       success: true,
//       data: {
//         ...cart._doc,
//         items: populateCartItems,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params; // Bunlar URL'den doğru gelmeli
    const authenticatedUserId = req.user?.id; // authMiddleware'den gelen

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required in params!",
      });
    }

    // Güvenlik: İstek yapan kullanıcının sadece kendi sepetini silebildiğinden emin ol
    if (authenticatedUserId !== userId) {
      console.warn(
        `Yetkisiz silme denemesi: req.user.id (<span class="math-inline">\{authenticatedUserId\}\) \!\=\= params\.userId \(</span>{userId})`
      );
      return res
        .status(403)
        .json({ success: false, message: "Yetkisiz işlem." });
    }

    const cart = await Cart.findOne({ userId }); // userId burada ObjectId olmalı

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

    // Başarılı yanıt için populate edilmiş sepeti döndürmek iyi bir pratik
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });
    const finalPopulatedItems = populatedCart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      totalStock: item.productId.totalStock,
    }));

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      data: { ...populatedCart._doc, items: finalPopulatedItems },
    });
  } catch (error) {
    console.error("Error deleting cart item:", error); // Hata logunu detaylandırın
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
    const { userId, localCartItems } = req.body; // localCartItems: [{ productId, quantity }, ...]

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
        console.warn(
          `Senkronizasyon: Ürün bulunamadı ID: ${localItem.productId}`
        );
        continue; // Ürün yoksa bu adımı atla
      }

      const existingItemIndex = userCart.items.findIndex(
        (item) => item.productId.toString() === localItem.productId
      );

      if (existingItemIndex > -1) {
        // Ürün zaten DB sepetinde var, miktarı topla (veya en yükseğini al, stratejiye bağlı)
        // Stok kontrolü burada da önemli!
        const newQuantity =
          userCart.items[existingItemIndex].quantity + localItem.quantity;
        userCart.items[existingItemIndex].quantity = Math.min(
          newQuantity,
          product.totalStock
        ); // Stokla sınırla
      } else {
        // Ürün DB sepetinde yok, yeni ekle (stokla sınırlı)
        userCart.items.push({
          productId: localItem.productId,
          quantity: Math.min(localItem.quantity, product.totalStock), // Stokla sınırla
        });
      }
    }

    await userCart.save();
    // Populate edilmiş sepeti döndür
    const populatedCart = await Cart.findById(userCart._id).populate({
      path: "items.productId",
      select: "image title price salePrice totalStock", // totalStock'u da alalım
    });

    const finalPopulatedItems = populatedCart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      totalStock: item.productId.totalStock, // Frontend'de stok kontrolü için
    }));

    res.status(200).json({
      success: true,
      message: "Sepet senkronize edildi.",
      data: { ...populatedCart._doc, items: finalPopulatedItems },
    });
  } catch (error) {
    console.error("Sepet senkronizasyon hatası:", error);
    res
      .status(500)
      .json({ success: false, message: "Sunucu hatası (senkronizasyon)." });
  }
};
module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
  syncLocalCart,
};
