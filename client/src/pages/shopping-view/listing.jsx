import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config"; // sortOptions kalabilir
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  setProductDetails, // Dialog kapanınca detayları temizlemek için
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import isEqual from "lodash/isEqual";
import { Skeleton } from "@/components/ui/skeleton";
import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";
// *** YENİ İMPORTLAR ***
import { fetchAllCategories } from "@/store/common-slice/categories-slice";
import { fetchAllBrands } from "@/store/common-slice/brands-slice";
// *** --- ***

// --- Filtre Parametrelerini URL'den Alma ve URL'ye Yazma Yardımcıları (Slug Kullanacak Şekilde) ---
function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  const sortedKeys = Object.keys(filterParams).sort();

  for (const key of sortedKeys) {
    const value = filterParams[key];
    // Değer bir dizi ise ve boş değilse slug'ları birleştir
    if (Array.isArray(value) && value.length > 0) {
      const sortedValue = [...value].sort();
      const paramValue = sortedValue.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function parseUrlParamsToFilters(searchParams) {
  const filters = {};
  const sortedKeys = Array.from(searchParams.keys()).sort();

  for (const key of sortedKeys) {
    const value = searchParams.get(key);
    if (value) {
      // Virgülle ayrılmış slug'ları diziye çevir ve sırala
      filters[key] = value.split(",").sort();
    }
  }
  return filters;
}
// --- ---

function ShoppingListing() {
  const dispatch = useDispatch();
  const {
    productList,
    productDetails,
    isLoading: productsLoading,
  } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth); // isAuthenticated eklendi
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // *** YENİ: Kategori ve Marka State'lerini Redux'tan Al ***
  const { categoryList = [], isLoading: categoriesLoading } = useSelector(
    (state) => state.categories || { categoryList: [], isLoading: false }
  );
  const { brandList = [], isLoading: brandsLoading } = useSelector(
    (state) => state.brands || { brandList: [], isLoading: false }
  );
  // *** --- ***

  const [filters, setFilters] = useState(() =>
    parseUrlParamsToFilters(searchParams)
  );
  const [sort, setSort] = useState(
    searchParams.get("sortBy") || "salesCount-desc"
  ); // URL'den sortBy al veya varsayılan
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const isInitialMount = useRef(true);
  const lastFiltersPushedToUrl = useRef(createSearchParamsHelper(filters));

  // --- Filtreleme Fonksiyonu (handleFilter - Aynı kalabilir, slug değerlerini alacak) ---
  const handleFilter = useCallback((getSectionId, getCurrentOptionSlug) => {
    setFilters((prevFilters) => {
      const cpyFilters = JSON.parse(JSON.stringify(prevFilters)); // Basit deep copy
      const currentSectionFilters = cpyFilters[getSectionId]
        ? [...cpyFilters[getSectionId]]
        : [];
      const indexOfCurrentOption =
        currentSectionFilters.indexOf(getCurrentOptionSlug);

      if (indexOfCurrentOption === -1) {
        currentSectionFilters.push(getCurrentOptionSlug);
      } else {
        currentSectionFilters.splice(indexOfCurrentOption, 1);
      }

      if (currentSectionFilters.length > 0) {
        cpyFilters[getSectionId] = currentSectionFilters.sort();
      } else {
        delete cpyFilters[getSectionId];
      }

      if (!isEqual(prevFilters, cpyFilters)) {
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
        return cpyFilters;
      }
      return prevFilters;
    });
  }, []);

  // --- Sıralama Fonksiyonu (URL'yi de güncellesin) ---
  const handleSort = useCallback(
    (value) => {
      setSort(value);
      // URL'ye sortBy parametresini ekle/güncelle
      const currentParams = new URLSearchParams(searchParams);
      currentParams.set("sortBy", value);
      setSearchParams(currentParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // --- Ürün Detayları (Aynı kalabilir) ---
  const handleGetProductDetails = useCallback(
    (getCurrentProductId) => {
      dispatch(fetchProductDetails(getCurrentProductId));
    },
    [dispatch]
  );

  // --- Sepete Ekle (Aynı kalabilir, isAuthenticated kontrolü eklenebilir) ---
  const handleAddtoCart = useCallback(
    (getCurrentProductId, getTotalStock) => {
      if (!isAuthenticated) {
        toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
        // navigate('/auth/login', { state: { from: location } }); // Giriş sayfasına yönlendirme eklenebilir
        return;
      }
      const getCartItems = cartItems?.items || [];
      const existingCartItem = getCartItems.find(
        (item) => item.productId === getCurrentProductId
      );

      if (existingCartItem && existingCartItem.quantity >= getTotalStock) {
        toast({
          title: `Stok limiti (${getTotalStock}) aşıldı.`,
          variant: "info",
        });
        return;
      }

      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      )
        .unwrap()
        .then((payload) => {
          if (payload?.success) {
            dispatch(fetchCartItems(user?.id)); // Sepeti tekrar çek
            toast({ title: "Ürün sepete eklendi", variant: "success" });
          } else {
            toast({
              title: payload?.message || "Ürün eklenemedi",
              variant: "destructive",
            });
          }
        })
        .catch((error) => {
          toast({
            title: "Sepete ekleme sırasında bir hata oluştu",
            variant: "destructive",
          });
        });
    },
    [dispatch, cartItems, user?.id, toast, isAuthenticated] // isAuthenticated eklendi
  );

  // --- Effect: Update URL when 'filters' state changes (State -> URL Sync) ---
  useEffect(() => {
    if (isInitialMount.current) return;

    const newFiltersString = createSearchParamsHelper(filters);
    if (newFiltersString !== lastFiltersPushedToUrl.current) {
      // Sıralama parametresini de koruyarak URL'yi güncelle
      const currentParams = new URLSearchParams(searchParams);
      Object.keys(filters).forEach((key) => {
        if (filters[key].length > 0) {
          currentParams.set(key, filters[key].join(","));
        } else {
          currentParams.delete(key);
        }
      });
      // Eğer filtre boşsa ama URL'de varsa sil
      ["category", "brand"].forEach((key) => {
        // Genişletilebilir
        if (!filters[key] || filters[key].length === 0) {
          currentParams.delete(key);
        }
      });

      setSearchParams(currentParams, { replace: true });
      lastFiltersPushedToUrl.current = newFiltersString;
    }
  }, [filters, searchParams, setSearchParams]); // searchParams eklendi

  // --- Effect: Sync state from URL changes (URL -> State Sync) ---
  useEffect(() => {
    const urlFilters = parseUrlParamsToFilters(searchParams);
    const urlFiltersString = createSearchParamsHelper(urlFilters);
    const urlSortBy = searchParams.get("sortBy") || "salesCount-desc"; // URL'den sort al

    // Hem filtreleri hem de sıralamayı kontrol et
    if (
      (!isEqual(filters, urlFilters) &&
        urlFiltersString !== lastFiltersPushedToUrl.current) ||
      sort !== urlSortBy
    ) {
      setFilters(urlFilters);
      setSort(urlSortBy); // Sıralamayı da güncelle
      lastFiltersPushedToUrl.current = urlFiltersString;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [searchParams]); // Sadece searchParams'a bağımlı

  // --- Effect: Fetch products when filters or sort state changes ---
  useEffect(() => {
    // Sadece state değiştiğinde değil, URL'den gelen parametreler değiştiğinde de fetch tetiklenmeli
    // Yukarıdaki URL->State sync effect'i state'i güncelleyeceği için bu effect çalışacak.
    if (!isInitialMount.current) {
      // İlk mount'ta zaten fetch edilecek
      // Sıralama bilgisini de ekle
      const fetchSort = searchParams.get("sortBy") || sort;
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: fetchSort,
        })
      );
    }
  }, [dispatch, filters, sort]); // filters ve sort state'lerine bağımlı

  // --- Effect: Fetch initial data (categories, brands, initial products) ---
  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
    // İlk ürünleri URL'deki filtre ve sıralamaya göre çek
    const initialUrlFilters = parseUrlParamsToFilters(searchParams);
    const initialUrlSort = searchParams.get("sortBy") || "salesCount-desc";
    dispatch(
      fetchAllFilteredProducts({
        filterParams: initialUrlFilters,
        sortParams: initialUrlSort,
      })
    );
  }, [dispatch]); // Sadece dispatch'e bağımlı, bir kere çalışır

  // --- Effect: Open product details dialog ---
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  // Dialog kapandığında productDetails'i temizle
  const handleDialogClose = useCallback(() => {
    setOpenDetailsDialog(false);
    dispatch(setProductDetails(null)); // Redux'taki detayı temizle
  }, [dispatch]);

  // --- YENİ: Filtreleme için kullanılacak dinamik seçenekler ---
  const dynamicFilterOptions = useMemo(
    () => ({
      category: categoryList
        .filter((cat) => cat.isActive)
        .map((cat) => ({ id: cat.slug, label: cat.name })), // slug'ı id olarak kullan
      brand: brandList
        .filter((brand) => brand.isActive)
        .map((brand) => ({ id: brand.slug, label: brand.name })), // slug'ı id olarak kullan
    }),
    [categoryList, brandList]
  );

  const isLoading = productsLoading || categoriesLoading || brandsLoading;
  const skeletonCount = 8;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-4 md:p-6 max-[600px]:p-0">
      {/* *** ProductFilter'a dinamik seçenekleri ve yükleme durumunu gönder *** */}
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        dynamicFilterOptions={dynamicFilterOptions} // Yeni prop
        isLoading={categoriesLoading || brandsLoading} // Yeni prop
      />
      {/* --- --- */}
      <div className="bg-background w-full rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          {/* Başlık (Kategori/Marka isimlerini bulup gösterme eklenebilir) */}
          <h2 className="text-lg font-semibold">
            {/* Dinamik Başlık (Örnek) */}
            {filters?.category?.length > 0
              ? `${filters.category
                  .map(
                    (slug) =>
                      categoryList.find((c) => c.slug === slug)?.name || slug
                  )
                  .join(", ")} Ürünleri`
              : filters?.brand?.length > 0
              ? `${filters.brand
                  .map(
                    (slug) =>
                      brandList.find((b) => b.slug === slug)?.name || slug
                  )
                  .join(", ")} Markalı Ürünler`
              : "Tüm Ürünler"}
          </h2>
          <div className="flex items-center gap-3">
            {productsLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span className="text-sm text-muted-foreground">
                {productList?.length || 0} Ürün
              </span>
            )}
            {/* Sıralama Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sırala</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort} // Güncel sort state'ini kullan
                  onValueChange={handleSort} // handleSort fonksiyonunu çağır
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Ürün Grid'i */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {productsLoading ? ( // productsLoading kullan
            Array.from({ length: skeletonCount }).map((_, index) => (
              <ProductTileSkeleton key={`skeleton-${index}`} />
            ))
          ) : productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={() =>
                  handleAddtoCart(productItem._id, productItem.totalStock)
                } // Fonksiyon çağrısını düzelt
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Filtre kriterlerine uygun ürün bulunamadı.
            </div>
          )}
        </div>
      </div>
      {/* Ürün Detay Dialog (handleDialogClose eklendi) */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog} // Direkt state setter yerine handleDialogClose'u vermek daha iyi olabilir
        onOpenChange={(isOpen) => !isOpen && handleDialogClose()} // Dialog kapanınca temizleme
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
