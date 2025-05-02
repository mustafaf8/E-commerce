// // Debugging version of AdminProductCarousel.jsx
// import { useState, useRef, useEffect } from "react";
// import AdminProductTile from "./product-tile";
// import ProductTileSkeleton from "../shopping-view/product-tile-skeleton.jsx";
// import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
// import PropTypes from "prop-types";
// import { Button } from "../ui/button";

// function AdminProductCarousel({
//   title,
//   products,
//   isLoading,
//   handleEditProduct,
//   handleDeleteProduct,
//   handleShowAdminDetails,
// }) {
//   const skeletonCount = 5;
//   const scrollContainerRef = useRef(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true); // Start with true to show right button

//   // Check scroll position
//   const checkScroll = () => {
//     console.log("Checking scroll position"); // Debug log
//     const container = scrollContainerRef.current;
//     if (container) {
//       const { scrollLeft, scrollWidth, clientWidth } = container;
//       console.log(
//         `scrollLeft: ${scrollLeft}, scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`
//       ); // Debug values

//       // Check if we can scroll left
//       setCanScrollLeft(scrollLeft > 5);

//       // Check if we can scroll right
//       setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);

//       console.log(
//         `canScrollLeft: ${scrollLeft > 5}, canScrollRight: ${
//           scrollLeft < scrollWidth - clientWidth - 5
//         }`
//       ); // Debug result
//     }
//   };

//   // Handle scroll event
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       console.log("Setting up scroll listeners"); // Debug log

//       // Initial check
//       setTimeout(() => {
//         checkScroll();
//         console.log("Initial scroll check complete"); // Debug log
//       }, 200);

//       // Event listeners
//       container.addEventListener("scroll", checkScroll);
//       window.addEventListener("resize", checkScroll);

//       return () => {
//         container.removeEventListener("scroll", checkScroll);
//         window.removeEventListener("resize", checkScroll);
//       };
//     }
//   }, [products, isLoading]);

//   // Re-check scroll when products change
//   useEffect(() => {
//     console.log("Products changed, re-checking scroll"); // Debug log
//     setTimeout(checkScroll, 200);
//   }, [products]);

//   // Scroll left or right
//   const handleScroll = (direction) => {
//     console.log(`Scrolling ${direction}`); // Debug log
//     const container = scrollContainerRef.current;
//     if (container) {
//       const scrollAmount = direction === "left" ? -300 : 300; // Fixed pixel amount for consistent behavior
//       container.scrollBy({ left: scrollAmount, behavior: "smooth" });
//     }
//   };

//   return (
//     <section className="relative w-full mb-6 border-b pb-2">
//       {/* Category title */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold text-gray-800 capitalize">{title}</h2>
//       </div>

//       {/* Carousel container with absolute positioned buttons */}
//       <div className="relative w-full">
//         {/* Left scroll button - only show when we can scroll left */}
//         {canScrollLeft && (
//           <Button
//             variant="secondary"
//             size="icon"
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white/80 hover:bg-white"
//             onClick={() => handleScroll("left")}
//           >
//             <ChevronLeftIcon className="h-5 w-5" />
//           </Button>
//         )}

//         {/* Scrollable product container */}
//         <div
//           ref={scrollContainerRef}
//           className="flex gap-4 overflow-x-auto scroll-smooth pb-4 px-8"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           onScroll={() => checkScroll()}
//         >
//           {isLoading ? (
//             /* Loading skeletons */
//             Array.from({ length: skeletonCount }).map((_, index) => (
//               <div key={`skeleton-${index}`} className="flex-shrink-0 w-60">
//                 <ProductTileSkeleton />
//               </div>
//             ))
//           ) : products && products.length > 0 ? (
//             /* Product tiles */
//             products.map((product) => (
//               <div key={product._id} className="flex-shrink-0 w-60">
//                 <AdminProductTile
//                   product={product}
//                   handleEdit={() => handleEditProduct(product)}
//                   handleDelete={() => handleDeleteProduct(product._id)}
//                   handleShowDetails={() => handleShowAdminDetails(product)}
//                 />
//               </div>
//             ))
//           ) : (
//             /* No products message */
//             <div className="w-full text-center py-6 text-gray-500">
//               Bu kategoride ürün bulunamadı.
//             </div>
//           )}
//         </div>

//         {/* Right scroll button - only show when we can scroll right */}
//         {canScrollRight && (
//           <Button
//             variant="secondary"
//             size="icon"
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white/80 hover:bg-white"
//             onClick={() => handleScroll("right")}
//           >
//             <ChevronRightIcon className="h-5 w-5" />
//           </Button>
//         )}
//       </div>
//     </section>
//   );
// }

