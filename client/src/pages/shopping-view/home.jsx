// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { useEffect, useState } from "react";
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

// function ShoppingHome() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const {
//     productList,
//     productDetails,
//     isLoading: productsLoading,
//   } = useSelector((state) => state.shopProducts);
//   const { featureImageList } = useSelector((state) => state.commonFeature);
//   const { promoCardList, isLoading: promoCardsLoading } = useSelector(
//     (state) => state.promoCards
//   );
//   const { isLoading: featuresLoading } = useSelector(
//     (state) => state.commonFeature
//   );
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   function handleNavigateToListingPage(getCurrentItem, section) {
//     sessionStorage.removeItem("filters");
//     const currentFilter = { [section]: [getCurrentItem.id] };
//     sessionStorage.setItem("filters", JSON.stringify(currentFilter));
//     navigate(`/shop/listing`);
//   }

//   function handleGetProductDetails(getCurrentProductId) {
//     dispatch(fetchProductDetails(getCurrentProductId));
//   }

//   function handleAddtoCart(getCurrentProductId) {
//     // Detaylı stok ve kullanıcı kontrolü eklenmeli
//     if (!user?.id) {
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
//         toast({ title: "Ürün başarıyla sepete eklendi" });
//       } else {
//         toast({
//           variant: "destructive",
//           title: data.payload?.message || "Sepete eklenemedi.",
//         });
//       }
//     });
//   }
//   // --- Promo Kart Tıklama İşleyicisi ---
//   const handlePromoCardClick = (link) => {
//     if (link) {
//       // Link varsa yeni sekmede aç veya aynı sekmede yönlendir
//       if (link.startsWith("http")) {
//         window.open(link, "_blank"); // Dış link ise yeni sekme
//       } else {
//         navigate(link); // İç link ise yönlendir
//       }
//     }
//   };

//   useEffect(() => {
//     if (productDetails !== null) setOpenDetailsDialog(true);
//   }, [productDetails]);

//   useEffect(() => {
//     if (featureImageList?.length > 1) {
//       // Sadece 1'den fazla resim varsa interval kur
//       const timer = setInterval(() => {
//         // Bu mantık, ortadaki iki banner için nasıl çalışacak? Belki sadece ilk resim değişir?
//         // Şimdilik slider mantığını koruyoruz, ama görseldeki yapıya tam uymayabilir.
//         setCurrentSlide(
//           (prevSlide) => (prevSlide + 1) % featureImageList.length
//         );
//       }, 5000);
//       return () => clearInterval(timer);
//     }
//   }, [featureImageList]);

//   useEffect(() => {
//     dispatch(
//       fetchAllFilteredProducts({
//         filterParams: {},
//         sortParams: "price-lowtohigh",
//       })
//     );
//   }, [dispatch]);

//   console.log(productList, "productList");

//   useEffect(() => {
//     dispatch(getFeatureImages());
//     dispatch(fetchPromoCards());
//     dispatch(fetchPromoCards());
//   }, [dispatch]);

//   // Ortadaki bannerlar için resimleri güvenli bir şekilde alalım
//   const mainBanner = featureImageList?.[0];
//   const sideBanner = featureImageList?.[1];

//   return (
//     // Ana container, sayfa arkaplanı ayarlandı
//     <div className="flex flex-col min-h-screen bg-gray-100 mx-15">
//       {/* BÖLÜM 1: PROMOSYON KARTLARI (Yatay Kaydırmalı) */}
//       <section className="bg-white pt-4 pb-2 shadow-sm">
//         {" "}
//         {/* Arkaplan ve padding */}
//         <div className="container mx-auto px-4">
//           {/* <h2 className="text-lg font-semibold mb-2 text-gray-700">Fırsatları Keşfet</h2> */}{" "}
//           {/* Opsiyonel Başlık */}
//           <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//             {/* Yükleniyor Durumu */}
//             {promoCardsLoading ? (
//               Array.from({ length: 8 }).map((_, index) => (
//                 <Skeleton
//                   key={index}
//                   className="flex-shrink-0 w-[140px] h-[190px] rounded-lg bg-gray-200"
//                 /> // Boyut güncellendi
//               ))
//             ) : /* Kart Listesi */
//             promoCardList && promoCardList.length > 0 ? (
//               promoCardList.map((promoCard) => (
//                 <Card
//                   key={promoCard._id}
//                   onClick={() => handlePromoCardClick(promoCard.link)}
//                   className={`relative flex-shrink-0 w-[140px] h-[190px] rounded-lg overflow-hidden ${
//                     promoCard.link ? "cursor-pointer" : ""
//                   } hover:shadow-lg transition-shadow bg-white border group`} // group eklendi
//                 >
//                   <CardContent className="p-0 h-full">
//                     <img
//                       src={promoCard.image}
//                       alt={promoCard.title || "Promosyon"}
//                       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Hover efekti
//                       loading="lazy"
//                     />
//                     {/* Başlık Overlay (İsteğe bağlı) */}
//                     {promoCard.title && (
//                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 pt-5">
//                         <span className="font-medium text-white text-xs line-clamp-2">
//                           {promoCard.title}
//                         </span>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               /* Boş Durum */
//               <div className="w-full text-center py-5 text-gray-500">
//                 Aktif fırsat yok.
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* BÖLÜM 2: ORTADAKİ BANNER ALANI (Yan Yana İki Banner) */}
//       <section className="my-4 md:my-6 container mx-auto px-4">
//         {featuresLoading ? (
//           /* Yüklenirken Skeleton */
//           <div className="flex flex-col md:flex-row gap-4 h-[300px] md:h-[350px]">
//             <Skeleton className="w-full md:w-[65%] h-full rounded-lg" />
//             <Skeleton className="w-full md:w-[35%] h-full rounded-lg" />
//           </div>
//         ) : (
//           /* Bannerlar Yüklendiğinde */
//           <div className="flex flex-col md:flex-row gap-4 items-stretch">
//             {mainBanner ? (
//               <div
//                 onClick={() => handlePromoCardClick(mainBanner.link)} // Link varsa tıklanabilir
//                 className={`w-full md:w-[65%] rounded-lg overflow-hidden shadow-sm ${
//                   mainBanner.link ? "cursor-pointer" : ""
//                 } hover:shadow-lg transition-shadow group relative`}
//               >
//                 <img
//                   src={mainBanner.image}
//                   alt={mainBanner.title || "Ana Banner"}
//                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Zoom efekti
//                   loading="lazy"
//                 />
//                 {/* Opsiyonel başlık overlay */}
//                 {mainBanner.title && (
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-3">
//                     <span className="text-white font-semibold">
//                       {mainBanner.title}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               /* Ana Banner Yoksa Placeholder */
//               <div className="w-full md:w-[65%] rounded-lg bg-gray-200 flex items-center justify-center h-[300px] md:h-auto min-h-[250px]">
//                 <span className="text-gray-400 text-sm">Ana Banner Alanı</span>
//               </div>
//             )}

