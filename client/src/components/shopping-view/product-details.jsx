import { Heart, Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";
import PropTypes from "prop-types";
import { formatPrice } from "@/lib/utils";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Yükleme durumu
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state) => state.shopWishlist
  );
  const { toast } = useToast();
  const isWishlisted =
    productDetails?._id && wishlistItems.includes(productDetails._id);
  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
      navigate("/shop/home", { state: { from: location } });
      return;
    }
    if (isWishlisted) {
      dispatch(
        removeFromWishlist({ userId: user.id, productId: productDetails._id })
      )
        .unwrap()
        .then(() =>
          toast({ title: "Favorilerden çıkarıldı.", variant: "success" })
        )
        .catch((error) =>
          toast({
            variant: "destructive",
            title: error.message || "Favorilerden çıkarılamadı.",
          })
        );
    } else {
      dispatch(
        addToWishlist({ userId: user.id, productId: productDetails._id })
      )
        .unwrap()
        .then(() => toast({ title: "Favorilere eklendi.", variant: "success" }))
        .catch((error) =>
          toast({
            variant: "destructive",
            title: error.message || "Favorilere eklenemedi.",
          })
        );
    }
  };

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  const handleAddToCart = () => {
    if (isAddingToCart || !productDetails) return;

    setIsAddingToCart(true);

    const productDetailsForCart = {
      price: productDetails.price,
      salePrice: productDetails.salePrice,
      title: productDetails.title,
      image: productDetails.image,
      totalStock: productDetails.totalStock,
    };

    dispatch(
      addToCart({
        productId: productDetails._id,
        quantity: quantity,
        productDetails: productDetailsForCart,
      })
    )
      .unwrap()
      .then((payload) => {
        if (payload?.success) {
          toast({
            title: "Ürün sepete eklendi",
            variant: "success",
          });
        } else {
          toast({
            variant: "destructive",
            title: payload?.message || "Sepete eklenemedi",
            description: payload?.isStockError
              ? `Stokta en fazla ${payload.availableStock} adet ürün var.`
              : undefined,
          });
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: error?.message || "Sepete ekleme sırasında bir hata oluştu.",
          description: error?.isStockError
            ? `Stokta en fazla ${error.availableStock} adet ürün var.`
            : undefined,
        });
      })
      .finally(() => {
        setIsAddingToCart(false);
      });
  };

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails(null));
    setRating(0);
    setReviewMsg("");
    setQuantity(1);
  }

  async function handleAddReview() {
    if (!isAuthenticated) {
      toast({
        title: "Lütfen giriş yapın",
        description: "Ürüne yorum yapmak için giriş yapmanız gerekmektedir.",
        variant: "destructive",
      });
      navigate("/shop/home", { state: { from: location } });
      return;
    }
    try {
      const reviewData = {
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      };
      const result = await dispatch(addReview(reviewData)).unwrap();
      setRating(0);
      setReviewMsg("");
      dispatch(getReviews(productDetails?._id));
      toast({
        variant: "success",
        title: "Yorum Başarıyla Eklendi!",
        description: "Yorumunuz onay için bekliyor. Onaylandıktan sonra görünür olacaktır.",
      });
    } catch (error) {
     // console.error("Yorum ekleme hatası yakalandı:", error);
      toast({
        variant: "destructive",
        title: "Yorum Eklenemedi",
        description: error?.message || "Beklenmedik bir hata oluştu.",
      });
    }
  }

  useEffect(() => {
    if (productDetails?._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails?._id, dispatch]);

  // Reset quantity when dialog opens or product changes
  useEffect(() => {
    if (open && productDetails) {
      setQuantity(1);
    }
  }, [open, productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  if (!productDetails) {
    return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[600px]">
          <p>Yükleniyor...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10 max-w-[90vw] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative overflow-hidden rounded-lg aspect-w-1 aspect-h-1 flex items-center justify-center bg-gray-100 border">
          {productDetails?.image ? (
            <img
              src={productDetails.image}
              alt={productDetails.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-gray-400">Resim Yok</span>
          )}
        </div>

        <div className="flex flex-col ">
          <div className="flex-shrink-0 pb-2 mb-1 border-b">
            <div className="flex justify-between items-start mb-2">
              <DialogTitle>
                <p className="text-xl sm:text-lg font-semibold pr-2 text-gray-900">
                  {productDetails.title}
                </p>
              </DialogTitle>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="sr-only">
                  {isWishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                </span>
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              {productDetails.description}
            </p>
            <div className="py-2">
              {productDetails?.salePrice !== undefined &&
              productDetails.salePrice !== null ? (
                <div
                  className={`flex items-center ${
                    productDetails?.price &&
                    productDetails.price > 0 &&
                    productDetails.price > productDetails.salePrice
                      ? "justify-between"
                      : "justify-start"
                  } gap-x-2`}
                >
                  {productDetails?.price &&
                    productDetails.price > 0 &&
                    productDetails.price > productDetails.salePrice && (
                      <p className="line-through text-lg text-gray-400 whitespace-nowrap">
                        {`${formatPrice(productDetails.price)} TL`}
                      </p>
                    )}

                  <p
                    className={`font-bold whitespace-nowrap ${
                      productDetails?.price &&
                      productDetails.price > 0 &&
                      productDetails.price > productDetails.salePrice
                        ? "text-xl text-green-600"
                        : "text-xl text-black"
                    }`}
                  >
                    {`${formatPrice(productDetails.salePrice)} TL`}
                  </p>
                </div>
              ) : productDetails?.price && productDetails.price > 0 ? (
                <div className="flex justify-start">
                  <p className="text-lg font-semibold text-black whitespace-nowrap">
                    {`${formatPrice(productDetails.price)} TL`}
                  </p>
                </div>
              ) : (
                <div className="flex justify-start">
                  <span className="text-lg text-muted-foreground">
                    Fiyat Bilgisi Yok
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center mt-1 mb-3">
              <div className="flex items-center gap-0.5 pointer-events-none">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-xs text-gray-500 font-medium ml-1.5">
                ({averageReview.toFixed(1)})
              </span>
              {reviews && reviews.length > 0 && (
                <span className="ml-2 text-xs text-gray-400">
                  ({reviews.length} yorum)
                </span>
              )}
            </div>
            <div className="mt-4">
              {productDetails.totalStock === 0 ? (
                <Button
                  className="w-full opacity-60 cursor-not-allowed"
                  disabled
                >
                  Stokta Yok
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <div className="flex items-center gap-3 w-full">
                    {/* Quantity Stepper - Left */}
                    <div className="flex items-center border rounded-full p-0.5 gap-1">
                      <Button
                        variant="ghost"
                        className="h-7 w-7 rounded-full p-0 hover:bg-gray-100"
                        size="icon"
                        disabled={quantity <= 1 || isAddingToCart}
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      >
                        <Minus className="w-3.5 h-3.5" />
                        <span className="sr-only">Azalt</span>
                      </Button>
                      <span className="font-medium text-sm w-7 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        className="h-7 w-7 rounded-full p-0 hover:bg-gray-100"
                        size="icon"
                        disabled={quantity >= productDetails.totalStock || isAddingToCart}
                        onClick={() =>
                          setQuantity((prev) =>
                            Math.min(productDetails.totalStock, prev + 1)
                          )
                        }
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="sr-only">Arttır</span>
                      </Button>
                    </div>

                    {/* Add to Cart Button - Center */}
                    <Button
                      className="flex-1 h-8 text-sm"
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? "Ekleniyor..." : `Sepete Ekle (${quantity})`}
                    </Button>
                  </div>
                  {/* Özellikler butonu küçük ekranda alta, büyük ekranda sağda */}
                  <Button
                    variant="outline"
                    className="h-8 text-sm w-full sm:w-auto"
                    onClick={() => navigate(`/shop/product/${productDetails._id}/specs`)}
                    disabled={isAddingToCart}
                  >
                    Özellikler
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
            <h2 className="text-base font-semibold mb-2 text-gray-800">
              Yorumlar
            </h2>

            <div className="grid gap-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-3" key={reviewItem._id}>
                    <Avatar className="w-7 h-7 border">
                      <AvatarFallback className="text-xs">
                        {reviewItem?.userName
                          ? reviewItem.userName[0].toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-xs sm:text-sm">
                          {reviewItem?.userName || "Anonim"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5 pointer-events-none">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-snug">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-gray-500">
                  Henüz yorum yapılmamış.
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t pt-4">
              <Label className="text-sm font-medium text-gray-700">
                Yorum Yaz
              </Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Textarea
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Yorumunuzu buraya yazın..."
                rows={3}
                className="text-sm"
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating === 0}
                size="sm"
              >
                Yorumu Gönder
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

ProductDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  productDetails: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    totalStock: PropTypes.number,
  }),
};

export default ProductDetailsDialog;
