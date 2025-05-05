// import { Button } from "@/components/ui/button";
// import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { useNavigate } from "react-router-dom";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { useToast } from "@/components/ui/use-toast";
// import ProductDetailsDialog from "@/components/shopping-view/product-details";
// import { getFeatureImages } from "@/store/common-slice";
// import { fetchPromoCards } from "@/store/common-slice/promo-card-slice";
// import { Skeleton } from "@/components/ui/skeleton";
// import { fetchSideBanners } from "@/store/common-slice/side-banner-slice";
// import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";
// import ProductCarousel from "@/components/shopping-view/ProductCarousel";

// function ShoppingHome() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [currentSideBannerIndex, setCurrentSideBannerIndex] = useState(0);
//   const {
//     productList,
//     productDetails,
//     isLoading: productsLoading,
//   } = useSelector((state) => state.shopProducts);

//   const { featureImageList, isLoading: featuresLoading } = useSelector(
//     (state) => state.commonFeature
//   );
//   const { promoCardList, isLoading: promoCardsLoading } = useSelector(
//     (state) => state.promoCards
//   );
//   const { sideBannerList, isLoading: sideBannersLoading } = useSelector(
//     (state) => state.sideBanners || { sideBannerList: [], isLoading: false }
//   );
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

//   const { user, isAuthenticated } = useSelector((state) => state.auth);

