// import { useState, useRef, useEffect, useCallback } from "react"; // useCallback eklendi
// import ShoppingProductTile from "./product-tile";
// import ProductTileSkeleton from "./product-tile-skeleton.jsx";
// import { Button } from "@/components/ui/button";
// import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
// import PropTypes from "prop-types";
// import { cn } from "@/lib/utils"; // cn utility'sini import et
// import { useMemo } from "react"; // useMemo eklendi
// import { useNavigate } from "react-router-dom";

// function ProductCarousel({
//   title,
//   products,
//   isLoading,
//   handleGetProductDetails,
//   handleAddtoCart,
//   viewAllPath,
// }) {
//   const skeletonCount = 6;
//   const scrollContainerRef = useRef(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);
//   const navigate = useNavigate();

//   // Kaydırma durumunu kontrol eden fonksiyon
//   const checkScroll = useCallback(() => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       const { scrollLeft, scrollWidth, clientWidth } = container;
//       const tolerance = 5; // Küçük hatalar için tolerans

//       setCanScrollLeft(scrollLeft > tolerance);
//       setCanScrollRight(
//         scrollWidth > clientWidth &&
//           scrollLeft < scrollWidth - clientWidth - tolerance
//       );
//     } else {
//       setCanScrollLeft(false);
//       setCanScrollRight(false);
//     }
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       checkScroll();
//     }, 100);
//     window.addEventListener("resize", checkScroll);
//     return () => {
//       clearTimeout(timer);
//       window.removeEventListener("resize", checkScroll);
//     };
//   }, [products, isLoading, checkScroll]);

//   const scroll = (direction) => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       const scrollAmount = container.clientWidth * 0.8;
//       const newScrollLeft =
//         direction === "left"
//           ? container.scrollLeft - scrollAmount
//           : container.scrollLeft + scrollAmount;

//       container.scrollTo({
//         left: newScrollLeft,
//         behavior: "smooth", // Yumuşak kaydırma efekti
//       });
//       setTimeout(checkScroll, 350);
//     }
//   };
//   const handleViewAllClick = () => {
//     if (viewAllPath) {
//       navigate(viewAllPath); // Prop olarak gelen yola yönlendir
//     } else {
//       console.warn("ProductCarousel: viewAllPath prop'u tanımlanmamış.");
//       // İsteğe bağlı: Varsayılan bir sayfaya yönlendirilebilir navigate('/shop/listing');
//     }
//   };
//   return (
//     <section className=" bg-transparent relative group/carousel pl-1">
//       <div className="container mx-auto px-16 max-[1024px]:px-1 ">
//         <div className="flex items-center justify-between p-3 mb-0">
//           <h1 className="text-2xl md:text-xl font-bold mb-0 text-gray-800 max-[400px]:text-lg max-[400px]:font-semibold">
//             {title}
//           </h1>
//           <h1 className="flex items-end justify-center text-sm font-semibold text-red-600 cursor-pointer hover:text-gray-700 transition duration-200 ease-in-out">
//             <p onClick={handleViewAllClick}>Tümü</p>
//             <ChevronRightIcon className="w-4 h-4 font-semibold text-red-600 " />
//           </h1>
//         </div>
//         <div className="flex items-center justify-between relative">
//           {/* Sol Kaydırma Butonu */}
//           <Button
//             size="icon"
//             className={cn(
//               "absolute top-1/2 left-0 md:left-[-15px] z-20 transform -translate-y-[60%] bg-white/70 hover:bg-white border-2 border-gray-300 rounded-full h-8 w-8 shadow-xl transition-opacity duration-300 max-[1024px]:hidden",