//             {/* Sağ Yan Banner */}
//             {sideBanner ? (
//               <div
//                 onClick={() => handlePromoCardClick(sideBanner.link)} // Link varsa tıklanabilir
//                 className={`w-full md:w-[35%] rounded-lg overflow-hidden shadow-sm ${
//                   sideBanner.link ? "cursor-pointer" : ""
//                 } hover:shadow-lg transition-shadow group relative`}
//               >
//                 <img
//                   src={sideBanner.image}
//                   alt={sideBanner.title || "Yan Banner"}
//                   className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Zoom efekti
//                   loading="lazy"
//                 />
//                 {/* Opsiyonel başlık overlay */}
//                 {sideBanner.title && (
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-3">
//                     <span className="text-white font-semibold">
//                       {sideBanner.title}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               /* Yan Banner Yoksa Placeholder */
//               <div className="w-full md:w-[35%] rounded-lg bg-gray-200 flex items-center justify-center h-[300px] md:h-auto min-h-[250px]">
//                 <span className="text-gray-400 text-sm">Yan Banner Alanı</span>
//               </div>
//             )}
//           </div>
//         )}
//       </section>

//       {/* BÖLÜM 3: ÜRÜN LİSTELEME */}
//       <section className="py-8 bg-transparent">
//         {" "}
//         {/* Arkaplanı ana div'den alabilir */}
//         <div className="container mx-auto px-4">
//           {/* Dinamik Başlık (Görseldeki gibi sola yaslı) */}
//           <h2 className="text-xl md:text-2xl font-semibold mb-5 text-gray-800 text-left">
//             {user?.userName
//               ? `${user.userName}, sana özel öneriler`
//               : "Öne Çıkan Ürünler"}
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
//             {" "}
//             {/* Gap ayarlandı */}
//             {/* Yükleniyor Durumu */}
//             {productsLoading ? (
//               Array.from({ length: 10 }).map(
//                 (
//                   _,
//                   index // Daha fazla skeleton
//                 ) => (
//                   <div
//                     key={index}
//                     className="w-full space-y-2 bg-white p-2 rounded-lg border"
//                   >
//                     {" "}
//                     {/* Arkaplan ve border */}
//                     <Skeleton className="h-40 md:h-56 w-full rounded-md" />
//                     <Skeleton className="h-5 w-4/5" />
//                     <Skeleton className="h-4 w-1/2" />
//                     <Skeleton className="h-9 w-full" />
//                   </div>
//                 )
//               )
//             ) : /* Ürün Listesi */
//             productList && productList.length > 0 ? (
//               productList.map((productItem) => (
//                 <ShoppingProductTile
//                   key={productItem._id} // MongoDB _id varsayımı
//                   product={productItem}
//                   handleGetProductDetails={handleGetProductDetails}
//                   handleAddtoCart={handleAddtoCart}
//                 />
//               ))
//             ) : (
//               /* Ürün Yoksa */
//               <p className="col-span-full text-center py-10 text-gray-500">
//                 Gösterilecek ürün bulunamadı.
//               </p>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Ürün Detay Dialog */}
//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div> // Ana div kapanışı
//   );
// }

