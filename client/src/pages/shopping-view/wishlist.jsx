// client/src/pages/shopping-view/wishlist.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice"; // Tüm ürünleri alıp filtrelemek için VEYA backend'den direkt favori ürün detaylarını alın
import ShoppingProductTile from "@/components/shopping-view/product-tile"; // Ürün kartını tekrar kullan
import { fetchProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { Skeleton } from "@/components/ui/skeleton"; // Skeleton ekle
import { HeartOff } from "lucide-react"; // Boş liste ikonu

function ShoppingWishlist() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    wishlistItems,
    isLoading: wishlistLoading,
    error: wishlistError,
  } = useSelector((state) => state.shopWishlist);
  // Tüm ürünleri alıp favori ID'lerine göre filtreleme yöntemi:
  const { productList, isLoading: productsLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { productDetails } = useSelector((state) => state.shopProducts);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // Ürün Detayları için
  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
      // Eğer tüm ürünler state'de yoksa veya güncel değilse, onları da fetch etmeniz gerekebilir
      // Bu yöntem çok sayıda ürün varsa verimsiz olabilir.
      // İdeal olanı, backend'in doğrudan favori ürün detaylarını döndürmesidir.
      if (!productList.length) {
        dispatch(
          fetchAllFilteredProducts({ filterParams: {}, sortParams: "" })
        ); // Veya uygun bir thunk
      }
    }
  }, [dispatch, user?.id, productList.length]); // productList.length eklendi

  // Favori ID'lerine göre ürünleri filtrele
  const favoriteProducts = productList.filter((product) =>
    wishlistItems.includes(product._id)
  );

  const isLoading = wishlistLoading || productsLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6 border-b pb-3">Favorilerim</h1>

      {isLoading ? (
        // Yükleniyor durumu için Skeleton gösterimi
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((productItem) => (
            <ShoppingProductTile
              key={productItem._id} // key eklendi
              product={productItem}
              handleGetProductDetails={handleGetProductDetails}
              // handleAddtoCart prop'u bu sayfada gereksiz olabilir
            />
          ))}
        </div>
      ) : (
        // Favori ürün yoksa mesaj göster
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
