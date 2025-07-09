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
import { fetchAllCategories } from "@/store/common-slice/categories-slice";
import { fetchAllBrands } from "@/store/common-slice/brands-slice";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  const sortedKeys = Object.keys(filterParams).sort();

  for (const key of sortedKeys) {
    const value = filterParams[key];
    if (Array.isArray(value)) {
      if (value.length > 0) {
        const sortedValue = [...value].sort();
        queryParams.push(`${key}=${encodeURIComponent(sortedValue.join(","))}`);
      }
    } else if (value !== undefined && value !== "" && value !== null) {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  }
  return queryParams.join("&");
}

function parseUrlParamsToFilters(searchParams) {
  const filters = {};
  for (const [key, value] of searchParams.entries()) {
    if (value === "") continue;
    if (key === "category" || key === "brand") {
      filters[key] = value.split(",").sort();
    } else {
      filters[key] = value; // scalar
    }
  }
  return filters;
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const {
    productList,
    productDetails,
    isLoading: productsLoading,
  } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { categoryList = [], isLoading: categoriesLoading } = useSelector(
    (state) => state.categories || { categoryList: [], isLoading: false }
  );
  const { brandList = [], isLoading: brandsLoading } = useSelector(
    (state) => state.brands || { brandList: [], isLoading: false }
  );
  const [filters, setFilters] = useState(() =>
    parseUrlParamsToFilters(searchParams)
  );
  const [sort, setSort] = useState(
    searchParams.get("sortBy") || "price-lowtohigh"
  );
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const isInitialMount = useRef(true);
  const lastFiltersPushedToUrl = useRef(createSearchParamsHelper(filters));

  const handleFilter = useCallback((getSectionId, getCurrentOptionSlug) => {
    setFilters((prevFilters) => {
      const cpyFilters = JSON.parse(JSON.stringify(prevFilters));
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

  const handleScalarFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (value === "" || value === undefined) {
        delete newFilters[key];
      }
      return newFilters;
    });
  }, []);

  const handleSort = useCallback(
    (value) => {
      setSort(value);
      const currentParams = new URLSearchParams(searchParams);
      currentParams.set("sortBy", value);
      setSearchParams(currentParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleGetProductDetails = useCallback(
    (getCurrentProductId) => {
      dispatch(fetchProductDetails(getCurrentProductId));
    },
    [dispatch]
  );

  const handleAddtoCart = useCallback(
    (getCurrentProductId, getTotalStock) => {
      if (!isAuthenticated) {
        toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
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
            dispatch(fetchCartItems(user?.id));
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
            description: error.message || "Lütfen daha sonra tekrar deneyin.",
            variant: "destructive",
          });
        });
    },
    [dispatch, cartItems, user?.id, toast, isAuthenticated]
  );

  useEffect(() => {
    if (isInitialMount.current) return;

    const newFiltersString = createSearchParamsHelper(filters);
    if (newFiltersString !== lastFiltersPushedToUrl.current) {
      const currentParams = new URLSearchParams(searchParams);
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (Array.isArray(value)) {
          if (value.length > 0) currentParams.set(key, value.join(","));
          else currentParams.delete(key);
        } else if (value !== undefined && value !== "") {
          currentParams.set(key, value);
        } else {
          currentParams.delete(key);
        }
      });
      ["category", "brand"].forEach((key) => {
        if (!filters[key] || filters[key].length === 0) {
          currentParams.delete(key);
        }
      });

      setSearchParams(currentParams, { replace: true });
      lastFiltersPushedToUrl.current = newFiltersString;
    }
  }, [filters, searchParams, setSearchParams]);

  useEffect(() => {
    const urlFilters = parseUrlParamsToFilters(searchParams);
    const urlFiltersString = createSearchParamsHelper(urlFilters);
    const urlSortBy = searchParams.get("sortBy") || "price-lowtohigh";

    if (
      (!isEqual(filters, urlFilters) &&
        urlFiltersString !== lastFiltersPushedToUrl.current) ||
      sort !== urlSortBy
    ) {
      setFilters(urlFilters);
      setSort(urlSortBy);
      lastFiltersPushedToUrl.current = urlFiltersString;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isInitialMount.current) {
      const fetchSort = searchParams.get("sortBy") || sort;
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: fetchSort,
        })
      );
    }
  }, [dispatch, filters, sort]);

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
    const initialUrlFilters = parseUrlParamsToFilters(searchParams);
    const initialUrlSort = searchParams.get("sortBy") || "price-lowtohigh";
    dispatch(
      fetchAllFilteredProducts({
        filterParams: initialUrlFilters,
        sortParams: initialUrlSort,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  const handleDialogClose = useCallback(() => {
    setOpenDetailsDialog(false);
    dispatch(setProductDetails(null));
  }, [dispatch]);

  const dynamicFilterOptions = useMemo(
    () => ({
      category: categoryList
        .filter((cat) => cat.isActive)
        .map((cat) => ({ id: cat.slug, label: cat.name })),
      brand: brandList
        .filter((brand) => brand.isActive)
        .map((brand) => ({ id: brand.slug, label: brand.name })),
    }),
    [categoryList, brandList]
  );

  const skeletonCount = 8;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-4 md:p-6 max-[600px]:p-0 container mx-auto px-20 max-[1024px]:px-1">
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        handleScalarFilter={handleScalarFilter}
        dynamicFilterOptions={dynamicFilterOptions}
        isLoading={categoriesLoading || brandsLoading}
      />
      <div className="bg-background w-full rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
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
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 max-[600px]:p-1 max-[600px]:gap-2">
          {productsLoading ? (
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
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Filtre kriterlerine uygun ürün bulunamadı.
            </div>
          )}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        onOpenChange={(isOpen) => !isOpen && handleDialogClose()}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
