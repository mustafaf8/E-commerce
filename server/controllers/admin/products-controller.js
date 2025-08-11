const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const mongoose = require("mongoose");
const priceUpdateJob = require("../../jobs/priceUpdateJob");
const { logInfo, logError } = require("../../helpers/logger");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = "data:" + req.file.mimetype + ";base64," + b64;

    // Cloudinary'e yükle
    const uploadResult = await imageUploadUtil(dataUri);

    // Dönen URL'in 'https' olduğundan emin ol
    const secureUrl =
      uploadResult.secure_url || uploadResult.url.replace(/^http:/i, "https:");

    // Cloudinary'den dönen result objesini, secure_url ile güncelleyerek geri gönder
    const finalResult = {
      ...uploadResult,
      url: secureUrl,
      secure_url: secureUrl,
    };

    res.json({
      success: true,
      result: finalResult, // Güncellenmiş result objesini gönder
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Resim yüklenirken bir hata oluştu.",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      images,
      title,
      description,
      category,
      brand,
      priceUSD, // Değişti: price -> priceUSD
      salePriceUSD, // Değişti: salePrice -> salePriceUSD
      totalStock,
      averageReview,
      costPrice,
      technicalSpecs,
    } = req.body;

    const newlyCreatedProduct = new Product({
      image,
      images: images || [],
      title,
      description,
      category,
      brand,
      priceUSD, // Değişti
      salePriceUSD, // Değişti
      totalStock,
      averageReview,
      costPrice,
      technicalSpecs,
    });

    await newlyCreatedProduct.save();
    
    // Ürün ekleme işlemini logla
    logInfo("Yeni ürün eklendi", req, {
      action: "ADD_PRODUCT",
      resourceId: newlyCreatedProduct._id,
      resourceType: "Product",
      additionalData: {
        productTitle: title,
        productCategory: category,
        productBrand: brand,
        priceUSD: priceUSD,
      },
    });
    
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    // Hata durumunu logla
    logError("Ürün ekleme hatası", req, {
      action: "ADD_PRODUCT_ERROR",
      error: e.message,
    });
    
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({})
      .populate("category", "name slug")
      .populate("brand", "name slug");

    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Ürün ID formatı." });
    }
    const {
      image,
      images,
      title,
      description,
      category,
      brand,
      priceUSD, // Değişti
      salePriceUSD, // Değişti
      totalStock,
      averageReview,
      costPrice,
      technicalSpecs,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    if (title !== undefined) findProduct.title = title;
    if (description !== undefined) findProduct.description = description;
    if (category !== undefined) findProduct.category = category;
    if (brand !== undefined) findProduct.brand = brand;
    if (priceUSD !== undefined) findProduct.priceUSD = priceUSD; // Değişti
    if (salePriceUSD !== undefined) findProduct.salePriceUSD = salePriceUSD; // Değişti
    if (totalStock !== undefined) findProduct.totalStock = totalStock;
    if (image !== undefined) findProduct.image = image;
    if (images !== undefined) findProduct.images = images;
    if (averageReview !== undefined) findProduct.averageReview = averageReview;
    if (costPrice !== undefined) findProduct.costPrice = costPrice;
    if (technicalSpecs !== undefined) findProduct.technicalSpecs = technicalSpecs;

    await findProduct.save();
    
    if (priceUSD !== undefined || salePriceUSD !== undefined) {
      console.log("Fiyat değişikliği algılandı, tüm TL fiyatları güncelleniyor...");
      // Await kullanmıyoruz ki admin yanıt için beklemesin.
      Product.updateAllTLPrices().catch(err => {
        console.error("Arka planda TL fiyat güncelleme hatası:", err);
        // Bu hata admin'e gönderilmez, sadece loglanır.
      });
    }
    
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    //console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Geçersiz Ürün ID formatı." });
    }
    
    // Ürünü silmeden önce bilgilerini al
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Ürünü sil
    await Product.findByIdAndDelete(id);

    // Başarılı silme işlemini logla
    logInfo("Ürün başarıyla silindi", req, {
      action: "DELETE_PRODUCT",
      resourceId: id,
      resourceType: "Product",
      additionalData: {
        productTitle: product.title,
        productCategory: product.category,
        productBrand: product.brand,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    // Hata durumunu logla
    logError("Ürün silme hatası", req, {
      action: "DELETE_PRODUCT_ERROR",
      resourceId: req.params.id,
      resourceType: "Product",
      error: e.message,
    });

    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Manuel TL fiyat güncelleme
const updateAllTLPrices = async (req, res) => {
  try {
    console.log("Manuel TL fiyat güncellemesi isteği alındı");
    
    // Job durumunu kontrol et
    const status = priceUpdateJob.getStatus();
    
    if (status.isRunning) {
      return res.status(409).json({
        success: false,
        message: "Fiyat güncelleme işlemi zaten çalışıyor. Lütfen bekleyin.",
      });
    }

    // Manuel güncelleme başlat
    await priceUpdateJob.manualUpdate();
    
    res.status(200).json({
      success: true,
      message: "TL fiyat güncelleme işlemi başlatıldı.",
      status: priceUpdateJob.getStatus(),
    });
  } catch (error) {
    console.error("Manuel fiyat güncelleme hatası:", error);
    res.status(500).json({
      success: false,
      message: "Fiyat güncelleme işlemi sırasında hata oluştu.",
    });
  }
};

// Fiyat güncelleme job durumunu getir
const getPriceUpdateStatus = async (req, res) => {
  try {
    const status = priceUpdateJob.getStatus();
    
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("Job durum sorgulama hatası:", error);
    res.status(500).json({
      success: false,
      message: "Job durumu alınırken hata oluştu.",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  updateAllTLPrices,
  getPriceUpdateStatus,
};
