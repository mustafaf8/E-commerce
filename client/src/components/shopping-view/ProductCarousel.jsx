// client/src/components/shopping-view/ProductCarousel.jsx
import React, { useState, useRef, useEffect, useCallback } from "react"; // useCallback eklendi
import ShoppingProductTile from "./product-tile";
import ProductTileSkeleton from "./product-tile-skeleton.jsx";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils"; // cn utility'sini import et

function ProductCarousel({
  title,
  products,
  isLoading,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const skeletonCount = 6;
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Kaydırma durumunu kontrol eden fonksiyon
  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const tolerance = 5; // Küçük hatalar için tolerans

      setCanScrollLeft(scrollLeft > tolerance);
      setCanScrollRight(
        scrollWidth > clientWidth &&
          scrollLeft < scrollWidth - clientWidth - tolerance
      );
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, []); // Bağımlılık yok, çünkü sadece ref'i kullanıyor

  // Bileşen yüklendiğinde ve ürünler değiştiğinde scroll durumunu kontrol et
  useEffect(() => {
    // Ürünler yüklendikten sonra veya değiştiğinde kısa bir gecikme ile kontrol et
    // Bu, DOM'un güncellenmesine zaman tanır
    const timer = setTimeout(() => {
      checkScroll();
    }, 100); // 100ms gecikme

    // Resize olayını dinle, pencere boyutu değişince de kontrol et
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
    // isLoading ve products değiştiğinde yeniden çalıştır
  }, [products, isLoading, checkScroll]);

  // Kaydırma fonksiyonu
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      // Ne kadar kaydırılacak? Genellikle görünür alan kadar veya biraz daha azı iyi çalışır.
      const scrollAmount = container.clientWidth * 0.8; // Görünür alanın %80'i kadar kaydır
      const newScrollLeft =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth", // Yumuşak kaydırma efekti
      });

      // scrollTo asenkron olabilir ve anında scroll event'i tetiklemeyebilir.
      // Bu yüzden buton durumunu kısa bir gecikmeyle güncelliyoruz.
      setTimeout(checkScroll, 350); // smooth behavior süresine yakın bir gecikme
    }
  };

  return (
    <section className=" bg-transparent relative group/carousel">
      <div className="container mx-auto px-20 max-[1024px]:px-2">
        <div className="flex items-center justify-between mb-0">
          <h2 className="text-xl md:text-2xl font-semibold mb-5 text-gray-800 text-left">
            {title}
          </h2>
          <h1 className="flex items-center text-sm md:text-base font-semibold text-red-600 cursor-pointer hover:text-gray-700 transition duration-200 ease-in-out">
            Tüm Ürünler <ChevronRightIcon className="w-5 h-5 text-gray-500" />
          </h1>
        </div>

        {/* Kaydırılabilir Alan */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll} // Scroll olayında durumu kontrol et
          className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar" // scrollbar-* sınıfları kaldırıldı, no-scrollbar eklendi
        >
          {isLoading ? (
            Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={`carousel-skel-${index}`}
                className="flex-shrink-0 w-60 md:w-64"
              >
                <ProductTileSkeleton />
              </div>
            ))
          ) : products && products.length > 0 ? (
            products.map((productItem) => (
              <div key={productItem._id} className="flex-shrink-0 w-60 md:w-64">
                <ShoppingProductTile
                  product={productItem}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={() =>
                    handleAddtoCart(productItem._id, productItem.totalStock)
                  }
                />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-10 text-gray-500">
              Bu bölümde gösterilecek ürün bulunamadı.
            </div>
          )}
        </div>
      </div>
      {/* Sol Kaydırma Butonu */}
      <Button
        size="icon"
        className={cn(
          "absolute top-1/2 left-0 md:left-28 z-20 transform -translate-y-[60%] bg-white/70 hover:bg-white border-2 border-gray-400 rounded-full h-8 w-8 shadow-xl transition-opacity duration-300",

          !isLoading && canScrollLeft
            ? "opacity-100"
            : "opacity-0 pointer-events-none" // Kaydırma mümkünse göster, değilse gizle ve tıklamayı engelle
        )}
        onClick={() => scroll("left")}
        disabled={!canScrollLeft || isLoading} // Kaydırma mümkün değilse veya yükleniyorsa devre dışı bırak
      >
        <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
      </Button>
      {/* Sağ Kaydırma Butonu */}
      <Button
        size="icon"
        className={cn(
          "absolute top-1/2 right-0 md:right-28 z-20 transform -translate-y-[60%] bg-white/70 hover:bg-white border-2 border-gray-400 rounded-full h-8 w-8 shadow-lg transition-opacity duration-300",
          !isLoading && canScrollRight
            ? "opacity-100"
            : "opacity-0 pointer-events-none" // Kaydırma mümkünse göster, değilse gizle ve tıklamayı engelle
        )}
        onClick={() => scroll("right")}
        disabled={!canScrollRight || isLoading} // Kaydırma mümkün değilse veya yükleniyorsa devre dışı bırak
      >
        <ChevronRightIcon className="w-5 h-5 text-gray-700" />
      </Button>
    </section>
  );
}

ProductCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array,
  isLoading: PropTypes.bool,
  handleGetProductDetails: PropTypes.func.isRequired,
  handleAddtoCart: PropTypes.func.isRequired,
};

export default ProductCarousel;