//   // --- YENİ STATE'LER: En Çok Satanlar için ---
//   const [bestSellingProducts, setBestSellingProducts] = useState([]);
//   const [bestSellingLoading, setBestSellingLoading] = useState(true); // Başlangıçta yükleniyor

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   function handleGetProductDetails(getCurrentProductId) {
//     dispatch(fetchProductDetails(getCurrentProductId));
//   }
//   function handleAddtoCart(getCurrentProductId) {
//     if (!isAuthenticated) {
//       // isAuthenticated kontrolü eklendi
//       toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
//       return;
//     }
//     dispatch(
//       addToCart({
//         userId: user?.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast({ title: "Ürün başarıyla sepete eklendi", variant: "success" });
//       } else {
//         toast({
//           variant: "destructive",
//           title: data.payload?.message || "Sepete eklenemedi.",
//         });
//       }
//     });
//   }
//   const handlePromoCardClick = (link) => {
//     if (link) {
//       if (link.startsWith("http") || link.startsWith("https")) {
//         window.open(link, "noopener,noreferrer");
//       } else {
//         navigate(link);
//       }
//     }
//   };
//   const handleSideBannerNav = (direction) => {
//     // Liste boş veya tanımsızsa bir şey yapma
//     if (!sideBannerList || sideBannerList.length === 0) return;

//     const newIndex = currentSideBannerIndex + direction; // Yeni indeksi hesapla

//     // İndeks sınırlarının dışına çıkarsa başa veya sona sar
//     if (newIndex < 0) {
//       setCurrentSideBannerIndex(sideBannerList.length - 1); // Sona git
//     } else if (newIndex >= sideBannerList.length) {
//       setCurrentSideBannerIndex(0); // Başa dön
//     } else {
//       setCurrentSideBannerIndex(newIndex); // Normal ilerle
//     }
//   };

//   // --- useEffects ---
//   useEffect(() => {
//     if (productDetails !== null) setOpenDetailsDialog(true);
//   }, [productDetails]);

//   // Otomatik Slider Geçişi için useEffect (Doğru çalışıyor)
//   useEffect(() => {
//     if (featureImageList && featureImageList?.length > 1) {
//       const timer = setInterval(() => {
//         setCurrentSlide(
//           (prevSlide) => (prevSlide + 1) % featureImageList.length
//         );
//       }, 5000); // 5 saniyede bir değiştir
//       return () => clearInterval(timer); // Component unmount olduğunda interval'ı temizle
//     }
//   }, [featureImageList]); // Sadece liste değiştiğinde veya dolduğunda çalışsın

//   // İlk yüklemede verileri fetch et
//   // --- Ana Veri Çekme useEffect'i (En Çok Satanlar Eklendi) ---
//   useEffect(() => {
//     // Öne çıkan ürünleri (varsa) veya genel ürünleri çek (bu kısım aynı kalabilir)
//     // dispatch(fetchAllFilteredProducts({ filterParams: { isFeatured: true }, sortParams: "price-lowtohigh" })); // Veya filtre olmadan

//     // --- YENİ: En Çok Satanları Çek ---
//     setBestSellingLoading(true); // Yüklemeyi başlat
//     dispatch(
//       fetchAllFilteredProducts({
//         filterParams: {},
//         sortParams: "salesCount-desc",
//       })
//     )
//       .unwrap() // Thunk'ın sonucunu yakala
//       .then((payload) => {
//         // Thunk'tan dönen payload içindeki data'yı kontrol et
//         if (payload && payload.success && payload.data) {
//           setBestSellingProducts(payload.data); // State'i güncelle
//         } else {
//           // Başarısız olursa veya data yoksa boş dizi ata
//           setBestSellingProducts([]);
//           console.error("En çok satanlar alınamadı:", payload?.message);
//           // İsteğe bağlı: Kullanıcıya hata mesajı göster
//           // toast({ variant: "warning", title: "En çok satanlar yüklenemedi." });
//         }
//       })
//       .catch((error) => {
//         // Thunk reject olursa hatayı yakala
//         console.error("En çok satanlar alınırken hata:", error);
//         setBestSellingProducts([]);
//         // İsteğe bağlı: Kullanıcıya hata mesajı göster
//         // toast({ variant: "destructive", title: "En çok satanlar yüklenirken hata oluştu." });
//       })
//       .finally(() => {
//         setBestSellingLoading(false); // Yüklemeyi bitir
//       });
//     dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "" }));
//     dispatch(getFeatureImages());
//     dispatch(fetchPromoCards());
//     dispatch(fetchSideBanners());
//   }, [dispatch]);

//   // --- YENİ: Kadın ürünlerini filtreleme ---
//   const womenProducts = useMemo(() => {
//     if (!productList || productList.length === 0) {
//       return [];
//     }
//     return productList.filter(
//       (product) =>
//         product.category &&
//         (product.category.toLowerCase() === "women" ||
//           product.category.toLowerCase() === "kadın")
//     );
//   }, [productList]);
//   const womenProductsLoading = productsLoading;

//   // --- YENİ: Erkek ürünlerini filtreleme ---
//   const menProducts = useMemo(() => {
//     if (!productList || productList.length === 0) return [];
//     return productList.filter(
//       (product) =>
//         product.category &&
//         (product.category.toLowerCase() === "men" ||
//           product.category.toLowerCase() === "erkek")
//     );
//   }, [productList]);
//   const menProductsLoading = productsLoading;

//   // --- YENİ: Çocuk ürünlerini filtreleme ---
//   const kidsProducts = useMemo(() => {
//     if (!productList || productList.length === 0) return [];
//     return productList.filter(
//       (product) =>
//         product.category &&
//         (product.category.toLowerCase() === "kids" ||
//           product.category.toLowerCase() === "Çocuk")
//     );
//   }, [productList]);
//   const kidsProductsLoading = productsLoading;

//   // --- YENİ: Çocuk ürünlerini filtreleme ---
//   const accesProducts = useMemo(() => {
//     if (!productList || productList.length === 0) return [];
//     return productList.filter(
//       (product) =>
//         product.category &&
//         (product.category.toLowerCase() === "kids" ||
//           product.category.toLowerCase() === "Çocuk")
//     );
//   }, [productList]);
//   const accesProductsLoading = productsLoading;

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* BÖLÜM 1: PROMOSYON KARTLARI */}
//       <section className="bg-white pt-8 pb-2">
//         <div className="container mx-auto px-4 lg:px-20">
//           <div className="promo-card-container">
//             {promoCardsLoading ? (
//               // Yükleme durumu için iskelet gösterimi
//               Array.from({ length: 8 }).map((_, index) => (
//                 <Card
//                   key={`promo-skel-${index}`}
//                   className="promo-card relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 "
//                 >
//                   <Skeleton className="w-full h-full" />
//                   <div className="absolute bottom-0 left-0 right-0 p-1.5 pt-4">
//                     <Skeleton className="h-3 w-4/5 mb-1" />
//                     <Skeleton className="h-3 w-3/5" />
//                   </div>
//                 </Card>
//               ))
//             ) : promoCardList && promoCardList.length > 0 ? (
//               promoCardList.slice(0, 8).map((promoCard) => (
//                 <Card
//                   key={promoCard._id}
//                   onClick={() => handlePromoCardClick(promoCard.link)}
//                   className={`promo-card relative flex-shrink-0 rounded-lg overflow-hidden ${
//                     promoCard.link ? "cursor-pointer" : ""
//                   }`}
//                 >
//                   <CardContent className="p-0 h-full">
//                     <img
//                       src={promoCard.image}
//                       alt={promoCard.title || "Promosyon"}
//                       className="w-full h-full object-contain transition-transform duration-300 max-[850px]:p-0"
//                       loading="lazy"
//                     />
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <div className="w-full text-center py-5 text-gray-500">
//                 Deposunda Aktif fırsat yok.
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* BÖLÜM 2: ORTADAKİ BANNER ALANI (SOL SLIDER, SAĞ STATİK) */}
//       <section className="my-4 md:my-4 container mx-auto px-20 max-[1024px]:px-1">
//         {featuresLoading || sideBannersLoading ? (
//           <div className="flex flex-col md:flex-row gap-4 h-60 max-sm:h-[100px] max-md:h-[120px]">
//             {/* Daha belirgin bir gri tonu veya hafif bir animasyon eklenebilir */}
//             <Skeleton className="w-full md:w-[65%] h-full rounded-3xl bg-gray-200 animate-pulse" />
//             <Skeleton className="w-full md:w-[35%] h-full rounded-3xl bg-gray-200 animate-pulse" />
//           </div>
//         ) : (
//           <div className="flex flex-col md:flex-row gap-4 ">
//             {/* Sol Ana Banner (Artık Slider) */}
//             <div
//               className={`relative w-full md:w-[65%] rounded-3xl overflow-hidden shadow-sm group max-sm:h-32 max-md:h-48 h-60`}
//             >
//               {featureImageList && featureImageList.length > 0 ? (
//                 featureImageList.map((slide, index) => (
//                   <img
//                     key={slide._id || index}
//                     src={slide.image}
//                     alt={slide.title || `Banner ${index + 1}`}
//                     onClick={() => handlePromoCardClick(slide.link)}
//                     className={`${
//                       index === currentSlide
//                         ? "opacity-100 z-10"
//                         : "opacity-0 z-0" // z-index eklendi
//                     } absolute inset-0 w-full h-full object-center transition-opacity duration-1000 ease-in-out ${
//                       slide.link ? "cursor-pointer" : ""
//                     }`} // object-cover ve ease eklendi
//                     loading="lazy"
//                   />
//                 ))
//               ) : (
//                 /* Resim yoksa placeholder */
//                 <div className="w-full h-full flex items-center justify-center">
//                   <span className="text-gray-400 text-sm">
//                     Ana Banner Alanı
//                   </span>
//                 </div>
//               )}
//               {/* Slider Navigasyon Butonları (Sol Banner üzerine) */}
//               {featureImageList && featureImageList.length > 1 && (
//                 <>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={(e) => {
//                       e.stopPropagation(); // Resim linkine gitmeyi engelle
//                       setCurrentSlide(
//                         (prev) =>
//                           (prev - 1 + featureImageList.length) %
//                           featureImageList.length
//                       );
//                     }}
//                     className="absolute top-1/2 left-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 max-sm:h-6 max-md:h-6 max-sm:w-6 max-md:w-6" // z-index ve stil
//                   >
//                     <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setCurrentSlide(
//                         (prev) => (prev + 1) % featureImageList.length
//                       );
//                     }}
//                     className="absolute top-1/2 right-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md max-sm:h-6 max-md:h-6 max-sm:w-6 max-md:w-6" // z-index ve stil
//                   >
//                     <ChevronRightIcon className="w-5 h-5 text-gray-700" />
//                   </Button>
//                 </>
//               )}
//             </div>