//               !isLoading && canScrollLeft
//                 ? "opacity-100"
//                 : "opacity-0 pointer-events-none" // Kaydırma mümkünse göster, değilse gizle ve tıklamayı engelle
//             )}
//             onClick={() => scroll("left")}
//             disabled={!canScrollLeft || isLoading} // Kaydırma mümkün değilse veya yükleniyorsa devre dışı bırak
//           >
//             <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
//           </Button>
//           {/* Kaydırılabilir Alan */}
//           <div
//             ref={scrollContainerRef}
//             onScroll={checkScroll} // Scroll olayında durumu kontrol et
//             className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar" // scrollbar-* sınıfları kaldırıldı, no-scrollbar eklendi
//           >
//             {isLoading ? (
//               Array.from({ length: skeletonCount }).map((_, index) => (
//                 <div
//                   key={`carousel-skel-${index}`}
//                   className="flex-shrink-0 w-60 max-sm:w-48 max-md:w-48"
//                 >
//                   <ProductTileSkeleton />
//                 </div>
//               ))
//             ) : products && products.length > 0 ? (
//               products.map((productItem) => (
//                 <div
//                   key={productItem._id}
//                   className="flex-shrink-0 w-60 max-sm:w-48 max-md:w-48"
//                 >
//                   <ShoppingProductTile
//                     product={productItem}
//                     handleGetProductDetails={handleGetProductDetails}
//                     handleAddtoCart={() =>
//                       handleAddtoCart(productItem._id, productItem.totalStock)
//                     }
//                   />
//                 </div>
//               ))
//             ) : (
//               <div className="w-full text-center py-10 text-gray-500">
//                 Bu bölümde gösterilecek ürün bulunamadı.
//               </div>
//             )}
//           </div>
//           {/* Sağ Kaydırma Butonu */}
//           <Button
//             size="icon"
//             className={cn(
//               "absolute top-1/2 right-0 md:right-[-15px] max-[1024px]:right-[15px] z-20 transform -translate-y-[60%] bg-white/70 hover:bg-white border-2 border-gray-300 rounded-full h-8 w-8 shadow-lg transition-opacity duration-300 max-sm:h-6 max-md:h-6 max-sm:w-6 max-md:w-6",
//               !isLoading && canScrollRight
//                 ? "opacity-100"
//                 : "opacity-0 pointer-events-none" // Kaydırma mümkünse göster, değilse gizle ve tıklamayı engelle
//             )}
//             onClick={() => scroll("right")}
//             disabled={!canScrollRight || isLoading} // Kaydırma mümkün değilse veya yükleniyorsa devre dışı bırak
//           >
//             <ChevronRightIcon className="w-5 h-5 text-gray-700" />
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// }

// ProductCarousel.propTypes = {
//   title: PropTypes.string.isRequired,
//   products: PropTypes.array,
//   isLoading: PropTypes.bool,
//   handleGetProductDetails: PropTypes.func.isRequired,
//   handleAddtoCart: PropTypes.func.isRequired,
//   viewAllPath: PropTypes.string,
// };

// export default ProductCarousel;

// client/src/components/shopping-view/ProductCarousel.jsx
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import ShoppingProductTile from "./product-tile";
import ProductTileSkeleton from "./product-tile-skeleton.jsx";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Redux importları
import { fetchAllFilteredProducts } from "@/store/shop/products-slice"; // Fetch action
import isEqual from "lodash/isEqual"; // Derin karşılaştırma için

