import { Heart, StarIcon } from "lucide-react"; // <-- Heart ikonunu import et
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea"; // Import Textarea component
import { useDispatch, useSelector } from "react-redux"; // <-- useSelector import
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice"; // <-- Wishlist action'larını import et

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state) => state.shopWishlist
  ); // <-- Wishlist state'ini al
  const { toast } = useToast();

  // Ürünün favorilerde olup olmadığını kontrol et
  const isWishlisted =
    productDetails?._id && wishlistItems.includes(productDetails._id);

  // --- Wishlist Toggle Handler ---
  const handleWishlistToggle = () => {
    if (!user?.id) {
      toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
      return;
    }
    if (isWishlisted) {
      dispatch(
        removeFromWishlist({ userId: user.id, productId: productDetails._id })
      )
        .unwrap()
        .then(() => toast({ title: "Favorilerden çıkarıldı." }))
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
        .then(() => toast({ title: "Favorilere eklendi." }))
        .catch((error) =>
          toast({
            variant: "destructive",
            title: error.message || "Favorilere eklenemedi.",
          })
        );
    }
  };
  // --- ---

  // --- Mevcut Fonksiyonlar ---
  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    // ... (mevcut kod aynı kalır) ...
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Bu ürün için yalnızca ${getQuantity} adet eklenebilir`,
            variant: "destructive",
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
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Yorum başarıyla eklendi!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails, dispatch]); // dispatch eklendi

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[85vw] lg:max-w-[80vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-contain"
          />
        </div>
        <div className="">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl font-extrabold">{productDetails?.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 flex-shrink-0" // boyut ayarlandı
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              <Heart
                className={`w-6 h-6 ${
                  isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
              />
              <span className="sr-only">
                {isWishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              </span>
            </Button>
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            {productDetails?.description}
          </p>
          <div className="flex items-center justify-between">
            <p
              className={`text-2xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              <span className="text-muted-foreground line-through-red">
                {productDetails?.price} TL
              </span>
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold pr-0">
                {productDetails?.salePrice} TL
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(1)})
            </span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Stokta Yok
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Sepete Ekle
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-lg font-bold mb-4 m-5 ml-0">Yorumlar</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">
                          {reviewItem?.userName}
                        </h3>
                      </div>
                      <div className="w-4 h-4 flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="pl-2 p-1 text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>Yorum Yok</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Yorum Yaz</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Bir yorum yazın..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Gönder
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
