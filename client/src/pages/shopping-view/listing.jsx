// // import ProductFilter from "@/components/shopping-view/filter";
// // import ProductDetailsDialog from "@/components/shopping-view/product-details";
// // import ShoppingProductTile from "@/components/shopping-view/product-tile";
// // import { Button } from "@/components/ui/button";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuRadioGroup,
// //   DropdownMenuRadioItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { useToast } from "@/components/ui/use-toast";
// // import { sortOptions } from "@/config";
// // import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// // import {
// //   fetchAllFilteredProducts,
// //   fetchProductDetails,
// // } from "@/store/shop/products-slice";
// // import { ArrowUpDownIcon } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useSearchParams } from "react-router-dom";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";

// // function createSearchParamsHelper(filterParams) {
// //   const queryParams = [];

// //   for (const [key, value] of Object.entries(filterParams)) {
// //     if (Array.isArray(value) && value.length > 0) {
// //       const paramValue = value.join(",");

// //       queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
// //     }
// //   }
// //   console.log(queryParams, "queryParams");
// //   return queryParams.join("&");
// // }

// // function ShoppingListing() {
// //   const dispatch = useDispatch();
// //   const {
// //     productList,
// //     productDetails,
// //     isLoading: productsLoading,
// //   } = useSelector((state) => state.shopProducts);
// //   const { cartItems } = useSelector((state) => state.shopCart);
// //   const { user } = useSelector((state) => state.auth);
// //   const [filters, setFilters] = useState({});
// //   const [sort, setSort] = useState(null);
// //   const [searchParams, setSearchParams] = useSearchParams();
// //   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
// //   const { toast } = useToast();

// //   const categorySearchParam = searchParams.get("category");

// //   useEffect(() => {
// //     const category = searchParams.get("category");
// //     const brand = searchParams.get("brand");

// //     console.log("Gelen Kategori:", category);
// //     console.log("Gelen Marka:", brand);
// //   }, [searchParams]);

// //   function handleSort(value) {
// //     setSort(value);
// //   }

// //   function handleFilter(getSectionId, getCurrentOption) {
// //     let cpyFilters = { ...filters };
// //     const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

// //     if (indexOfCurrentSection === -1) {
// //       cpyFilters = {
// //         ...cpyFilters,
// //         [getSectionId]: [getCurrentOption],
// //       };
// //     } else {
// //       const indexOfCurrentOption =
// //         cpyFilters[getSectionId].indexOf(getCurrentOption);

// //       if (indexOfCurrentOption === -1)
// //         cpyFilters[getSectionId].push(getCurrentOption);
// //       else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
// //     }

// //     setFilters(cpyFilters);
// //     sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
// //   }

// //   function handleGetProductDetails(getCurrentProductId) {
// //     // console.log(getCurrentProductId);
// //     dispatch(fetchProductDetails(getCurrentProductId));
// //   }

// //   function handleAddtoCart(getCurrentProductId, getTotalStock) {
// //     console.log(cartItems);
// //     let getCartItems = cartItems.items || [];

// //     if (getCartItems.length) {
// //       const indexOfCurrentItem = getCartItems.findIndex(
// //         (item) => item.productId === getCurrentProductId
// //       );
// //       if (indexOfCurrentItem > -1) {
// //         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
// //         if (getQuantity + 1 > getTotalStock) {
// //           toast({
// //             title: `Bu üründen yalnızca ${getQuantity} adet eklenebilir`,
// //             variant: "info",
// //           });

// //           return;
// //         }
// //       }
// //     }

// //     dispatch(
// //       addToCart({
// //         userId: user?.id,
// //         productId: getCurrentProductId,
// //         quantity: 1,
// //       })
// //     ).then((data) => {
// //       if (data?.payload?.success) {
// //         dispatch(fetchCartItems(user?.id));
// //         toast({
// //           title: "Ürün sepete eklendi",
// //           variant: "success",
// //         });
// //       }
// //     });
// //   }