//             {/* Sağ Yan Banner (Manuel Slider) */}
//             <div
//               className={`relative w-full md:w-[35%] rounded-3xl overflow-hidden shadow-sm group bg-gray-200 max-sm:h-32 max-md:h-48 h-60 max-[768px]:hidden`}
//             >
//               {/* sideBannerList'i map et ve currentSideBannerIndex'e göre göster */}
//               {sideBannerList && sideBannerList.length > 0 ? (
//                 sideBannerList.map((slide, index) => (
//                   <img
//                     key={slide._id || index}
//                     src={slide.image}
//                     alt={slide.title || `Yan Banner ${index + 1}`}
//                     onClick={() => handlePromoCardClick(slide.link)}
//                     className={`${
//                       index === currentSideBannerIndex
//                         ? "opacity-100 z-10"
//                         : "opacity-0 z-0" // Yeni state'e göre kontrol
//                     } absolute inset-0 w-full h-full object-center transition-opacity duration-300 ease-in-out ${
//                       slide.link ? "cursor-pointer" : ""
//                     }`}
//                     loading="lazy"
//                   />
//                 ))
//               ) : (
//                 /* Resim yoksa placeholder */
//                 <div className="w-full h-full flex items-center justify-center">
//                   <span className="text-gray-400 text-sm">
//                     Yan Banner Alanı
//                   </span>
//                 </div>
//               )}

