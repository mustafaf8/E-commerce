import React, { useState, useRef, useEffect, useCallback } from "react";
import ShoppingProductTile from "./product-tile";
import ProductTileSkeleton from "./product-tile-skeleton.jsx";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRight } from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import isEqual from "lodash/isEqual";

function ProductCarousel({
  title,
  handleGetProductDetails,
  handleAddtoCart,
  viewAllPath,
  fetchConfig,
}) {
  const skeletonCount = 6;
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [internalProducts, setInternalProducts] = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [internalError, setInternalError] = useState(null);
  const prevFetchConfigRef = useRef();

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

  const scroll = useCallback(
    (direction) => {
      const container = scrollContainerRef.current;
      if (container) {
        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
        setTimeout(checkScroll, 350);
      }
    },
    [checkScroll]
  );

  useEffect(() => {
    if (fetchConfig && !isEqual(fetchConfig, prevFetchConfigRef.current)) {
      setInternalLoading(true);
      setInternalError(null);
      dispatch(
        fetchAllFilteredProducts({
          filterParams: fetchConfig.filterParams,
          sortParams: fetchConfig.sortParams,
        })
      )
        .unwrap()
        .then((payload) => {
          if (payload.success) {
            setInternalProducts(
              payload.data?.slice(0, fetchConfig.limit || 10) || []
            );
          } else {
            console.error(`Carousel fetch failed for ${title}:`, payload.message);
            setInternalError(payload.message || "Veri alınamadı.");
            setInternalProducts([]);
          }
        })
        .catch((error) => {
          console.error(`Carousel error for ${title}:`, error);
          setInternalError(error.message || "Bir hata oluştu.");
          setInternalProducts([]);
        })
        .finally(() => {
          setInternalLoading(false);
          setTimeout(checkScroll, 150);
        });
      prevFetchConfigRef.current = fetchConfig;
    } else if (!fetchConfig) {
      setInternalLoading(false);
      setInternalProducts([]);
      setInternalError("Fetch config eksik.");
      prevFetchConfigRef.current = fetchConfig;
    }
  }, [dispatch, fetchConfig, checkScroll, title]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      window.addEventListener("resize", checkScroll);
      const timer = setTimeout(checkScroll, 300);
      return () => {
        window.removeEventListener("resize", checkScroll);
        clearTimeout(timer);
      };
    }
  }, [checkScroll]);

  const handleViewAllClick = () => {
    if (viewAllPath) navigate(viewAllPath);
    else console.warn("ProductCarousel: viewAllPath prop'u tanımlanmamış.");
  };

  return (
    <section className="shop-section relative my-1 py-2">
      <div className="shop-container max-[1024px]:px-2">
        {/* Section header */}
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center">
            {title}
          </h2>
          
          {viewAllPath && (
            <Button 
              variant="link" 
              onClick={handleViewAllClick}
              className="text-primary p-0 h-auto font-medium text-sm flex items-center gap-1"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        
        {/* Carousel */}
        <div className="relative">
          {/* Left scroll button */}
          <Button
            size="icon"
            className={cn(
              "absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white h-8 w-8 transition-all",
              "max-md:h-7 max-md:w-7 max-md:-left-2",
              !internalLoading && canScrollLeft
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft || internalLoading}
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-700" />
          </Button>

          {/* Products container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-3 overflow-x-auto py-1 pb-3 px-1 no-scrollbar"
          >
            {internalLoading ? (
              // Skeleton loading state
              Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  key={`skel-${fetchConfig?.key || title}-${index}`}
                  className="product-carousel-item flex-shrink-0 w-[170px] sm:w-[185px] md:w-[200px]"
                >
                  <ProductTileSkeleton />
                </div>
              ))
            ) : internalError ? (
              // Error state
              <div className="w-full text-center py-10 text-red-500">
                Hata: {internalError}
              </div>
            ) : internalProducts && internalProducts.length > 0 ? (
              // Products
              internalProducts.map((productItem) => (
                <div
                  key={productItem._id}
                  className="product-carousel-item flex-shrink-0 w-[170px] sm:w-[185px] md:w-[200px]"
                >
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
              // Empty state
              <div className="w-full text-center py-10 text-gray-500">
                Bu bölümde gösterilecek ürün bulunamadı.
              </div>
            )}
          </div>

          {/* Right scroll button */}
          <Button
            size="icon"
            className={cn(
              "absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white h-8 w-8 transition-all",
              "max-md:h-7 max-md:w-7 max-md:-right-2",
              !internalLoading && canScrollRight
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
            onClick={() => scroll("right")}
            disabled={!canScrollRight || internalLoading}
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-700" />
          </Button>
        </div>
      </div>
    </section>
  );
}

ProductCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  handleGetProductDetails: PropTypes.func.isRequired,
  handleAddtoCart: PropTypes.func,
  viewAllPath: PropTypes.string,
  products: PropTypes.array,
  isLoading: PropTypes.bool,
  fetchConfig: PropTypes.shape({
    key: PropTypes.string,
    filterParams: PropTypes.object,
    sortParams: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    limit: PropTypes.number,
  }),
};

export default ProductCarousel;
