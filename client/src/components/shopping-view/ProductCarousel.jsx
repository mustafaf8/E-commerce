import React, { useState, useRef, useEffect, useCallback } from "react";
import ShoppingProductTile from "./product-tile";
import ProductTileSkeleton from "./product-tile-skeleton.jsx";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
          setTimeout(checkScroll, 150);
        });
      prevFetchConfigRef.current = fetchConfig;
    } else if (!fetchConfig) {
      setInternalLoading(false);
      setInternalProducts([]);
      setInternalError("Fetch config eksik.");
      prevFetchConfigRef.current = fetchConfig;
    }
  }, [dispatch, fetchConfig, checkScroll]);

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
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg bg-white/60 hover:bg-white h-8 w-8 transition-opacity duration-300",
              !internalLoading && canScrollLeft
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft || internalLoading}
          >
            <ChevronLeftIcon className="w-5 h-5 text-black" />
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
            ) : internalProducts && internalProducts.length > 0 ? (
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

          <Button
            size="icon"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg bg-white/60 hover:bg-white h-8 w-8 transition-opacity duration-300",
              !internalLoading && canScrollRight
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            )}
            onClick={() => scroll("right")}
            disabled={!canScrollRight || internalLoading}
          >
            <ChevronRightIcon className="w-5 h-5 text-black" />
          </Button>
        </div>
      </div>
    </section>
  );
}

ProductCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  handleGetProductDetails: PropTypes.func.isRequired,
  handleAddtoCart: PropTypes.func.isRequired,
  viewAllPath: PropTypes.string,
  fetchConfig: PropTypes.shape({
    key: PropTypes.string.isRequired,
    filterParams: PropTypes.object,
    sortParams: PropTypes.string,
    limit: PropTypes.number,
  }).isRequired,
};

export default React.memo(ProductCarousel);