// Önceki kaydırma mantığı aynı kalabilir...
function ProductCarousel({
  title,
  handleGetProductDetails,
  handleAddtoCart,
  viewAllPath,
  fetchConfig, // YENİ PROP: { key, filterParams, sortParams, limit }
}) {
  const skeletonCount = 6;
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Dispatch hook'u
  const [internalProducts, setInternalProducts] = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [internalError, setInternalError] = useState(null);
  const prevFetchConfigRef = useRef(); // Önceki config'i takip etmek için ref

  // Kaydırma durumunu kontrol etme (Aynı kalabilir)
  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const tolerance = 5;
      setCanScrollLeft(scrollLeft > tolerance);
      setCanScrollRight(
        scrollWidth > clientWidth &&
          scrollLeft < scrollWidth - clientWidth - tolerance
      );
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, []);

  // Kaydırma fonksiyonu (Aynı kalabilir)
  const scroll = useCallback(
    (direction) => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
        setTimeout(checkScroll, 350); // Animasyon sonrası kontrol
      }
    },
    [checkScroll]
  );

  // --- YENİ useEffect: Veri Çekme ---
  useEffect(() => {
    // fetchConfig değiştiğinde veya ilk render'da çalışır
    // Derin karşılaştırma ile gereksiz fetch'leri önle
    if (fetchConfig && !isEqual(fetchConfig, prevFetchConfigRef.current)) {
      // console.log(`Workspaceing for ${title} with key: ${fetchConfig.key}`);
      setInternalLoading(true);
      setInternalError(null);
      dispatch(
        fetchAllFilteredProducts({
          filterParams: fetchConfig.filterParams,
          sortParams: fetchConfig.sortParams,
          // limit: fetchConfig.limit // Limit parametresini backend'e gönderme (opsiyonel)
        })
      )
        .unwrap()
        .then((payload) => {
          if (payload.success) {
            // Limit'i frontend'de uygula (eğer backend desteklemiyorsa)
            setInternalProducts(
              payload.data?.slice(0, fetchConfig.limit || 10) || []
            );
          } else {
            console.error(`Workspace failed for ${title}:`, payload.message);
            setInternalError(payload.message || "Veri alınamadı.");
            setInternalProducts([]);
          }
        })
        .catch((error) => {
          console.error(`Workspace error for ${title}:`, error);
          setInternalError(error.message || "Bir hata oluştu.");
          setInternalProducts([]);
        })
        .finally(() => {
          setInternalLoading(false);
          // Kaydırma butonlarını güncellemek için fetch sonrası checkScroll çağır
          setTimeout(checkScroll, 150); // Veri render olduktan sonra çalışsın diye küçük bir gecikme
        });
      prevFetchConfigRef.current = fetchConfig; // Mevcut config'i sakla
    } else if (!fetchConfig) {
      // Eğer fetchConfig gelmediyse yüklemeyi bitir, boş göster
      setInternalLoading(false);
      setInternalProducts([]);
      setInternalError("Fetch config eksik.");
      prevFetchConfigRef.current = fetchConfig;
    }
  }, [dispatch, fetchConfig, checkScroll]); // checkScroll'u da ekleyelim

  // Pencere resize event listener (Aynı kalabilir)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      window.addEventListener("resize", checkScroll);
      // Initial check
      const timer = setTimeout(checkScroll, 300);
      return () => {
        window.removeEventListener("resize", checkScroll);
        clearTimeout(timer);
      };
    }
  }, [checkScroll]); // Bağımlılık doğru

  const handleViewAllClick = () => {
    if (viewAllPath) navigate(viewAllPath);
    else console.warn("ProductCarousel: viewAllPath prop'u tanımlanmamış.");
  };

  return (
    <section className="bg-transparent relative group/carousel ">
      <div className="container mx-auto px-0 max-[1024px]:px-1 ">
        <div className="flex items-center justify-between p-3 mb-0">
          <h1 className="text-2xl md:text-xl font-bold mb-0 text-gray-800 max-[400px]:text-lg max-[400px]:font-semibold pl-2">
            {title}
          </h1>
          {viewAllPath && (
            <h1 className="flex items-end justify-center text-sm font-semibold text-red-600 cursor-pointer hover:text-gray-700 transition duration-200 ease-in-out">
              <p onClick={handleViewAllClick}>Tümü</p>
              <ChevronRightIcon className="w-4 h-4 font-semibold text-red-600 " />
            </h1>
          )}
        </div>
        <div className="flex items-center justify-start relative">
          <Button
            size="icon"
            className={cn(
              /* ... */ !internalLoading && canScrollLeft
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft || internalLoading} // internalLoading ekle
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </Button>

          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar"
          >
            {internalLoading ? (
              Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  key={`skel-${fetchConfig?.key || title}-${index}`}
                  className="flex-shrink-0 w-60 max-sm:w-48 max-md:w-48"
                >
                  <ProductTileSkeleton />
                </div>
              ))
            ) : internalError ? (
              <div className="w-full text-center py-10 text-red-500">
                Hata: {internalError}
              </div>
            ) : internalProducts && internalProducts.length > 0 ? ( // internalProducts kullan
              internalProducts.map((productItem) => (
                <div
                  key={productItem._id}
                  className="flex-shrink-0 w-60 max-sm:w-48 max-md:w-48"
                >
                  <ShoppingProductTile
                    product={productItem}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={() =>
                      handleAddtoCart(productItem._id, productItem.totalStock)
                    } // handleAddtoCart'ı düzelt
                  />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-10 text-gray-500">
                Bu bölümde gösterilecek ürün bulunamadı.
              </div>
            )}
          </div>

          <Button
            size="icon"
            className={cn(
              /* ... */ !internalLoading && canScrollRight
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
            onClick={() => scroll("right")}
            disabled={!canScrollRight || internalLoading} // internalLoading ekle
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </Button>
        </div>
      </div>
    </section>
  );
}

ProductCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  // products prop'u kaldırıldı
  // isLoading prop'u kaldırıldı
  handleGetProductDetails: PropTypes.func.isRequired,
  handleAddtoCart: PropTypes.func.isRequired,
  viewAllPath: PropTypes.string,
  fetchConfig: PropTypes.shape({
    // Yeni prop tipi
    key: PropTypes.string.isRequired, // Yeniden fetch için anahtar
    filterParams: PropTypes.object,
    sortParams: PropTypes.string,
    limit: PropTypes.number,
  }).isRequired,
};

export default React.memo(ProductCarousel); // Performans için memoize et
