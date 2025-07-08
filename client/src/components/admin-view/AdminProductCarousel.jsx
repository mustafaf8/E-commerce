import { useState, useRef, useEffect, useCallback } from "react"; // useCallback ekledim
import AdminProductTile from "./product-tile";
import ProductTileSkeleton from "../shopping-view/product-tile-skeleton.jsx";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function AdminProductCarousel({
  title,
  products,
  isLoading,
  handleEditProduct,
  handleDeleteProduct,
  handleShowAdminDetails,
  canManage,
}) {
  const skeletonCount = 5;
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const timer = setTimeout(checkScroll, 300);

      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

      return () => {
        clearTimeout(timer);
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [products, isLoading, checkScroll]);
  const scroll = useCallback(
    (direction) => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollAmount = container.clientWidth * 0.8;
        const newScrollLeft =
          direction === "left"
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
        setTimeout(checkScroll, 350);
      }
    },
    [checkScroll]
  );

  return (
    <section className="relative mb-6 border rounded-lg shadow-sm bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-bold text-gray-800 capitalize">
          {title} ({products?.length || 0} ürün)
        </h2>
      </div>
      <div className="relative w-full overflow-hidden p-4">
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute left-1 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white/80 hover:bg-white h-8 w-8 transition-opacity duration-300",
            !isLoading && canScrollLeft
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          )}
          onClick={() => scroll("left")}
          disabled={!canScrollLeft || isLoading}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 no-scrollbar"
          onScroll={checkScroll}
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
                <AdminProductTile
                  product={product}
                  handleEdit={() => handleEditProduct(product)}
                  handleDelete={() => handleDeleteProduct(product._id)}
                  handleShowDetails={() => handleShowAdminDetails(product)}
                  canManage={canManage}
                />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-6 text-gray-500">
              Bu kategoride ürün bulunamadı.
            </div>
          )}
        </div>
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
  canManage: PropTypes.bool.isRequired,
};

export default AdminProductCarousel;
