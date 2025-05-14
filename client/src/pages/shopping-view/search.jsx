import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
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
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    searchResults,
    isLoading: searchLoading, // Yüklenme durumunu search slice'tan al
  } = useSelector((state) => state.shopSearch);
  const { productDetails, isLoading: detailsLoading } = useSelector(
    (state) => state.shopProducts
  );

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    const keywordFromUrl = searchParams.get("keyword");
    if (keywordFromUrl && keywordFromUrl.trim() !== "") {
      setKeyword(keywordFromUrl); // Arama çubuğunu güncelle
      dispatch(getSearchResults(keywordFromUrl.trim()));
    } else {
      // URL'de keyword yoksa veya boşsa, sonuçları temizle
      dispatch(resetSearchResults());
      // İsteğe bağlı: Eğer keyword yoksa ve kullanıcı bir şeyler yazmaya başlarsa diye arama çubuğunu boşaltabilirsiniz.
      setKeyword("");
    }
  }, [searchParams, dispatch]); // searchParams değiştiğinde çalışır

  // const handleSearchInputChange = (event) => {
  //   setKeyword(event.target.value);
  // };

  // const handleSearchSubmit = (event) => {
  //   event.preventDefault();
  //   if (keyword.trim() !== "") {
  //     // URL'yi güncelle (bu useEffect'i tetikleyecek ve arama yapılacak)
  //     setSearchParams({ keyword: keyword.trim() });
  //   } else {
  //     // Boş arama ise URL'den keyword'ü kaldır ve sonuçları temizle
  //     setSearchParams({});
  //     dispatch(resetSearchResults());
  //   }
  // };

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
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
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "searchResults");

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      {searchLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductTileSkeleton key={`search-skel-${index}`} />
          ))}
        </div>
      ) : searchResults.length === 0 && searchParams.get("keyword") ? ( // Sadece arama yapıldıysa ve sonuç yoksa göster
        <NoSearchResults />
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((item) => (
            <ShoppingProductTile
              key={item._id} // API'den gelen _id'yi kullan
              handleAddtoCart={() => handleAddtoCart(item._id, item.totalStock)}
              product={item}
              handleGetProductDetails={() => handleGetProductDetails(item._id)}
            />
          ))}
        </div>
      ) : null}{" "}
      {/* Başlangıçta veya boş arama teriminde hiçbir şey gösterme */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