// //   useEffect(() => {
// //     setSort("price-lowtohigh");
// //     setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
// //   }, [categorySearchParam]);

// //   useEffect(() => {
// //     if (filters && Object.keys(filters).length > 0) {
// //       const createQueryString = createSearchParamsHelper(filters);
// //       setSearchParams(new URLSearchParams(createQueryString));
// //     } else {
// //       searchParams.delete("category");
// //       searchParams.delete("brand");
// //       setSearchParams(searchParams);
// //     }
// //   }, [filters, searchParams, setSearchParams]);

// //   useEffect(() => {
// //     if (filters !== null && sort !== null)
// //       dispatch(
// //         fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
// //       );
// //   }, [dispatch, sort, filters]);

// //   useEffect(() => {
// //     if (productDetails !== null) setOpenDetailsDialog(true);
// //   }, [productDetails]);

// //   const skeletonCount = 8;

// //   return (
// //     <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-4 md:p-6">
// //       <ProductFilter filters={filters} handleFilter={handleFilter} />
// //       <div className="bg-background w-full rounded-lg shadow-sm border">
// //         <div className="p-4 border-b flex items-center justify-between">
// //           <h2 className="text-lg font-semibold">
// //             {filters?.category?.length > 0
// //               ? `${filters.category.join(", ")} Ürünleri`
// //               : "Tüm Ürünler"}
// //           </h2>
// //           <div className="flex items-center gap-3">
// //             {productsLoading ? (
// //               <Skeleton className="h-5 w-20" />
// //             ) : (
// //               <span className="text-sm text-muted-foreground">
// //                 {productList?.length || 0} Ürün
// //               </span>
// //             )}
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button
// //                   variant="outline"
// //                   size="sm"
// //                   className="flex items-center gap-1"
// //                 >
// //                   <ArrowUpDownIcon className="h-4 w-4" />
// //                   <span>Sırala</span> {/* Türkçe */}
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent align="end" className="w-[200px]">
// //                 <DropdownMenuRadioGroup
// //                   value={sort || "price-lowtohigh"}
// //                   onValueChange={handleSort}
// //                 >
// //                   {sortOptions.map((sortItem) => (
// //                     <DropdownMenuRadioItem
// //                       value={sortItem.id}
// //                       key={sortItem.id}
// //                     >
// //                       {sortItem.label}
// //                     </DropdownMenuRadioItem>
// //                   ))}
// //                 </DropdownMenuRadioGroup>
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           </div>
// //         </div>
// //         {/* Ürün Grid'i */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
// //           {productsLoading ? ( // productsLoading true ise
// //             Array.from({ length: skeletonCount }).map((_, index) => (
// //               <ProductTileSkeleton key={`skeleton-${index}`} />
// //             ))
// //           ) : productList && productList.length > 0 ? (
// //             productList.map((productItem) => (
// //               <ShoppingProductTile
// //                 key={productItem._id} // key olarak _id kullan
// //                 handleGetProductDetails={handleGetProductDetails}
// //                 product={productItem}
// //                 handleAddtoCart={handleAddtoCart}
// //               />
// //             ))
// //           ) : (
// //             <div className="col-span-full text-center py-10 text-gray-500">
// //               Filtre kriterlerine uygun ürün bulunamadı.
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //       {/* Ürün Detay Dialog (Aynı kalır) */}
// //       <ProductDetailsDialog
// //         open={openDetailsDialog}
// //         setOpen={setOpenDetailsDialog}
// //         productDetails={productDetails}
// //       />
// //     </div>
// //   );
// // }

// // export default ShoppingListing;

// import ProductFilter from "@/components/shopping-view/filter";
// import ProductDetailsDialog from "@/components/shopping-view/product-details";
// import ShoppingProductTile from "@/components/shopping-view/product-tile";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useToast } from "@/components/ui/use-toast";
// import { sortOptions } from "@/config";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
// import { ArrowUpDownIcon } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";