// AdminProductCarousel.propTypes = {
//   title: PropTypes.string.isRequired,
//   products: PropTypes.array,
//   isLoading: PropTypes.bool,
//   handleEditProduct: PropTypes.func.isRequired,
//   handleDeleteProduct: PropTypes.func.isRequired,
//   handleShowAdminDetails: PropTypes.func.isRequired,
// };

// export default AdminProductCarousel;

// src/components/admin-view/AdminProductCarousel.jsx
import { useState, useRef, useEffect, useCallback } from "react"; // useCallback ekledim
import AdminProductTile from "./product-tile";
import ProductTileSkeleton from "../shopping-view/product-tile-skeleton.jsx";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils"; // cn importu

function AdminProductCarousel({
  title,
  products,
  isLoading,
  handleEditProduct,
  handleDeleteProduct,
  handleShowAdminDetails,
}) {
  const skeletonCount = 5;
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false); // Başlangıçta false yapalım, kontrol sonrası güncellensin

  // Kaydırma durumunu kontrol eden fonksiyon (useCallback ile optimize edildi)
  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const tolerance = 5; // Küçük hatalar için tolerans

      // Sola kaydırma kontrolü
      setCanScrollLeft(scrollLeft > tolerance);

      // Sağa kaydırma kontrolü (scrollWidth, clientWidth'den BÜYÜK olmalı)
      setCanScrollRight(
        scrollWidth > clientWidth &&
          scrollLeft < scrollWidth - clientWidth - tolerance
      );
    } else {
      // Container yoksa butonları gizle
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, []); // Bağımlılık yok

  // İlk render ve ürün/loading değiştiğinde kontrol et
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Gecikmeli ilk kontrol (layout oturması için)
      const timer = setTimeout(checkScroll, 300); // Biraz daha uzun süre verelim

      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll); // Pencere boyutu değişince de kontrol et

      return () => {
        clearTimeout(timer);
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [products, isLoading, checkScroll]); // Bağımlılıklar doğru

  // Scroll fonksiyonu (optimize edildi)
  const scroll = useCallback(
    (direction) => {
      const container = scrollContainerRef.current;
      if (container) {
        // Container genişliğinin %80'i kadar kaydır
        const scrollAmount = container.clientWidth * 0.8;
        const newScrollLeft =
          direction === "left"
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
        // Kaydırma sonrası buton durumunu hemen güncellemek için gecikmeli kontrol
        setTimeout(checkScroll, 350); // scroll animasyonu bittikten sonra
      }
    },
    [checkScroll]
  ); // checkScroll'a bağımlı

  return (
    // w-full kaldırıldı, genişliği parent belirleyecek
    <section className="relative mb-6 border rounded-lg shadow-sm bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold text-gray-800 capitalize">
          {title} ({products?.length || 0} ürün)
        </h2>
      </div>

      {/* Carousel container */}
      {/* relative ve overflow-hidden eklendi */}
      <div className="relative w-full overflow-hidden p-4">
        {/* Sol kaydırma butonu */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute left-1 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white/80 hover:bg-white h-8 w-8 transition-opacity duration-300",
            // Sadece kaydırma mümkünse göster
            !isLoading && canScrollLeft
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          )}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft || isLoading}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>

        {/* Kaydırılabilir ürün container'ı */}
        <div
          ref={scrollContainerRef}
          // px-8 kaldırıldı, padding parent'tan geliyor
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 no-scrollbar"
          // scrollbar gizleme class'ı eklendi
          onScroll={checkScroll} // onScroll event'i eklendi
        >
          {isLoading ? (
            Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex-shrink-0 w-60">
                <ProductTileSkeleton />
              </div>
            ))
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-60">
                {" "}
                {/* w-60 ile genişlik sabitlendi */}
                <AdminProductTile
                  product={product}
                  handleEdit={() => handleEditProduct(product)}
                  handleDelete={() => handleDeleteProduct(product._id)}
                  handleShowDetails={() => handleShowAdminDetails(product)}
                />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-6 text-gray-500">
              Bu kategoride ürün bulunamadı.
            </div>
          )}
        </div>

        {/* Sağ kaydırma butonu */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white/80 hover:bg-white h-8 w-8 transition-opacity duration-300",
            !isLoading && canScrollRight
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          )}
          onClick={() => scroll("right")}
          disabled={!canScrollRight || isLoading}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}

AdminProductCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array,
  isLoading: PropTypes.bool,
  handleEditProduct: PropTypes.func.isRequired,
  handleDeleteProduct: PropTypes.func.isRequired,
  handleShowAdminDetails: PropTypes.func.isRequired,
};

export default AdminProductCarousel;
