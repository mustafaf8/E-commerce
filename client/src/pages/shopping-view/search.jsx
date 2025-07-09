import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import NoSearchResults from "./NoSearchResults";
import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";

function SearchProducts() {
  const [, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams] = useSearchParams();

  const { searchResults, isLoading: searchLoading } = useSelector(
    (state) => state.shopSearch
  );
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    const keywordFromUrl = searchParams.get("keyword");
    if (keywordFromUrl && keywordFromUrl.trim() !== "") {
      setKeyword(keywordFromUrl);
      dispatch(getSearchResults(keywordFromUrl.trim()));
    } else {
      dispatch(resetSearchResults());
      setKeyword("");
    }
  }, [searchParams, dispatch]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
   // console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Bu üründen yalnızca ${getQuantity} adet eklenebilir`,
            variant: "info",
          });

          return;
        }
      }
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
        toast({
          title: "Ürün sepete eklendi",
          variant: "success",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
   // console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  //console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      {searchLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductTileSkeleton key={`search-skel-${index}`} />
          ))}
        </div>
      ) : searchResults.length === 0 && searchParams.get("keyword") ? (
        <NoSearchResults />
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-[800px]:gap-2">
          {searchResults.map((item) => (
            <ShoppingProductTile
              key={item._id}
              handleAddtoCart={() => handleAddtoCart(item._id, item.totalStock)}
              product={item}
              handleGetProductDetails={() => handleGetProductDetails(item._id)}
            />
          ))}
        </div>
      ) : null}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
