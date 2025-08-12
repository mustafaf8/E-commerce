import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import StarRatingComponent from "../common/star-rating";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";
import { addToCart } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import PropTypes from "prop-types";
import { cn, formatPrice } from "@/lib/utils";

const ShoppingProductTile = React.memo(function ShoppingProductTile({
  product,
  handleGetProductDetails,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state) => state.shopWishlist
  );
  const { user } = useSelector((state) => state.auth);
  const { addingProductId } = useSelector((state) => state.shopCart);
  const isWishlisted = product?._id && wishlistItems.includes(product._id);
  const isAdding = addingProductId === product?._id;
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
    if (!product || !product._id || isAdding) return;
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
        productDetails: productDetailsForCart,
      })
    )
      .unwrap()
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
        toast({
          variant: "destructive",
          title: error.message || "Sepete ekleme sırasında bir hata oluştu.",
        });
      });
  };

  return (
    <Card className="shop-product-card h-full hover:shadow-md flex flex-col justify-between">
      <div className="relative flex flex-col flex-grow">
        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/70 hover:bg-white shadow-sm"
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          aria-label="Favorilere Ekle"
        >
          <Heart
            className={cn(
              "w-4 h-4",
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
            )}
          />
          <span className="sr-only">
            {isWishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          </span>
        </Button>

        {/* Product image with badges */}
        <div
          onClick={() => handleGetProductDetails(product?._id)}
          className="cursor-pointer"
        >
          <div className="relative overflow-hidden">
            <div className="flex items-center justify-center bg-secondary/20 p-2">
              <img
                src={product?.image}
                alt={product?.title}
                className="w-full h-[140px] sm:h-[160px] md:h-[180px] object-contain transition-transform hover:scale-105 duration-300 p-2"
                loading="lazy"
              />
            </div>

            {/* Product badges */}
            {(() => {
              // Badge priority: out-of-stock > low-stock > discount
              if (product?.totalStock === 0) {
                return (
                  <Badge
                    variant="destructive"
                    className="absolute top-2 left-2 bg-red-500"
                  >
                    Stokta Yok
                  </Badge>
                );
              }

              if (product?.totalStock > 0 && product.totalStock < 10) {
                return (
                  <Badge
                    variant="outline"
                    className="absolute top-2 left-2 bg-amber-500 text-white border-0"
                  >
                    Son {product.totalStock} ürün
                  </Badge>
                );
              }

              if (product?.salePrice && product.salePrice < product.price) {
                return (
                  <Badge className="absolute top-2 left-2 py-0.5 px-2 bg-[hsl(var(--shop-discount))]">
                    İndirim
                  </Badge>
                );
              }
              return null;
            })()}
          </div>

          {/* Product details */}
          <CardContent className="p-3 space-y-1.5 flex-grow">
            <h2
              className="text-sm font-medium line-clamp-2"
              title={product?.title}
            >
              {product?.title}
            </h2>

            {/* Ratings */}
            {product?.averageReview !== undefined && (
              <div className="flex items-center space-x-0 pointer-events-none max-[640px]:space-x-1">
                <StarRatingComponent
                  rating={product.averageReview}
                  className="scale-90 origin-left"
                />
                <span className="text-xs text-muted-foreground">
                  ({product.averageReview.toFixed(1)})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="pt-1 max-[640px]:pt-0">
              {product?.salePrice !== undefined &&
              product.salePrice !== null ? (
                <div className="flex flex-col gap-1">
                  {product?.price &&
                    product.price > 0 &&
                    product.price > product.salePrice && (
                      <span className="line-through text-xs sm:text-sm text-gray-400 break-words">
                        {`${formatPrice(product.price)} TL`}
                      </span>
                    )}
                  <span
                    className={cn(
                      "font-medium text-sm sm:text-base break-words",
                      product?.price &&
                        product.price > 0 &&
                        product.price > product.salePrice
                        ? "text-green-600"
                        : "text-black"
                    )}
                  >
                    {`${formatPrice(product.salePrice)} TL`}
                  </span>
                </div>
              ) : product?.price && product.price > 0 ? (
                <span className="font-medium text-sm sm:text-base text-black break-words">
                  {`${formatPrice(product.price)} TL`}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Fiyat Bilgisi Yok
                </span>
              )}
            </div>
          </CardContent>
        </div>
      </div>

      {/* Action buttons */}
      <CardFooter className="p-3 pt-0 mt-auto flex-shrink-0">
        <Button
          onClick={handleActualAddToCart}
          disabled={!product?.totalStock || product.totalStock <= 0}
          className="w-full bg-primary/90 hover:bg-primary text-white transition-colors flex items-center gap-1.5 h-9"
          aria-label="Sepete Ekle"
        >
          <span className="text-sm">Sepete Ekle</span>
        </Button>
      </CardFooter>
    </Card>
  );
});

ShoppingProductTile.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    totalStock: PropTypes.number,
    averageReview: PropTypes.number,
  }),
  handleGetProductDetails: PropTypes.func.isRequired,
};

export default ShoppingProductTile;