//               {/* Manuel Slider Navigasyon Butonları */}
//               {sideBannerList && sideBannerList.length > 1 && (
//                 <>
//                   {/* Sol Ok (Manuel) */}
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleSideBannerNav(-1);
//                     }} // YENİ handler'ı çağırır
//                     className="absolute top-1/2 left-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md max-sm:h-6 max-md:h-6 max-sm:w-6 max-md:w-6"
//                   >
//                     <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
//                   </Button>
//                   {/* Sağ Ok (Manuel) */}
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleSideBannerNav(1);
//                     }} // YENİ handler'ı çağırır
//                     className="absolute top-1/2 right-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md max-sm:h-6 max-md:h-6 max-sm:w-6 max-md:w-6"
//                   >
//                     <ChevronRightIcon className="w-5 h-5 text-gray-700" />
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </section>

//       {/* BÖLÜM 3: YATAY KAYDIRILABİLİR ÜRÜNLER */}
//       <ProductCarousel
//         title="En Çok Satanlar"
//         products={bestSellingProducts} // Yeni state'i kullan
//         isLoading={bestSellingLoading} // Yeni loading state'ini kullan
//         handleGetProductDetails={handleGetProductDetails}
//         handleAddtoCart={handleAddtoCart}
//         viewAllPath="/shop/listing?category=men"
//       />

//       {/* --- YENİ: KADIN KATEGORİSİ CAROUSEL'I --- */}
//       {(womenProducts.length > 0 || womenProductsLoading) && (
//         <ProductCarousel
//           title="Kadın" // Başlığı güncelle
//           products={womenProducts} // Filtrelenmiş kadın ürünlerini ver
//           isLoading={womenProductsLoading} // İlgili yüklenme durumunu ver
//           handleGetProductDetails={handleGetProductDetails}
//           handleAddtoCart={handleAddtoCart}
//           viewAllPath="/shop/listing?category=men"
//         />
//       )}

//       {/* --- YENİ: ERKEK KATEGORİSİ CAROUSEL'I --- */}
//       {(menProducts.length > 0 || menProductsLoading) && (
//         <ProductCarousel
//           title="Erkek" // Başlığı güncelle
//           products={menProducts} // Filtrelenmiş erkek ürünlerini ver
//           isLoading={menProductsLoading} // İlgili yüklenme durumunu ver
//           handleGetProductDetails={handleGetProductDetails}
//           handleAddtoCart={handleAddtoCart}
//           viewAllPath="/shop/listing?category=men"
//         />
//       )}

//       {(menProducts.length > 0 || menProductsLoading) && (
//         <ProductCarousel
//           title="Çocuk" // Başlığı güncelle
//           products={kidsProducts} // Filtrelenmiş erkek ürünlerini ver
//           isLoading={kidsProductsLoading} // İlgili yüklenme durumunu ver
//           handleGetProductDetails={handleGetProductDetails}
//           handleAddtoCart={handleAddtoCart}
//           viewAllPath="/shop/listing?category=men"
//         />
//       )}
//       {(accesProducts.length > 0 || accesProductsLoading) && (
//         <ProductCarousel
//           title="Aksesuar" // Başlığı güncelle
//           products={accesProducts} // Filtrelenmiş erkek ürünlerini ver
//           isLoading={accesProductsLoading} // İlgili yüklenme durumunu ver
//           handleGetProductDetails={handleGetProductDetails}
//           handleAddtoCart={handleAddtoCart}
//           viewAllPath="/shop/listing?category=men"
//         />
//       )}

//       {/* Ürün Detay Dialog (Değişiklik yok) */}
//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div> // Ana div kapanışı
//   );
// }

// export default ShoppingHome;

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/products-slice";

