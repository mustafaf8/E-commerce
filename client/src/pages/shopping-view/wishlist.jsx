import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { fetchProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartOff } from "lucide-react";

function ShoppingWishlist() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    wishlistItems,
    isLoading: wishlistLoading,
    error: wishlistError,
  } = useSelector((state) => state.shopWishlist);
  const { productList, isLoading: productsLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { productDetails } = useSelector((state) => state.shopProducts);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
      dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "" }));
    }
  }, [dispatch, user?.id]);

  const favoriteProducts = productList.filter((product) =>
    wishlistItems.includes(product._id)
  );

  const isLoading = wishlistLoading || productsLoading;

  return (
    <div className="container mx-auto px-20 py-8 max-[1024px]:px-1">
      <h1 className="text-xl font-bold mb-6 border-b pb-3">Favorilerim</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full max-w-sm mx-auto space-y-3">
              <Skeleton className="h-[300px] w-full rounded-t-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-b-lg" />
            </div>
          ))}
        </div>
      ) : wishlistError ? (
        // Hata durumu
        <div className="text-center py-10 text-red-600">
          <p>Favoriler yüklenirken bir hata oluştu: {wishlistError}</p>
        </div>
      ) : favoriteProducts.length > 0 ? (
        // Favori ürünler varsa listele
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-[800px]:gap-2">
          {favoriteProducts.map((productItem) => (
            <ShoppingProductTile
              key={productItem._id}
              product={productItem}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
          <HeartOff className="w-16 h-16 mb-4" />
          <p className="text-lg">Favori listeniz henüz boş.</p>
          <p>
            Ürünleri keşfedip kalp ikonuna tıklayarak favorilerinize
            ekleyebilirsiniz.
          </p>
        </div>
      )}

      {/* Ürün Detay Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingWishlist;
