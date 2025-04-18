import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import StarRatingComponent from "../common/star-rating";
import { Heart } from "lucide-react"; // <-- Heart ikonunu import et
import { useDispatch, useSelector } from "react-redux"; // <-- useSelector'ı import et
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "@/store/shop/wishlist-slice"; // <-- Wishlist action'larını import et
import { useEffect } from "react"; // <-- useEffect import et (isteğe bağlı, ilk yüklemede fetch için)
import { useToast } from "../ui/use-toast"; // <-- Toast import et (isteğe bağlı, bildirim için)
import { useNavigate, useLocation } from "react-router-dom";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth); // isAuthenticated'ı al
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast(); // İsteğe bağlı bildirim için
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state) => state.shopWishlist
  );

  const isWishlisted = product?._id && wishlistItems.includes(product._id);

  const handleWishlistToggle = (event) => {
    event.stopPropagation(); // Kartın tıklanmasını engelle (detaylara gitmeyi)

    if (!user?.id) {
      toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
      return;
    }

    if (isWishlisted) {
      // Favorilerden çıkar
      dispatch(removeFromWishlist({ userId: user.id, productId: product._id }))
        .unwrap() // Hata yakalamak için unwrap kullanabiliriz
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
      // Favorilere ekle
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

  return (
    <Card className="w-full max-w-sm mx-auto relative group">
      {/* Favori Butonu - Sağ Üst Köşe */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/70 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity" // <-- Konumlandırma ve stil
        onClick={handleWishlistToggle}
        disabled={wishlistLoading} // Butonu yüklenirken devre dışı bırak (isteğe bağlı)
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
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-contain rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Stokta Yok
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Sadece ${product?.totalStock} ürün kaldı`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              İndirim
            </Badge>
          ) : null}
        </div>

        <CardContent className="p-4 pb-1">
          <div className="flex justify-between items-center">
            <h2 className="text-md font-semibold mb-1">{product?.title}</h2>
          </div>
          <div className="flex justify-between items-center pr-4">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through-red" : ""
              } text-lg font-semibold text-muted-foreground`}
            >
              {product?.price}TL
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-green-600">
                {product?.salePrice}TL
              </span>
            ) : null}
          </div>
        </CardContent>
        {/* Rating gösterimi */}
        <div className="flex justify-between items-center px-4 pb-4">
          {product?.averageReview !== undefined && (
            <div className="flex items-center justify-center ">
              <StarRatingComponent rating={product.averageReview} />
              <span className="text-sm text-muted-foreground font-semibold ">
                ({product.averageReview.toFixed(1)})
              </span>
            </div>
          )}
        </div>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Stokta Yok
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            Sepete Ekle
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