import { useNavigate } from "react-router-dom";
import { addToCart } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchPromoCards } from "@/store/common-slice/promo-card-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSideBanners } from "@/store/common-slice/side-banner-slice";
import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";
import ProductCarousel from "@/components/shopping-view/ProductCarousel";
import { fetchActiveHomeSections } from "@/store/common-slice/home-sections-slice";
import React from "react"; // useCallback eklendi
import {} from "react-redux";

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Ana sayfa bölümlerini ve yüklenme durumunu Redux'tan al
  const { activeHomeSections = [], isLoading: sectionsLoading } = useSelector(
    (state) => state.homeSections || { activeHomeSections: [], isLoading: true }
  );

  // Ürünlerle ilgili state'ler (ProductCarousel kendi fetch'ini yapmayacaksa kullanılır)
  // Bu kısım, tüm ürünleri tek seferde çekip filtrelemek yerine
  // ProductCarousel'a filtre/sıralama bilgisi verip kendi verisini çekmesini sağlamak daha verimli olabilir.
  // Şimdilik ProductCarousel'un kendi fetch yapacağını varsayalım.

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // --- Handler Fonksiyonlar (Aynı kalabilir) ---
  const handleGetProductDetails = useCallback(
    (getCurrentProductId) => {
      dispatch(fetchProductDetails(getCurrentProductId));
    },
    [dispatch]
  );

  const handleAddtoCart = useCallback(
    (getCurrentProductId, getTotalStock) => {
      // ... (mevcut sepet ekleme mantığı) ...
      if (!isAuthenticated) {
        toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
        return;
      }
      // Stok kontrolü vs.
      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).then(/* ... */);
    },
    [dispatch, isAuthenticated, user?.id, toast]
  ); // Bağımlılıkları kontrol et

  // --- useEffects ---
  useEffect(() => {
    // Ana sayfa bölümlerini çek
    dispatch(fetchActiveHomeSections());
    dispatch(getFeatureImages());
    dispatch(fetchPromoCards());
    dispatch(fetchSideBanners());
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Otomatik Slider Geçişi (Aynı kalabilir)
  // ...
  return (
    <div className="flex flex-col min-h-screen">
      {/* Bölüm 1 ve 2 (Promo/Banner) aynı kalabilir */}
      {/* ... */}
      <div className="container mx-auto px-4 lg:px-20 space-y-8 py-8">
        {/* === SKELETON YÜKLEME DÜZELTMESİ === */}
        {sectionsLoading ? (
          Array.from({ length: 3 }).map(
            (
              _,
              sectionIndex // Değişken adı: sectionIndex
            ) => (
              // key içinde sectionIndex kullan
              <div key={`home-section-skel-${sectionIndex}`}>
                <Skeleton className="h-8 w-1/3 mb-4" />
                <div className="flex space-x-4 overflow-hidden pb-4">
                  {Array.from({ length: 4 }).map(
                    (
                      _,
                      productIndex // Değişken adı: productIndex
                    ) => (
                      <div
                        // key içinde sectionIndex ve productIndex kullan
                        key={`home-prod-skel-${sectionIndex}-${productIndex}`}
                        className="flex-shrink-0 w-60"
                      >
                        <ProductTileSkeleton />
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )
        ) : // === --- ===
        activeHomeSections && activeHomeSections.length > 0 ? (
          activeHomeSections.map((section) => {
            // ... (fetchConfig oluşturma aynı) ...
            let filterParams = {};
            let sortParams = "salesCount-desc";
            let fetchKey = section._id;

            if (section.contentType === "BEST_SELLING") {
              sortParams = "salesCount-desc";
              fetchKey = "best-selling";
            } else if (
              section.contentType === "CATEGORY" &&
              section.contentValue
            ) {
              filterParams = { category: [section.contentValue] };
              sortParams = "createdAt-desc";
              fetchKey = `category-${section.contentValue}`;
            } else if (
              section.contentType === "BRAND" &&
              section.contentValue
            ) {
              filterParams = { brand: [section.contentValue] };
              sortParams = "createdAt-desc";
              fetchKey = `brand-${section.contentValue}`;
            }
            // ...

            return (
              <ProductCarousel
                key={section._id} // Benzersiz key
                title={section.title} // Backend'den gelen başlık
                // ProductCarousel'un kendi fetch yapması için filtre/sıralama props'ları:
                fetchConfig={{
                  // Yeni bir prop nesnesi
                  key: fetchKey, // Bu config değiştiğinde yeniden fetch tetiklenir
                  filterParams: filterParams,
                  sortParams: sortParams,
                  limit: section.itemLimit || 10, // Backend'den gelen limit
                }}
                // --- Alternatif: Eğer home.jsx fetch yapıp products array'ini geçecekse ---
                // products={/* İlgili ürün dizisi */}
                // isLoading={/* İlgili yüklenme durumu */}
                // --- ---
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
                // viewAllPath prop'unu dinamik oluşturabilirsin, örn:
                viewAllPath={
                  section.contentType === "CATEGORY"
                    ? `/shop/listing?category=${section.contentValue}`
                    : "/shop/listing"
                }
              />
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500">
            Ana sayfada gösterilecek bölüm bulunamadı.
          </div>
        )}
      </div>

      {/* Ürün Detay Dialog (Aynı kalabilir) */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
