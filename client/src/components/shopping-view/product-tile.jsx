import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import StarRatingComponent from "../common/star-rating";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";
import { useToast } from "../ui/use-toast";
import PropTypes from "prop-types"; // PropTypes kütüphanesini import edin

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state) => state.shopWishlist
  );

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
          ) : product?.salePrice > 0 ? (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-primary/80 text-primary-foreground hover:bg-primary/90"
            >
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
          {product?.averageReview !== undefined && (
            <div className="flex items-center mb-1">
              <StarRatingComponent rating={product.averageReview} />
              <span className="ml-1 text-xs text-muted-foreground font-semibold">
                ({product.averageReview.toFixed(1)})
              </span>
            </div>
          )}
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
  handleGetProductDetails: PropTypes.func.isRequired,
  handleAddtoCart: PropTypes.func.isRequired,
};
export default ShoppingProductTile;

// import { Card, CardContent, CardFooter } from "../ui/card";
// import { Button } from "../ui/button";
// import { brandOptionsMap, categoryOptionsMap } from "@/config";
// import { Badge } from "../ui/badge";
// import StarRatingComponent from "../common/star-rating";
// import { Heart } from "lucide-react"; // <-- Heart ikonunu import et
// import { useDispatch, useSelector } from "react-redux"; // <-- useSelector'ı import et
// import {
//   addToWishlist,
//   // fetchWishlist,
//   removeFromWishlist,
// } from "@/store/shop/wishlist-slice"; // <-- Wishlist action'larını import et
// // import { useEffect } from "react"; // <-- useEffect import et (isteğe bağlı, ilk yüklemede fetch için)
// import { useToast } from "../ui/use-toast"; // <-- Toast import et (isteğe bağlı, bildirim için)
// // import { useNavigate, useLocation } from "react-router-dom";

// function ShoppingProductTile({
//   product,
//   handleGetProductDetails,
//   handleAddtoCart,
// }) {
//   const dispatch = useDispatch();
//   // const { isAuthenticated } = useSelector((state) => state.auth); // isAuthenticated'ı al
//   // const navigate = useNavigate();
//   // const location = useLocation();
//   const { toast } = useToast(); // İsteğe bağlı bildirim için
//   const { user } = useSelector((state) => state.auth);
//   const { wishlistItems, isLoading: wishlistLoading } = useSelector(
//     (state) => state.shopWishlist
//   );

//   const isWishlisted = product?._id && wishlistItems.includes(product._id);

//   const handleWishlistToggle = (event) => {
//     event.stopPropagation(); // Kartın tıklanmasını engelle (detaylara gitmeyi)

//     if (!user?.id) {
//       toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
//       return;
//     }

//     if (isWishlisted) {
//       // Favorilerden çıkar
//       dispatch(removeFromWishlist({ userId: user.id, productId: product._id }))
//         .unwrap() // Hata yakalamak için unwrap kullanabiliriz
//         .then(() => {
//           toast({ title: "Favorilerden çıkarıldı.", variant: "success" });
//         })
//         .catch((error) => {
//           toast({
//             variant: "destructive",
//             title: error.message || "Favorilerden çıkarılamadı.",
//           });
//         });
//     } else {
//       // Favorilere ekle
//       dispatch(addToWishlist({ userId: user.id, productId: product._id }))
//         .unwrap()
//         .then(() => {
//           toast({ title: "Favorilere eklendi.", variant: "success" });
//         })
//         .catch((error) => {
//           toast({
//             variant: "destructive",
//             title: error.message || "Favorilere eklenemedi.",
//           });
//         });
//     }
//   };

//   return (
//     // 1. Ana Card'a flex column ve tam yükseklik ekle
//     <Card className="w-[100%] max-w-sm mx-auto relative group flex flex-col h-full overflow-hidden">
//       <Button
//         variant="ghost"
//         size="icon"
//         className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/70 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
//         onClick={handleWishlistToggle}
//         disabled={wishlistLoading}
//       >
//         <Heart
//           className={`w-5 h-5 ${
//             isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
//           }`}
//         />
//         <span className="sr-only">
//           {isWishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
//         </span>
//       </Button>

