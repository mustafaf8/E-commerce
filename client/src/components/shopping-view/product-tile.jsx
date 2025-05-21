import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import StarRatingComponent from "../common/star-rating";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";
import { addToCart } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import PropTypes from "prop-types"; // PropTypes kütüphanesini import edin

function ShoppingProductTile({ product, handleGetProductDetails }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state) => state.shopWishlist
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isWishlisted = product?._id && wishlistItems.includes(product._id);

  const handleWishlistToggle = (event) => {
    event.stopPropagation();

    if (!user?.id) {
      toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist({ userId: user.id, productId: product._id }))
        .unwrap()
        .then(() => {
          toast({ title: "Favorilerden çıkarıldı.", variant: "success" });
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: error.message || "Favorilerden çıkarılamadı.",
          });
        });
    } else {
      dispatch(addToWishlist({ userId: user.id, productId: product._id }))
        .unwrap()
        .then(() => {
          toast({ title: "Favorilere eklendi.", variant: "success" });
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: error.message || "Favorilere eklenemedi.",
          });
        });
    }
  };

  const handleActualAddToCart = () => {
    if (!product || !product._id) return;
    const productDetailsForCart = {
      price: product.price,
      salePrice: product.salePrice,
      title: product.title,
      image: product.image,
      totalStock: product.totalStock,
    };

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        productDetails: productDetailsForCart, // Ürün detaylarını yolla
      })
    )
      .unwrap() // unwrap() ile promise sonucunu yakala
      .then((payload) => {
        if (payload.success) {
          toast({ title: "Ürün sepete eklendi", variant: "success" });
        } else {
          toast({
            variant: "destructive",
            title: payload.message || "Sepete eklenemedi",
          });
        }
      })
      .catch((error) => {
        // Hata genellikle unwrap ile yakalanır ve payload'a message olarak gelir.
        // Network hatası gibi durumlarda error.message kullanılabilir.
        toast({
          variant: "destructive",
          title: error.message || "Sepete ekleme sırasında bir hata oluştu.",
        });
      });
  };

  return (
    <Card className="w-[100%] max-w-sm mx-auto relative group flex flex-col h-full overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/70 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
      >
        <Heart
          className={`w-5 h-5 ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
          }`}
        />
        <span className="sr-only">
          {isWishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        </span>
      </Button>

      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="flex flex-col flex-grow cursor-pointer"
      >
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[230px] sm:h-[230px] object-contain rounded-t-lg p-0 min-[1024px]:p-3"
          />
          {product?.totalStock === 0 ? (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Stokta Yok
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge variant="destructive" className="absolute top-2 left-2">
              {`Sadece ${product?.totalStock} ürün kaldı`}
            </Badge>
          ) : product?.salePrice < product.price ? (
            <Badge variant="destructive" className="absolute top-2 left-2">
              İndirim
            </Badge>
          ) : null}
        </div>

        <CardContent className="px-4 pt-0 pb-0 flex flex-col flex-grow">
          <h2
            className="text-md font-semibold mb-1 truncate"
            title={product?.title}
          >
            {product?.title}
          </h2>
          {product?.averageReview !== undefined && (
            <div className="flex items-center mb-1 pointer-events-none">
              <StarRatingComponent rating={product.averageReview} />
              <span className="ml-1 text-xs text-muted-foreground font-semibold">
                ({product.averageReview.toFixed(1)})
              </span>
            </div>
          )}
          <div className="py-2">
            {product?.salePrice !== undefined && product.salePrice !== null ? (
              <div
                className={`flex flex-col items-baseline ${
                  product?.price &&
                  product.price > 0 &&
                  product.price > product.salePrice
                    ? "justify-between"
                    : "justify-start"
                } gap-x-2`}
              >
                {product?.price &&
                  product.price > 0 &&
                  product.price > product.salePrice && (
                    <p className="line-through text-sm text-gray-400 font-medium">
                      {`${product.price.toFixed(2)} TL`}
                    </p>
                  )}

                <p
                  className={`font-semibold ${
                    product?.price &&
                    product.price > 0 &&
                    product.price > product.salePrice
                      ? "text-lg text-green-600"
                      : "text-lg text-black"
                  }`}
                >
                  {`${product.salePrice.toFixed(2)} TL`}
                </p>
              </div>
            ) : product?.price && product.price > 0 ? (
              <div className="flex justify-start">
                <p className="text-lg font-semibold text-black">
                  {`${product.price.toFixed(2)} TL`}
                </p>
              </div>
            ) : (
              <div className="flex justify-start">
                <span className="text-sm text-muted-foreground">
                  Fiyat Bilgisi Yok
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button
            variant="outline"
            className="w-full opacity-60 cursor-not-allowed"
          >
            Stokta Yok
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleActualAddToCart();
            }}
            className="w-full"
          >
            Sepete Ekle
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// PropTypes tanımlaması
ShoppingProductTile.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    totalStock: PropTypes.number,
    averageReview: PropTypes.number,
    price: PropTypes.number,
    salePrice: PropTypes.number,
  }),
  handleGetProductDetails: PropTypes.func,
  handleAddtoCart: PropTypes.func,
};
export default ShoppingProductTile;
