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
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
// Import necessary hooks
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
// Import deep comparison utility (install if needed: npm install lodash)
import isEqual from "lodash/isEqual";
import { Skeleton } from "@/components/ui/skeleton";
import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";

// --- Helper Functions (Consistent Parsing/Stringifying) ---
function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  // Sort keys for consistent parameter order
  const sortedKeys = Object.keys(filterParams).sort();

  for (const key of sortedKeys) {
    const value = filterParams[key];
    // Ensure value is an array and not empty
    if (Array.isArray(value) && value.length > 0) {
      // Sort array values for consistent value order
      const sortedValue = [...value].sort();
      const paramValue = sortedValue.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  // Return sorted query string
  return queryParams.join("&");
}

function parseUrlParamsToFilters(searchParams) {
  const filters = {};
  // Iterate over sorted keys from the search params
  const sortedKeys = Array.from(searchParams.keys()).sort();

  for (const key of sortedKeys) {
    const value = searchParams.get(key);
    if (value) {
      // Split and sort values
      filters[key] = value.split(",").sort();
    }
  }
  return filters;
}
// --- End Helper Functions ---

function ShoppingListing() {
  const dispatch = useDispatch();
  const {
    productList,
    productDetails,
    isLoading: productsLoading,
  } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // --- State Initialization ---
  // Initialize filters directly from URL on mount using useState initializer
  const [filters, setFilters] = useState(() =>
    parseUrlParamsToFilters(searchParams)
  );
  const [sort, setSort] = useState("price-lowtohigh");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Ref to track if it's the absolute first render cycle
  const isInitialMount = useRef(true);
  // Ref to track the string representation of filters last pushed to URL by component state changes
  const lastFiltersPushedToUrl = useRef(createSearchParamsHelper(filters));

  // --- Filter Handling (Internal State Update) ---
  const handleFilter = useCallback((getSectionId, getCurrentOption) => {
    setFilters((prevFilters) => {
      // Use structuredClone for a more robust deep copy if available, otherwise JSON parse/stringify
      const cpyFilters =
        typeof structuredClone === "function"
          ? structuredClone(prevFilters)
          : JSON.parse(JSON.stringify(prevFilters));

      const currentSectionFilters = cpyFilters[getSectionId]
        ? [...cpyFilters[getSectionId]]
        : [];
      const indexOfCurrentOption =
        currentSectionFilters.indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) {
        // Add
        currentSectionFilters.push(getCurrentOption);
      } else {
        // Remove
        currentSectionFilters.splice(indexOfCurrentOption, 1);
      }

      if (currentSectionFilters.length > 0) {
        // Update or keep section
        cpyFilters[getSectionId] = currentSectionFilters.sort(); // Keep sorted
      } else {
        // Remove section if empty
        delete cpyFilters[getSectionId];
      }

      // Prevent state update if filters didn't actually change
      if (!isEqual(prevFilters, cpyFilters)) {
        // console.log("handleFilter: Updating state", cpyFilters);
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters)); // Update session storage
        return cpyFilters; // Return new state
      }
      return prevFilters; // Return old state reference (no change)
    });
  }, []); // No dependencies needed with functional update

  // --- Sorting ---
  const handleSort = useCallback((value) => {
    setSort(value);
    // Optional: Update URL if sort needs to be persistent
  }, []);

  // --- Product Details ---
  const handleGetProductDetails = useCallback(
    (getCurrentProductId) => {
      dispatch(fetchProductDetails(getCurrentProductId));
    },
    [dispatch]
  );

  // --- Add to Cart (Using useCallback and unwrap) ---
  const handleAddtoCart = useCallback(
    (getCurrentProductId, getTotalStock) => {
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
        .unwrap() // Recommended for handling promises from createAsyncThunk
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
          // console.error("Sepete ekleme hatası:", error);
          toast({
            title: "Sepete ekleme sırasında bir hata oluştu",
            variant: "destructive",
          });
        });
    },
    [dispatch, cartItems, user?.id, toast]
  );

  // --- Effect: Update URL when 'filters' state changes (State -> URL Sync) ---
  useEffect(() => {
    // Skip effect on the very first render cycle
    if (isInitialMount.current) {
      return;
    }

    const newFiltersString = createSearchParamsHelper(filters);

    // Only update URL if the string form differs from the last one we pushed
    if (newFiltersString !== lastFiltersPushedToUrl.current) {
      // console.log("State -> URL: Filters changed, updating URL", newFiltersString);
      setSearchParams(new URLSearchParams(newFiltersString), { replace: true });
      // Update the ref to remember what we just pushed
      lastFiltersPushedToUrl.current = newFiltersString;
    }
  }, [filters, setSearchParams]); // Run when filters state changes

  // --- Effect: Sync state from URL changes (URL -> State Sync) ---
  useEffect(() => {
    // Parse filters from the current URL
    const urlFilters = parseUrlParamsToFilters(searchParams);
    const urlFiltersString = createSearchParamsHelper(urlFilters); // Get consistent string

    // Update state only if URL filters differ from current state AND
    // the URL string is different from the last string we know we pushed from state changes.
    // This detects external URL changes (header clicks, back/forward).
    if (
      !isEqual(filters, urlFilters) &&
      urlFiltersString !== lastFiltersPushedToUrl.current
    ) {
      // console.log("URL -> State: External URL change detected, updating state", urlFilters);
      setFilters(urlFilters); // Update state to match URL

      // IMPORTANT: Update the ref here too, so the State->URL effect
      // knows this change came from the URL and doesn't try to push it back immediately.
      lastFiltersPushedToUrl.current = urlFiltersString;
    }

    // After the first run of this effect completes, mark initial mount as done.
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [searchParams, filters]); // Run when URL (searchParams) changes, compare against state (filters)

  // --- Effect: Fetch products when filters or sort state changes ---
  useEffect(() => {
    // Fetch data whenever the filters or sort criteria actually change.
    // This will run on initial load because 'filters' is initialized,
    // and subsequently whenever 'filters' or 'sort' state updates.
    // console.log("Fetching products - Filters:", filters, "Sort:", sort);
    dispatch(
      fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
    );
  }, [dispatch, filters, sort]); // Correct dependencies

  // --- Effect: Open product details dialog ---
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
    // Consider clearing productDetails when dialog closes if needed
    // return () => {
    //   if (!openDetailsDialog) { dispatch(clearProductDetailsAction()); }
    // };
  }, [productDetails]); // Depends only on productDetails

  const skeletonCount = 8;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-4 md:p-6 max-[600px]:p-0">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {filters?.category?.length > 0
              ? `${filters.category.join(", ")} Ürünleri`
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sırala</span> {/* Türkçe */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort || "price-lowtohigh"}
                  onValueChange={handleSort}
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
          {productsLoading ? ( // productsLoading true ise
            Array.from({ length: skeletonCount }).map((_, index) => (
              <ProductTileSkeleton key={`skeleton-${index}`} />
            ))
          ) : productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id} // key olarak _id kullan
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Filtre kriterlerine uygun ürün bulunamadı.
            </div>
          )}
        </div>
      </div>
      {/* Ürün Detay Dialog (Aynı kalır) */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