//       <div
//         onClick={() => handleGetProductDetails(product?._id)}
//         className="flex flex-col flex-grow cursor-pointer" // flex-grow eklendi
//       >
//         <div className="relative">
//           <img
//             src={product?.image}
//             alt={product?.title}
//             className="w-full h-[230px] sm:h-[230px] object-contain rounded-t-lg p-2"
//           />
//           {/* Badge'ler (Aynı kalır) */}
//           {product?.totalStock === 0 ? (
//             <Badge variant="destructive" className="absolute top-2 left-2">
//               {/* destructive variantı kullanıldı */}
//               Stokta Yok
//             </Badge>
//           ) : product?.totalStock < 10 ? (
//             <Badge variant="destructive" className="absolute top-2 left-2">
//               {/* destructive variantı kullanıldı */}
//               {`Sadece ${product?.totalStock} ürün kaldı`}
//             </Badge>
//           ) : product?.salePrice > 0 ? (
//             <Badge
//               variant="secondary"
//               className="absolute top-2 left-2 bg-primary/80 text-primary-foreground hover:bg-primary/90"
//             >
//               {/* secondary veya custom stil */}
//               İndirim
//             </Badge>
//           ) : null}
//         </div>

//         {/* İçerik kısmı (Başlık, Rating, Fiyat) */}
//         <CardContent className="px-4 pt-0 pb-0 flex flex-col flex-grow">
//           <h2
//             className="text-md font-semibold mb-1 truncate"
//             title={product?.title}
//           >
//             {product?.title}
//           </h2>

//           {product?.averageReview !== undefined && (
//             <div className="flex items-center mb-1">
//               <StarRatingComponent rating={product.averageReview} />
//               <span className="ml-1 text-xs text-muted-foreground font-semibold">
//                 ({product.averageReview.toFixed(1)})
//               </span>
//             </div>
//           )}

//           <div className=" py-2">
//             {product?.salePrice !== undefined && product.salePrice !== null ? (
//               <div
//                 className={`flex flex-col items-baseline ${
//                   product?.price &&
//                   product.price > 0 &&
//                   product.price > product.salePrice
//                     ? "justify-between"
//                     : "justify-start"
//                 } gap-x-2`}
//               >
//                 {/* Eski Fiyatı (price) SADECE indirim varsa göster */}
//                 {product?.price &&
//                   product.price > 0 &&
//                   product.price > product.salePrice && (
//                     <p className="line-through text-sm text-gray-400 font-medium">
//                       {`${product.price.toFixed(2)} TL`}
//                     </p>
//                   )}

//                 <p
//                   className={`font-semibold ${
//                     // Her durumda yarı kalın
//                     // Gerçek indirim varsa yeşil ve biraz daha büyük
//                     product?.price &&
//                     product.price > 0 &&
//                     product.price > product.salePrice
//                       ? "text-lg text-green-600" // İndirimli fiyat stili
//                       : "text-lg text-black" // Normal (indirim olmayan) fiyat stili - SİYAH
//                   }`}
//                 >
//                   {`${product.salePrice.toFixed(2)} TL`}
//                 </p>
//               </div>
//             ) : // salePrice yoksa (beklenmedik durum ama fallback)
//             product?.price && product.price > 0 ? (
//               <div className="flex justify-start">
//                 <p className="text-lg font-semibold text-black">
//                   {`${product.price.toFixed(2)} TL`}
//                 </p>
//               </div>
//             ) : (
//               // Hiç fiyat yoksa
//               <div className="flex justify-start">
//                 <span className="text-sm text-muted-foreground">
//                   Fiyat Bilgisi Yok
//                 </span>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </div>

//       {/* CardFooter zaten en altta kalacak */}
//       <CardFooter className="p-4 pt-0">
//         {/* Padding ayarlandı */}
//         {product?.totalStock === 0 ? (
//           <Button
//             variant="outline"
//             className="w-full opacity-60 cursor-not-allowed"
//           >
//             {/* outline variantı eklendi */}
//             Stokta Yok
//           </Button>
//         ) : (
//           <Button
//             // onClick içindeki handleAddtoCart doğru yazılmalı
//             onClick={(e) => {
//               e.stopPropagation(); // Detaylara gitmeyi engelle
//               handleAddtoCart(product?._id, product?.totalStock);
//             }}
//             className="w-full"
//           >
//             Sepete Ekle
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }

// export default ShoppingProductTile;
