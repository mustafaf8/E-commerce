// client/src/components/admin-view/AdminProductCarousel.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import AdminProductTile from "./product-tile"; // Shopping yerine Admin tile
import ProductTileSkeleton from "../shopping-view/product-tile-skeleton.jsx"; // Skeleton kullanabiliriz
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

function AdminProductCarousel({
  title,
  products,
  isLoading,
  handleEditProduct, // Düzenleme fonksiyonu prop'u
  handleDeleteProduct, // Silme fonksiyonu prop'u
  handleShowAdminDetails, // Detay gösterme fonksiyonu prop'u
}) {
  const skeletonCount = 5; // Görünen iskelet sayısı
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Kaydırma durumu kontrolü (shopping-view/ProductCarousel'dan kopyalandı)
  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const tolerance = 3;
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

  // useEffect for checking scroll (shopping-view/ProductCarousel'dan kopyalandı)
  useEffect(() => {
    const timer = setTimeout(() => checkScroll(), 100);
    window.addEventListener("resize", checkScroll);
    const container = scrollContainerRef.current; // Scroll olayını ekle
    if (container) {
      container.addEventListener("scroll", checkScroll);
    }
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
      if (container) {
        container.removeEventListener("scroll", checkScroll); // Scroll olayını kaldır
      }
    };
  }, [products, isLoading, checkScroll]);

  // Kaydırma fonksiyonu (shopping-view/ProductCarousel'dan kopyalandı)
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    // Stilleri ProductCarousel'dan alabiliriz, gerekirse ayarlarız
    <section className="relative group/carousel mb-6">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
          {title}
        </h2>
        {/* "Tümü" linki admin için gereksiz, kaldırıldı */}
      </div>
      <div className="relative">
        {/* Sol Kaydırma Butonu */}
        <Button
          size="icon"
          className={cn(
            "absolute top-1/2 left-[-15px] z-20 transform -translate-y-1/2 bg-white/70 hover:bg-white border rounded-full h-8 w-8 shadow-md transition-opacity duration-300 opacity-0 group-hover/carousel:opacity-100", // Hover'da görünür yapıldı
            !isLoading && canScrollLeft ? "visible" : "invisible" // Görünürlük state'e bağlandı
          )}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft || isLoading}
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
        </Button>
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar pl-1" // Padding sol tarafa eklendi
        >
          {isLoading ? (
            Array.from({ length: skeletonCount }).map((_, index) => (
              <div
                key={`carousel-skel-${title}-${index}`}
                className="flex-shrink-0 w-60"
              >
                <ProductTileSkeleton />
              </div>
            ))
          ) : products && products.length > 0 ? (
            products.map((productItem) => (
              <div key={productItem._id} className="flex-shrink-0 w-60">
                <AdminProductTile
                  product={productItem}
                  // Admin aksiyonlarını AdminProductTile'a iletiyoruz
                  handleEdit={() => handleEditProduct(productItem)}
                  handleDelete={() => handleDeleteProduct(productItem._id)}
                  handleShowDetails={() => handleShowAdminDetails(productItem)}
                />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-6 text-gray-500">
              Bu kategoride ürün bulunamadı.
            </div>
          )}
        </div>

        {/* Sağ Kaydırma Butonu */}
        <Button
          size="icon"
          className={cn(
            "absolute top-1/2 right-[-15px] z-20 transform -translate-y-1/2 bg-white/70 hover:bg-white border rounded-full h-8 w-8 shadow-md transition-opacity duration-300 opacity-0 group-hover/carousel:opacity-100",
            !isLoading && canScrollRight ? "visible" : "invisible"
          )}
          onClick={() => scroll("right")}
          disabled={!canScrollRight || isLoading}
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-700" />
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
