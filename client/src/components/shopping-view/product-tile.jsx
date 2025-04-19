import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import StarRatingComponent from "../common/star-rating";
import { Heart } from "lucide-react"; // <-- Heart ikonunu import et
import { useDispatch, useSelector } from "react-redux"; // <-- useSelector'ı import et
import {
  addToWishlist,
  // fetchWishlist,
  removeFromWishlist,
} from "@/store/shop/wishlist-slice"; // <-- Wishlist action'larını import et
// import { useEffect } from "react"; // <-- useEffect import et (isteğe bağlı, ilk yüklemede fetch için)
import { useToast } from "../ui/use-toast"; // <-- Toast import et (isteğe bağlı, bildirim için)
// import { useNavigate, useLocation } from "react-router-dom";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  // const { isAuthenticated } = useSelector((state) => state.auth); // isAuthenticated'ı al
  // const navigate = useNavigate();
  // const location = useLocation();
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
    // 1. Ana Card'a flex column ve tam yükseklik ekle
    <Card className="w-full max-w-sm mx-auto relative group flex flex-col h-full overflow-hidden">
      {/* Favori Butonu (Aynı kalır) */}
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

      {/* 2. İçerik div'ine flex-grow ekle */}
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="flex flex-col flex-grow cursor-pointer" // flex-grow eklendi
      >
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[250px] sm:h-[300px] object-contain rounded-t-lg p-2" // Yüksekliği biraz ayarladık ve padding ekledik
          />
          {/* Badge'ler (Aynı kalır) */}
          {product?.totalStock === 0 ? (
            <Badge variant="destructive" className="absolute top-2 left-2">
              {/* destructive variantı kullanıldı */}
              Stokta Yok
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge variant="destructive" className="absolute top-2 left-2">
              {/* destructive variantı kullanıldı */}
              {`Sadece ${product?.totalStock} ürün kaldı`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-primary/80 text-primary-foreground hover:bg-primary/90"
            >
              {/* secondary veya custom stil */}
              İndirim
            </Badge>
          ) : null}
        </div>

        {/* İçerik kısmı (Başlık, Rating, Fiyat) */}
        <CardContent className="px-4 pt-2 pb-2 flex flex-col flex-grow">
          {/* Rating gösterimi (Aynı kalır) */}
          {product?.averageReview !== undefined && (
            <div className="flex items-center mb-1">
              {/* Rating ve başlık arasını biraz açtık */}
              <StarRatingComponent rating={product.averageReview} />
              <span className="ml-1 text-xs text-muted-foreground font-semibold">
                {/* Boyut küçültüldü */}({product.averageReview.toFixed(1)})
              </span>
            </div>
          )}
          <h2
            className="text-md font-semibold mb-1 truncate"
            title={product?.title}
          >
            {product?.title}
          </h2>
          {/* Fiyatlar Bölümü */}
          <div className="mt-auto pt-1">
            {/* Fiyat Konteyneri: İçeriğe göre hizalamayı ayarlar */}
            <div
              className={`flex items-center ${
                // Eğer hem price hem de salePrice (0'dan büyük) varsa, iki uca yasla
                product?.price &&
                product.price > 0 &&
                product?.salePrice &&
                product.salePrice > 0
                  ? "justify-between"
                  : // Diğer durumlarda (sadece biri varsa veya hiç yoksa) sola yasla
                    "justify-start"
              }`}
            >
              {/* Orijinal Fiyatı Göster (Eğer varsa VE indirim yoksa VEYA indirim varsa) */}
              {product?.price && product.price > 0 && (
                <p
                  className={`${
                    // Sadece indirim varsa üstünü çiz, küçük ve soluk yap
                    product?.salePrice && product.salePrice > 0
                      ? "line-through-red text-sm text-muted-foreground"
                      : // İndirim yoksa normal stilde göster
                        "text-lg text-foreground font-semibold"
                  }`}
                >
                  {`${product.price.toFixed(2)} TL`}
                </p>
              )}

              {/* İndirimli Fiyatı Göster (Eğer varsa) */}
              {product?.salePrice && product.salePrice > 0 && (
                <span className="text-lg font-bold text-green-600">
                  {`${product.salePrice.toFixed(2)} TL`}
                </span>
              )}

              {/* HİÇ FİYAT YOKSA (Opsiyonel: Bir mesaj gösterebilirsiniz) */}
              {!product?.price && !product?.salePrice && (
                <span className="text-sm text-muted-foreground">
                  Fiyat Bilgisi Yok
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </div>

      {/* CardFooter zaten en altta kalacak */}
      <CardFooter className="p-4 pt-0">
        {/* Padding ayarlandı */}
        {product?.totalStock === 0 ? (
          <Button
            variant="outline"
            className="w-full opacity-60 cursor-not-allowed"
          >
            {/* outline variantı eklendi */}
            Stokta Yok
          </Button>
        ) : (
          <Button
            // onClick içindeki handleAddtoCart doğru yazılmalı
            onClick={(e) => {
              e.stopPropagation(); // Detaylara gitmeyi engelle
              handleAddtoCart(product?._id, product?.totalStock);
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

export default ShoppingProductTile;