// export default ShoppingHome;

// client/src/pages/shopping-view/home.jsx

import { Button } from "@/components/ui/button";
// Slider ikonlarını tekrar import edelim
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchPromoCards } from "@/store/common-slice/promo-card-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSideBanners } from "@/store/common-slice/side-banner-slice";

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0); // Slider için state
  const [currentSideBannerIndex, setCurrentSideBannerIndex] = useState(0);
  const {
    productList,
    productDetails,
    isLoading: productsLoading,
  } = useSelector((state) => state.shopProducts);
  // featureImageList ve loading state'ini alıyoruz
  const { featureImageList, isLoading: featuresLoading } = useSelector(
    (state) => state.commonFeature
  );
  const { promoCardList, isLoading: promoCardsLoading } = useSelector(
    (state) => state.promoCards
  );
  const { sideBannerList, isLoading: sideBannersLoading } = useSelector(
    // Slice yoksa hata vermemesi için varsayılan değer atandı
    (state) => state.sideBanners || { sideBannerList: [], isLoading: false }
  );
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- Fonksiyonlar ---
  // handleNavigateToListingPage, handleGetProductDetails, handleAddtoCart, handlePromoCardClick
  // Bu fonksiyonlar önceki adımlardaki gibi kalabilir.
  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }
  function handleAddtoCart(getCurrentProductId) {
    if (!user?.id) {
      toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
      return;
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Ürün başarıyla sepete eklendi" });
      } else {
        toast({
          variant: "destructive",
          title: data.payload?.message || "Sepete eklenemedi.",
        });
      }
    });
  }
  const handlePromoCardClick = (link) => {
    if (link) {
      if (link.startsWith("http")) {
        window.open(link, "_blank");
      } else {
        navigate(link);
      }
    }
  };
  const handleSideBannerNav = (direction) => {
    // Liste boş veya tanımsızsa bir şey yapma
    if (!sideBannerList || sideBannerList.length === 0) return;

    const newIndex = currentSideBannerIndex + direction; // Yeni indeksi hesapla

    // İndeks sınırlarının dışına çıkarsa başa veya sona sar
    if (newIndex < 0) {
      setCurrentSideBannerIndex(sideBannerList.length - 1); // Sona git
    } else if (newIndex >= sideBannerList.length) {
      setCurrentSideBannerIndex(0); // Başa dön
    } else {
      setCurrentSideBannerIndex(newIndex); // Normal ilerle
    }
  };

  // --- useEffects ---
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Otomatik Slider Geçişi için useEffect (Doğru çalışıyor)
  useEffect(() => {
    if (featureImageList?.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(
          (prevSlide) => (prevSlide + 1) % featureImageList.length
        );
      }, 5000); // 5 saniyede bir değiştir
      return () => clearInterval(timer); // Component unmount olduğunda interval'ı temizle
    }
  }, [featureImageList]); // Sadece liste değiştiğinde veya dolduğunda çalışsın

  // İlk yüklemede verileri fetch et
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: { isFeatured: true },
        sortParams: "price-lowtohigh",
      })
    );
    dispatch(getFeatureImages());
    dispatch(fetchPromoCards());
    dispatch(fetchSideBanners());
  }, [dispatch]);
  // --- ---

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* BÖLÜM 1: PROMOSYON KARTLARI (Değişiklik yok) */}
      <section className="bg-white pt-4 pb-2 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {promoCardsLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="flex-shrink-0 w-[140px] h-[190px] rounded-lg bg-gray-200"
                />
              ))
            ) : promoCardList && promoCardList.length > 0 ? (
              promoCardList.map((promoCard) => (
                <Card
                  key={promoCard._id}
                  onClick={() => handlePromoCardClick(promoCard.link)}
                  className={`relative flex-shrink-0 w-[140px] h-[190px] rounded-lg overflow-hidden ${
                    promoCard.link ? "cursor-pointer" : ""
                  } hover:shadow-lg transition-shadow bg-white border group`}
                >
                  <CardContent className="p-0 h-full">
                    <img
                      src={promoCard.image}
                      alt={promoCard.title || "Promosyon"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {promoCard.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2 pt-5">
                        <span className="font-medium text-white text-xs line-clamp-2">
                          {promoCard.title}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="w-full text-center py-5 text-gray-500">
                Aktif fırsat yok.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BÖLÜM 2: ORTADAKİ BANNER ALANI (SOL SLIDER, SAĞ STATİK) */}
      <section className="my-4 md:my-6 container mx-auto px-4">
        {featuresLoading ? (
          <div className="flex flex-col md:flex-row gap-4 h-[300px] md:h-[350px]">
            <Skeleton className="w-full md:w-[65%] h-full rounded-lg" />
            <Skeleton className="w-full md:w-[35%] h-full rounded-lg" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {/* Sol Ana Banner (Artık Slider) */}
            <div
              className={`relative w-full md:w-[65%] rounded-lg overflow-hidden shadow-sm group bg-gray-200 min-h-[250px]`}
            >
              {featureImageList && featureImageList.length > 0 ? (
                featureImageList.map((slide, index) => (
                  <img
                    key={slide._id || index}
                    src={slide.image}
                    alt={slide.title || `Banner ${index + 1}`}
                    onClick={() => handlePromoCardClick(slide.link)}
                    className={`${
                      index === currentSlide
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0" // z-index eklendi
                    } absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                      slide.link ? "cursor-pointer" : ""
                    }`} // object-cover ve ease eklendi
                    loading="lazy"
                  />
                ))
              ) : (
                /* Resim yoksa placeholder */
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm">
                    Ana Banner Alanı
                  </span>
                </div>
              )}
              {/* Slider Navigasyon Butonları (Sol Banner üzerine) */}
              {featureImageList && featureImageList.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation(); // Resim linkine gitmeyi engelle
                      setCurrentSlide(
                        (prev) =>
                          (prev - 1 + featureImageList.length) %
                          featureImageList.length
                      );
                    }}
                    className="absolute top-1/2 left-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md" // z-index ve stil
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(
                        (prev) => (prev + 1) % featureImageList.length
                      );
                    }}
                    className="absolute top-1/2 right-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md" // z-index ve stil
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                  </Button>
                </>
              )}
            </div>
            {/* Sol Slider Div Sonu */}
            {/* Sağ Yan Banner (Statik) */}
            {/* Sağ Yan Banner (Manuel Slider) */}
            <div
              className={`relative w-full md:w-[35%] rounded-lg overflow-hidden shadow-sm group bg-gray-200 min-h-[250px]`}
            >
              {/* sideBannerList'i map et ve currentSideBannerIndex'e göre göster */}
              {sideBannerList && sideBannerList.length > 0 ? (
                sideBannerList.map((slide, index) => (
                  <img
                    key={slide._id || index}
                    src={slide.image}
                    alt={slide.title || `Yan Banner ${index + 1}`}
                    onClick={() => handlePromoCardClick(slide.link)}
                    className={`${
                      index === currentSideBannerIndex
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0" // Yeni state'e göre kontrol
                    } absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
                      slide.link ? "cursor-pointer" : ""
                    }`}
                    loading="lazy"
                  />
                ))
              ) : (
                /* Resim yoksa placeholder */
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm">
                    Yan Banner Alanı
                  </span>
                </div>
              )}

              {/* Manuel Slider Navigasyon Butonları */}
              {sideBannerList && sideBannerList.length > 1 && (
                <>
                  {/* Sol Ok (Manuel) */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSideBannerNav(-1);
                    }} // YENİ handler'ı çağırır
                    className="absolute top-1/2 left-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                  </Button>
                  {/* Sağ Ok (Manuel) */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSideBannerNav(1);
                    }} // YENİ handler'ı çağırır
                    className="absolute top-1/2 right-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* BÖLÜM 3: ÜRÜN LİSTELEME (Değişiklik yok) */}
      <section className="py-8 bg-transparent">
        {/* ... önceki koddaki gibi ... */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-semibold mb-5 text-gray-800 text-left">
            {user?.userName
              ? `${user.userName}, sana özel öneriler`
              : "Öne Çıkan Ürünler"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {productsLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full space-y-2 bg-white p-2 rounded-lg border"
                >
                  <Skeleton className="h-40 md:h-56 w-full rounded-md" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))
            ) : productList && productList.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  product={productItem}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center py-10 text-gray-500">
                Gösterilecek ürün bulunamadı.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Ürün Detay Dialog (Değişiklik yok) */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div> // Ana div kapanışı
  );
}

export default ShoppingHome;
