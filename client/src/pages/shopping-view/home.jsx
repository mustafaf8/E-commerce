import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchPromoCards } from "@/store/common-slice/promo-card-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSideBanners } from "@/store/common-slice/side-banner-slice";
import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";
import ProductCarousel from "@/components/shopping-view/ProductCarousel";
import { fetchActiveHomeSections } from "@/store/common-slice/home-sections-slice";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSideBannerIndex, setCurrentSideBannerIndex] = useState(0);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList, isLoading: featuresLoading } = useSelector(
    (state) => state.commonFeature
  );
  const { promoCardList, isLoading: promoCardsLoading } = useSelector(
    (state) => state.promoCards
  );
  const { sideBannerList, isLoading: sideBannersLoading } = useSelector(
    (state) => state.sideBanners || { sideBannerList: [], isLoading: false }
  );
  const { activeHomeSections = [], isLoading: sectionsLoading } = useSelector(
    (state) => state.homeSections || { activeHomeSections: [], isLoading: true }
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleGetProductDetails = useCallback(
    (getCurrentProductId) => {
      dispatch(fetchProductDetails(getCurrentProductId));
    },
    [dispatch]
  );
  const handlePromoCardClick = (link) => {
    if (link) {
      if (link.startsWith("http") || link.startsWith("https")) {
        window.open(link, "noopener,noreferrer");
      } else {
        navigate(link);
      }
    }
  };
  const handleSideBannerNav = (direction) => {
    if (!sideBannerList || sideBannerList.length === 0) return;
    const newIndex = currentSideBannerIndex + direction;
    if (newIndex < 0) {
      setCurrentSideBannerIndex(sideBannerList.length - 1);
    } else if (newIndex >= sideBannerList.length) {
      setCurrentSideBannerIndex(0);
    } else {
      setCurrentSideBannerIndex(newIndex);
    }
  };

  function handleAddtoCart(getCurrentProductId) {
    if (!isAuthenticated) {
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
        toast({ title: "Ürün başarıyla sepete eklendi", variant: "success" });
      } else {
        toast({
          variant: "destructive",
          title: data.payload?.message || "Sepete eklenemedi.",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(fetchActiveHomeSections());
    dispatch(getFeatureImages());
    dispatch(fetchPromoCards());
    dispatch(fetchSideBanners());
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <section className=" pt-8 pb-2">
        <div className="container mx-auto px-4 lg:px-20">
          <div className="promo-card-container ">
            {promoCardsLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Card
                  key={`promo-skel-${index}`}
                  className="promo-card px-2 relative flex-shrink-0 rounded-lg overflow-hidden  w-32 h-30 md:w-36 md:h-30"
                >
                  <Skeleton className="w-full h-full bg-gray-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 pt-4">
                    <Skeleton className="h-3 w-4/5 mb-1 " />
                    <Skeleton className="h-3 w-3/5 " />
                  </div>
                </Card>
              ))
            ) : promoCardList && promoCardList.length > 0 ? (
              promoCardList.slice(0, 8).map((promoCard) => (
                <Card
                  key={promoCard._id}
                  onClick={() => handlePromoCardClick(promoCard.link)}
                  className={`promo-card relative flex-shrink-0 rounded-lg overflow-hidden ${
                    promoCard.link ? "cursor-pointer" : ""
                  }`}
                >
                  <CardContent className="p-0 h-full">
                    <img
                      src={promoCard.image}
                      alt={promoCard.title || "Promosyon"}
                      className="w-full h-full object-contain transition-transform duration-300 max-[850px]:p-0"
                      loading="lazy"
                    />
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="w-full text-center flex justify-center items-center py-5 text-gray-500"></div>
            )}
          </div>
        </div>
      </section>

      <section className=" my-4 md:my-4 container mx-auto px-20 max-[1024px]:px-1">
        {featuresLoading || sideBannersLoading ? (
          <div className="flex flex-col md:flex-row gap-4 h-60  max-sm:h-[200px] max-md:h-[200px]">
            <Skeleton className="w-full md:w-[65%] h-full rounded-3xl bg-gray-200 animate-pulse max-sm:h-40" />
            <Skeleton className="w-full md:w-[35%] h-full rounded-3xl bg-gray-200 animate-pulse max-md:hidden" />
          </div>
        ) : (
          <div className="flex  md:flex-row gap-4 ">
            <div
              className={`relative w-full md:w-[65%] rounded-3xl overflow-hidden shadow-sm group max-sm:h-40 max-md:h-48 h-60`}
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
                    } absolute inset-0 w-full h-full object-center transition-opacity duration-1000 ease-in-out ${
                      slide.link ? "cursor-pointer" : ""
                    }`}
                    loading="lazy"
                  />
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Banner Alanı</span>
                </div>
              )}
              {featureImageList && featureImageList.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(
                        (prev) =>
                          (prev - 1 + featureImageList.length) %
                          featureImageList.length
                      );
                    }}
                    className="absolute top-1/2 left-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 max-sm:h-6 max-md:h-6 max-sm:w-6 max-md:w-6"
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
                    className="absolute top-1/2 right-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md max-sm:h-6 max-md:h-6 max-sm:w-6 max-md:w-6"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                  </Button>
                </>
              )}
            </div>
            <div
              className={`relative w-full md:w-[35%] rounded-3xl overflow-hidden shadow-sm group bg-gray-200 max-sm:h-32 max-md:h-48 h-60 max-md:hidden`}
            >
              {sideBannerList && sideBannerList.length > 0 ? (
                sideBannerList.map((slide, index) => (
                  <img
                    key={slide._id || index}
                    src={slide.image}
                    alt={slide.title || `Banner ${index + 1}`}
                    onClick={() => handlePromoCardClick(slide.link)}
                    className={`${
                      index === currentSideBannerIndex
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0"
                    } absolute inset-0 w-full h-full object-center transition-opacity duration-300 ease-in-out ${
                      slide.link ? "cursor-pointer" : ""
                    }`}
                    loading="lazy"
                  />
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 ">
                  <span className="text-gray-400 text-sm">Banner Alanı</span>
                </div>
              )}
              {sideBannerList && sideBannerList.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSideBannerNav(-1);
                    }}
                    className="absolute top-1/2 left-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md max-sm:h-6 max-md:h-6 max-sm:w-6 max-md:w-6"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSideBannerNav(1);
                    }}
                    className="absolute top-1/2 right-3 z-20 transform -translate-y-1/2 bg-white/60 hover:bg-white rounded-full h-8 w-8 shadow-md max-sm:h-6 max-md:h-6 max-sm:w-6 max-md:w-6"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      <div className="container mx-auto px-4 lg:px-20 space-y-0 pb-8">
        {sectionsLoading ? (
          Array.from({ length: 3 }).map((_, sectionIndex) => (
            <div key={`home-section-skel-${sectionIndex}`}>
              <Skeleton className="h-8 w-1/3 mb-4" />
              <div className="flex space-x-4 overflow-hidden pb-4">
                {Array.from({ length: 6 }).map((_, productIndex) => (
                  <div
                    key={`home-prod-skel-${sectionIndex}-${productIndex}`}
                    className="flex-shrink-0 w-60"
                  >
                    <ProductTileSkeleton />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : activeHomeSections && activeHomeSections.length > 0 ? (
          activeHomeSections.map((section) => {
            let filterParams = {};
            let sortParams = "salesCount-desc";
            let fetchKey = section._id;
            let viewAllPath = "/shop/listing";

            if (section.contentType === "BEST_SELLING") {
              sortParams = "salesCount-desc";
              fetchKey = "best-selling";
              viewAllPath = "/shop/listing?sortBy=salesCount-desc";
            } else if (
              section.contentType === "CATEGORY" &&
              section.contentValue
            ) {
              filterParams = { category: [section.contentValue] };
              sortParams = "createdAt-desc";
              fetchKey = `category-${section.contentValue}`;
              viewAllPath = `/shop/listing?category=${section.contentValue}`;
            } else if (
              section.contentType === "BRAND" &&
              section.contentValue
            ) {
              filterParams = { brand: [section.contentValue] };
              sortParams = "createdAt-desc";
              fetchKey = `brand-${section.contentValue}`;
              viewAllPath = `/shop/listing?brand=${section.contentValue}`;
            }

            const fetchConfig = {
              key: fetchKey,
              filterParams: filterParams,
              sortParams: sortParams,
              limit: section.itemLimit || 10,
            };

            return (
              <ProductCarousel
                key={section._id}
                title={section.title}
                fetchConfig={fetchConfig}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
                viewAllPath={viewAllPath}
              />
            );
          })
        ) : (
          <div className="text-center py-10 text-gray-500">
            Ana sayfada gösterilecek bölüm bulunamadı.
          </div>
        )}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