// function createSearchParamsHelper(filterParams) {
//   const queryParams = [];

//   for (const [key, value] of Object.entries(filterParams)) {
//     if (Array.isArray(value) && value.length > 0) {
//       const paramValue = value.join(",");

//       queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
//     }
//   }

//   return queryParams.join("&");
// }

// // Helper function to parse URL parameters into filters object
// function parseUrlParamsToFilters(searchParams) {
//   const filters = {};

//   // Loop through each parameter in the URL
//   for (const [key, value] of searchParams.entries()) {
//     if (value) {
//       // Split comma-separated values into array
//       filters[key] = value.split(',');
//     }
//   }

//   return filters;
// }

// function ShoppingListing() {
//   const dispatch = useDispatch();
//   const { productList, productDetails } = useSelector(
//     (state) => state.shopProducts
//   );
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { user } = useSelector((state) => state.auth);
//   const [filters, setFilters] = useState({});
//   const [sort, setSort] = useState("price-lowtohigh");
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const { toast } = useToast();

//   function handleSort(value) {
//     setSort(value);
//   }

//   function handleFilter(getSectionId, getCurrentOption) {
//     let cpyFilters = { ...filters };
//     const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

//     if (indexOfCurrentSection === -1) {
//       cpyFilters = {
//         ...cpyFilters,
//         [getSectionId]: [getCurrentOption],
//       };
//     } else {
//       const indexOfCurrentOption =
//         cpyFilters[getSectionId].indexOf(getCurrentOption);

//       if (indexOfCurrentOption === -1)
//         cpyFilters[getSectionId].push(getCurrentOption);
//       else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
//     }

//     setFilters(cpyFilters);
//     sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
//   }

//   function handleGetProductDetails(getCurrentProductId) {
//     dispatch(fetchProductDetails(getCurrentProductId));
//   }

//   function handleAddtoCart(getCurrentProductId, getTotalStock) {
//     let getCartItems = cartItems.items || [];

//     if (getCartItems.length) {
//       const indexOfCurrentItem = getCartItems.findIndex(
//         (item) => item.productId === getCurrentProductId
//       );
//       if (indexOfCurrentItem > -1) {
//         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
//         if (getQuantity + 1 > getTotalStock) {
//           toast({
//             title: `Only ${getQuantity} quantity can be added for this item`,
//             variant: "destructive",
//           });

//           return;
//         }
//       }
//     }

//     dispatch(
//       addToCart({
//         userId: user?.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast({
//           title: "Product is added to cart",
//         });
//       }
//     });
//   }

//   // Parse URL parameters when component mounts or URL changes
//   useEffect(() => {
//     // Get filters from URL parameters
//     const urlFilters = parseUrlParamsToFilters(searchParams);

//     // Only use sessionStorage if URL doesn't have parameters
//     if (Object.keys(urlFilters).length === 0) {
//       const storedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
//       setFilters(storedFilters);
//     } else {
//       // Use URL parameters as filters
//       setFilters(urlFilters);
//       // Update session storage with URL filters
//       sessionStorage.setItem("filters", JSON.stringify(urlFilters));
//     }

//     // Set default sort
//     setSort("price-lowtohigh");
//   }, [searchParams]);

//   // Update URL when filters change
//   useEffect(() => {
//     if (filters && Object.keys(filters).length > 0) {
//       const createQueryString = createSearchParamsHelper(filters);
//       setSearchParams(new URLSearchParams(createQueryString), { replace: true });
//     } else {
//       // Clear URL parameters if no filters
//       setSearchParams(new URLSearchParams());
//     }
//   }, [filters, setSearchParams]);

//   // Fetch products when filters or sort changes
//   useEffect(() => {
//     dispatch(
//       fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
//     );
//   }, [dispatch, sort, filters]);

//   // Open product details dialog when product details are loaded
//   useEffect(() => {
//     if (productDetails !== null) setOpenDetailsDialog(true);
//   }, [productDetails]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
//       <ProductFilter filters={filters} handleFilter={handleFilter} />
//       <div className="bg-background w-full rounded-lg shadow-sm">
//         <div className="p-4 border-b flex items-center justify-between">
//           <h2 className="text-lg font-extrabold">All Products</h2>
//           <div className="flex items-center gap-3">
//             <span className="text-muted-foreground">
//               {productList?.length} Products
//             </span>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center gap-1"
//                 >
//                   <ArrowUpDownIcon className="h-4 w-4" />
//                   <span>Sort by</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-[200px]">
//                 <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
//                   {sortOptions.map((sortItem) => (
//                     <DropdownMenuRadioItem
//                       value={sortItem.id}
//                       key={sortItem.id}
//                     >
//                       {sortItem.label}
//                     </DropdownMenuRadioItem>
//                   ))}
//                 </DropdownMenuRadioGroup>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//           {productList && productList.length > 0
//             ? productList.map((productItem) => (
//                 <ShoppingProductTile
//                   key={productItem.id}
//                   handleGetProductDetails={handleGetProductDetails}
//                   product={productItem}
//                   handleAddtoCart={handleAddtoCart}
//                 />
//               ))
//             : null}
//         </div>
//       </div>
//       <ProductDetailsDialog
//         open={openDetailsDialog}
//         setOpen={setOpenDetailsDialog}
//         productDetails={productDetails}
//       />
//     </div>
//   );
// }

// export default ShoppingListing;

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
  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
  //       {/* Product Filter Component */}
  //       <ProductFilter filters={filters} handleFilter={handleFilter} />

  //       {/* Product Listing Area */}
  //       <div className="bg-background w-full rounded-lg shadow-sm">
  //         {/* Listing Header */}
  //         <div className="p-4 border-b flex items-center justify-between">
  //           <h2 className="text-lg font-semibold">All Products</h2>
  //           <div className="flex items-center gap-3">
  //             <span className="text-sm text-muted-foreground">
  //               {productList?.length || 0} Products
  //             </span>
  //             {/* Sort Dropdown */}
  //             <DropdownMenu>
  //               <DropdownMenuTrigger asChild>
  //                 <Button variant="outline" size="sm" className="flex items-center gap-1">
  //                   <ArrowUpDownIcon className="h-4 w-4" />
  //                   <span>Sort by</span>
  //                 </Button>
  //               </DropdownMenuTrigger>
  //               <DropdownMenuContent align="end" className="w-[200px]">
  //                 <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
  //                   {sortOptions.map((sortItem) => (
  //                     <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
  //                       {sortItem.label}
  //                     </DropdownMenuRadioItem>
  //                   ))}
  //                 </DropdownMenuRadioGroup>
  //               </DropdownMenuContent>
  //             </DropdownMenu>
  //           </div>
  //         </div>

  //         {/* Product Grid */}
  //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 min-h-[300px]"> {/* Added min-height */}
  //           {productList && productList.length > 0 ? (
  //             productList.map((productItem) => (
  //               <ShoppingProductTile
  //                 key={productItem.id}
  //                 handleGetProductDetails={handleGetProductDetails}
  //                 product={productItem}
  //                 handleAddtoCart={handleAddtoCart}
  //               />
  //             ))
  //           ) : (
  //             // Display message when no products match
  //             <div className="col-span-full flex items-center justify-center text-muted-foreground h-full">
  //               <p>No products found matching your criteria.</p>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {/* Product Details Dialog */}
  //       <ProductDetailsDialog
  //         open={openDetailsDialog}
  //         setOpen={setOpenDetailsDialog}
  //         productDetails={productDetails}
  //       />
  //     </div>
  //   );
  // }

  // export default ShoppingListing;
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-4 md:p-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
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
