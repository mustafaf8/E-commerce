// import { Heart, StarIcon } from "lucide-react"; // <-- Heart ikonunu import et
// import { Avatar, AvatarFallback } from "../ui/avatar";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent } from "../ui/dialog";
// import { Separator } from "../ui/separator";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea"; // Import Textarea component
// import { useDispatch, useSelector } from "react-redux"; // <-- useSelector import
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { useToast } from "../ui/use-toast";
// import { setProductDetails } from "@/store/shop/products-slice";
// import { Label } from "../ui/label";
// import StarRatingComponent from "../common/star-rating";
// import { useEffect, useState } from "react";
// import { addReview, getReviews } from "@/store/shop/review-slice";
// import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice"; // <-- Wishlist action'larını import et

// function ProductDetailsDialog({ open, setOpen, productDetails }) {
//   const [reviewMsg, setReviewMsg] = useState("");
//   const [rating, setRating] = useState(0);
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { reviews } = useSelector((state) => state.shopReview);
//   const { wishlistItems, isLoading: wishlistLoading } = useSelector(
//     (state) => state.shopWishlist
//   ); // <-- Wishlist state'ini al
//   const { toast } = useToast();

//   // Ürünün favorilerde olup olmadığını kontrol et
//   const isWishlisted =
//     productDetails?._id && wishlistItems.includes(productDetails._id);

//   // --- Wishlist Toggle Handler ---
//   const handleWishlistToggle = () => {
//     if (!user?.id) {
//       toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
//       return;
//     }
//     if (isWishlisted) {
//       dispatch(
//         removeFromWishlist({ userId: user.id, productId: productDetails._id })
//       )
//         .unwrap()
//         .then(() => toast({ title: "Favorilerden çıkarıldı." }))
//         .catch((error) =>
//           toast({
//             variant: "destructive",
//             title: error.message || "Favorilerden çıkarılamadı.",
//           })
//         );
//     } else {
//       dispatch(
//         addToWishlist({ userId: user.id, productId: productDetails._id })
//       )
//         .unwrap()
//         .then(() => toast({ title: "Favorilere eklendi." }))
//         .catch((error) =>
//           toast({
//             variant: "destructive",
//             title: error.message || "Favorilere eklenemedi.",
//           })
//         );
//     }
//   };
//   // --- ---

//   // --- Mevcut Fonksiyonlar ---
//   function handleRatingChange(getRating) {
//     setRating(getRating);
//   }

//   function handleAddToCart(getCurrentProductId, getTotalStock) {
//     // ... (mevcut kod aynı kalır) ...
//     let getCartItems = cartItems.items || [];

//     if (getCartItems.length) {
//       const indexOfCurrentItem = getCartItems.findIndex(
//         (item) => item.productId === getCurrentProductId
//       );
//       if (indexOfCurrentItem > -1) {
//         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
//         if (getQuantity + 1 > getTotalStock) {
//           toast({
//             title: `Bu ürün için yalnızca ${getQuantity} adet eklenebilir`,
//             variant: "destructive",
//           });

//           return;
//         }
//       }
//     }
//     dispatch(
//       addToCart({
//         userId: user?.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast({
//           title: "Ürün sepete eklendi",
//         });
//       }
//     });
//   }

//   function handleDialogClose() {
//     setOpen(false);
//     dispatch(setProductDetails());
//     setRating(0);
//     setReviewMsg("");
//   }

//   function handleAddReview() {
//     dispatch(
//       addReview({
//         productId: productDetails?._id,
//         userId: user?.id,
//         userName: user?.userName,
//         reviewMessage: reviewMsg,
//         reviewValue: rating,
//       })
//     ).then((data) => {
//       if (data.payload.success) {
//         setRating(0);
//         setReviewMsg("");
//         dispatch(getReviews(productDetails?._id));
//         toast({
//           title: "Yorum başarıyla eklendi!",
//         });
//       }
//     });
//   }

//   useEffect(() => {
//     if (productDetails !== null) dispatch(getReviews(productDetails?._id));
//   }, [productDetails, dispatch]); // dispatch eklendi

//   const averageReview =
//     reviews && reviews.length > 0
//       ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
//         reviews.length
//       : 0;

//   return (
//     <Dialog open={open} onOpenChange={handleDialogClose}>
//       <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[85vw] lg:max-w-[80vw]">
//         <div className="relative overflow-hidden rounded-lg">
//           <img
//             src={productDetails?.image}
//             alt={productDetails?.title}
//             width={600}
//             height={600}
//             className="aspect-square w-full object-contain"
//           />
//         </div>
//         <div className="">
//           <div className="flex justify-between items-start mb-3">
//             <h1 className="text-2xl font-extrabold">{productDetails?.title}</h1>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 flex-shrink-0" // boyut ayarlandı
//               onClick={handleWishlistToggle}
//               disabled={wishlistLoading}
//             >
//               <Heart
//                 className={`w-6 h-6 ${
//                   isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
//                 }`}
//               />
//               <span className="sr-only">
//                 {isWishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
//               </span>
//             </Button>
//           </div>
//           <p className="text-muted-foreground text-lg mb-4">
//             {productDetails?.description}
//           </p>
//           <div className="flex items-center justify-between">
//             <p
//               className={`text-2xl font-bold text-primary ${
//                 productDetails?.salePrice > 0 ? "line-through" : ""
//               }`}
//             >
//               <span className="text-muted-foreground line-through-red">
//                 {productDetails?.price} TL
//               </span>
//             </p>
//             {productDetails?.salePrice > 0 ? (
//               <p className="text-2xl font-bold pr-0 text-green-600">
//                 {productDetails?.salePrice} TL
//               </p>
//             ) : null}
//           </div>
//           <div className="flex items-center  mt-2">
//             <div className="flex items-center gap-0.5 ">
//               <StarRatingComponent rating={averageReview} />
//             </div>
//             <span className="text-muted-foreground font-semibold  ">
//               ({averageReview.toFixed(1)})
//             </span>
//           </div>
//           <div className="mt-5 mb-5">
//             {productDetails?.totalStock === 0 ? (
//               <Button className="w-full opacity-60 cursor-not-allowed">
//                 Stokta Yok
//               </Button>
//             ) : (
//               <Button
//                 className="w-full"
//                 onClick={() =>
//                   handleAddToCart(
//                     productDetails?._id,
//                     productDetails?.totalStock
//                   )
//                 }
//               >
//                 Sepete Ekle
//               </Button>
//             )}
//           </div>
//           <Separator />
//           <div className="max-h-[300px] overflow-auto">
//             <h2 className="text-lg font-bold mb-4 m-5 ml-0">Yorumlar</h2>
//             <div className="grid gap-6">
//               {reviews && reviews.length > 0 ? (
//                 reviews.map((reviewItem) => (
//                   <div className="flex gap-4">
//                     <Avatar className="w-8 h-8 border">
//                       <AvatarFallback>
//                         {reviewItem?.userName[0].toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid gap-1">
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-semibold text-sm">
//                           {reviewItem?.userName}
//                         </h3>
//                       </div>
//                       <div className="w-4 h-4 flex items-center gap-0.5">
//                         <StarRatingComponent rating={reviewItem?.reviewValue} />
//                       </div>
//                       <p className="pl-2 p-1 text-muted-foreground">
//                         {reviewItem.reviewMessage}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <h1>Yorum Yok</h1>
//               )}
//             </div>
//             <div className="mt-10 flex-col flex gap-2">
//               <Label>Yorum Yaz</Label>
//               <div className="flex gap-1">
//                 <StarRatingComponent
//                   rating={rating}
//                   handleRatingChange={handleRatingChange}
//                 />
//               </div>
//               <Input
//                 name="reviewMsg"
//                 value={reviewMsg}
//                 onChange={(event) => setReviewMsg(event.target.value)}
//                 placeholder="Bir yorum yazın..."
//               />
//               <Button
//                 onClick={handleAddReview}
//                 disabled={reviewMsg.trim() === ""}
//               >
//                 Gönder
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default ProductDetailsDialog;

// Gemini klasor birlestirme/client/src/components/shopping-view/product-details.jsx

// import { Heart, StarIcon } from "lucide-react";
// import { Avatar, AvatarFallback } from "../ui/avatar";
// import { Button } from "../ui/button";
// import { Dialog, DialogContent } from "../ui/dialog";
// import { Separator } from "../ui/separator";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// // *** YENİ Importlar ***
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom"; // useNavigate ve useLocation eklendi
// // ***---***
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { useToast } from "../ui/use-toast";
// import { setProductDetails } from "@/store/shop/products-slice";
// import { Label } from "../ui/label";
// import StarRatingComponent from "../common/star-rating";
// import { useEffect, useState } from "react";
// import { addReview, getReviews } from "@/store/shop/review-slice";
// import { addToWishlist, removeFromWishlist } from "@/store/shop/wishlist-slice";

// import PropTypes from "prop-types";

// function ProductDetailsDialog({ open, setOpen, productDetails }) {
//   const [reviewMsg, setReviewMsg] = useState("");
//   const [rating, setRating] = useState(0);
//   const dispatch = useDispatch();
//   // *** YENİ Hook Kullanımları ***
//   const {
//     user,
//     isAuthenticated,
//     isLoading: authLoading,
//   } = useSelector((state) => state.auth); // isAuthenticated ve isLoading eklendi
//   const navigate = useNavigate(); // useNavigate hook'u
//   const location = useLocation(); // useLocation hook'u
//   // ***---***
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { reviews } = useSelector((state) => state.shopReview);
//   const { wishlistItems, isLoading: wishlistLoading } = useSelector(
//     (state) => state.shopWishlist
//   );
//   const { toast } = useToast();

//   const isWishlisted =
//     productDetails?._id && wishlistItems.includes(productDetails._id);

//   // --- Wishlist Toggle Handler ---
//   const handleWishlistToggle = () => {
//     // *** KONTROL (Zaten vardı, ama teyit edelim) ***
//     if (!isAuthenticated) {
//       // isAuthenticated kullanılıyor
//       toast({ variant: "destructive", title: "Lütfen önce giriş yapın." });
//       navigate("/auth/login", { state: { from: location } }); // Yönlendirme
//       return;
//     }
//     // --- Var olan favori işlemleri ---
//     if (isWishlisted) {
//       dispatch(
//         removeFromWishlist({ userId: user.id, productId: productDetails._id })
//       )
//         .unwrap()
//         .then(() =>
//           toast({ title: "Favorilerden çıkarıldı.", variant: "success" })
//         )
//         .catch((error) =>
//           toast({
//             variant: "destructive",
//             title: error.message || "Favorilerden çıkarılamadı.",
//           })
//         );
//     } else {
//       dispatch(
//         addToWishlist({ userId: user.id, productId: productDetails._id })
//       )
//         .unwrap()
//         .then(() => toast({ title: "Favorilere eklendi.", variant: "success" }))
//         .catch((error) =>
//           toast({
//             variant: "destructive",
//             title: error.message || "Favorilere eklenemedi.",
//           })
//         );
//     }
//   };

//   // --- Mevcut Fonksiyonlar ---
//   function handleRatingChange(getRating) {
//     setRating(getRating);
//   }

//   function handleAddToCart(getCurrentProductId, getTotalStock) {
//     // *** YENİ KONTROL ***
//     if (!isAuthenticated) {
//       toast({
//         title: "Lütfen giriş yapın",
//         description: "Sepete ürün eklemek için giriş yapmanız gerekmektedir.",
//         variant: "destructive",
//       });
//       navigate("/auth/login", { state: { from: location } });
//       return;
//     }
//     // *** KONTROL SONU ***

//     // --- Var olan sepet kontrolü ve dispatch ---
//     let getCartItems = cartItems.items || [];
//     if (getCartItems.length) {
//       // ... (stok kontrolü aynı kalır)
//       const indexOfCurrentItem = getCartItems.findIndex(
//         (item) => item.productId === getCurrentProductId
//       );
//       if (indexOfCurrentItem > -1) {
//         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
//         if (getQuantity + 1 > getTotalStock) {
//           toast({
//             title: `Bu ürün için yalnızca ${getQuantity} adet eklenebilir`,
//             variant: "info",
//           });

//           return;
//         }
//       }
//     }
//     dispatch(
//       addToCart({
//         userId: user?.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast({
//           title: "Ürün sepete eklendi",
//           variant: "success",
//         });
//       }
//     });
//   }

//   function handleDialogClose() {
//     setOpen(false);
//     dispatch(setProductDetails());
//     setRating(0);
//     setReviewMsg("");
//   }

//   async function handleAddReview() {
//     if (!isAuthenticated) {
//       toast({
//         title: "Lütfen giriş yapın",
//         description: "Ürüne yorum yapmak için giriş yapmanız gerekmektedir.",
//         variant: "destructive",
//       });
//       navigate("/auth/login", { state: { from: location } });
//       return;
//     }
//     try {
//       const reviewData = {
//         productId: productDetails?._id,
//         userId: user?.id,
//         userName: user?.userName,
//         reviewMessage: reviewMsg,
//         reviewValue: rating,
//       };

//       // 3. dispatch işlemini await ile bekle ve .unwrap() kullan
//       //    Başarılı olursa devam eder, başarısız olursa catch bloğuna düşer.
//       await dispatch(addReview(reviewData)).unwrap();

//       // 4. Başarı Durumu (Sadece try bloğunda çalışır)
//       setRating(0);
//       setReviewMsg("");
//       dispatch(getReviews(productDetails?._id)); // Yorumları yeniden çek
//       toast({
//         variant: "success", // Başarı varyantı
//         title: "Yorum Başarıyla Eklendi!",
//         // description: "Yorumunuz için teşekkürler." // Opsiyonel açıklama
//       });
//     } catch (error) {
//       // 5. Hata Durumu (catch bloğunda çalışır)
//       console.error("Yorum ekleme hatası yakalandı:", error);

//       // `error` objesi genellikle thunk'tan rejectWithValue ile dönen değeri içerir
//       // Bu değer backend'den gelen { success: false, message: "..." } objesi olmalı
//       toast({
//         variant: "destructive",
//         title: "Yorum Eklenemedi", // Genel bir başlık
//         // Açıklama olarak backend'den gelen spesifik hata mesajını kullan
//         description: error?.message || "Beklenmedik bir hata oluştu.",
//       });
//     }
//   }

//   useEffect(() => {
//     if (productDetails !== null) dispatch(getReviews(productDetails?._id));
//   }, [productDetails, dispatch]);

//   const averageReview =
//     reviews && reviews.length > 0
//       ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
//         reviews.length
//       : 0;

//   return (
//     <Dialog open={open} onOpenChange={handleDialogClose}>
//       {/* Dialog içeriği (görsel kısım) aynı kalır */}
//       <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-8 lg:p-12 max-w-[90vw] sm:max-w-[85vw] lg:max-w-[80vw]">
//         {/* Sol Taraf: Resim */}
//         <div className="relative overflow-hidden rounded-lg aspect-square max-h-[60vh] flex items-center justify-center bg-gray-100">
//           {productDetails?.image ? (
//             <img
//               src={productDetails?.image}
//               alt={productDetails?.title}
//               className="max-w-full max-h-full object-contain" // aspect-square kaldırıldı, object-contain eklendi
//             />
//           ) : (
//             <span className="text-gray-400">Resim Yok</span>
//           )}
//         </div>

//         {/* Sağ Taraf: Detaylar ve Yorumlar */}
//         <div className="flex flex-col max-h-[80vh]">
//           {" "}
//           {/* Maksimum yükseklik ve flex column */}
//           {/* Üst Kısım: Ürün Bilgileri ve Butonlar */}
//           <div className="flex-shrink-0 pb-4 border-b">
//             {" "}
//             {/* Sabit kısım */}
//             <div className="flex justify-between items-start mb-3">
//               <h1 className="text-2xl font-extrabold pr-2">
//                 {productDetails?.title}
//               </h1>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-9 w-9 flex-shrink-0"
//                 onClick={handleWishlistToggle}
//                 disabled={wishlistLoading} // Wishlist yüklenirken butonu devre dışı bırak
//               >
//                 <Heart
//                   className={`w-6 h-6 ${
//                     isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"
//                   }`}
//                 />
//                 <span className="sr-only">
//                   {isWishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
//                 </span>
//               </Button>
//             </div>
//             <p className="text-muted-foreground text-base mb-4">
//               {" "}
//               {/* text-lg -> text-base */}
//               {productDetails?.description}
//             </p>
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-2xl font-bold text-primary">
//                 {productDetails?.salePrice > 0 ? (
//                   <>
//                     <span className="text-muted-foreground line-through-red mr-2">
//                       {productDetails?.price} TL
//                     </span>
//                     <span className="text-green-600">
//                       {productDetails?.salePrice} TL
//                     </span>
//                   </>
//                 ) : (
//                   <span>{productDetails?.price} TL</span>
//                 )}
//               </p>
//             </div>
//             <div className="flex items-center mt-2">
//               <div className="flex items-center gap-0.5">
//                 <StarRatingComponent rating={averageReview} />
//               </div>
//               <span className="text-muted-foreground font-semibold ml-1">
//                 ({averageReview.toFixed(1)})
//               </span>
//             </div>
//             <div className="mt-5 mb-1">
//               {productDetails?.totalStock === 0 ? (
//                 <Button
//                   className="w-full opacity-60 cursor-not-allowed"
//                   disabled
//                 >
//                   Stokta Yok
//                 </Button>
//               ) : (
//                 <Button
//                   className="w-full"
//                   onClick={() =>
//                     handleAddToCart(
//                       productDetails?._id,
//                       productDetails?.totalStock
//                     )
//                   }
//                 >
//                   Sepete Ekle
//                 </Button>
//               )}
//             </div>
//           </div>
//           {/* Alt Kısım: Yorumlar (Kaydırılabilir) */}
//           <div className="flex-grow overflow-y-auto pt-4 pr-2">
//             {" "}
//             {/* Kaydırma ve padding */}
//             <h2 className="text-lg font-bold mb-4">Yorumlar</h2>
//             <div className="grid gap-6">
//               {reviews && reviews.length > 0 ? (
//                 reviews.map((reviewItem) => (
//                   <div className="flex gap-4" key={reviewItem._id}>
//                     {" "}
//                     {/* key eklendi */}
//                     <Avatar className="w-8 h-8 border">
//                       <AvatarFallback>
//                         {reviewItem?.userName
//                           ? reviewItem.userName[0].toUpperCase()
//                           : "?"}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid gap-1">
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-semibold text-sm">
//                           {reviewItem?.userName || "Anonim"}
//                         </h3>
//                       </div>
//                       <div className="flex items-center gap-0.5">
//                         {" "}
//                         {/* StarRatingComponent flex container içinde */}
//                         <StarRatingComponent rating={reviewItem?.reviewValue} />
//                       </div>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         {" "}
//                         {/* text-sm ve mt-1 */}
//                         {reviewItem.reviewMessage}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-gray-500">Henüz yorum yapılmamış.</p>
//               )}
//             </div>
//             {/* Yorum Ekleme Formu */}
//             <div className="mt-8 flex flex-col gap-3 border-t pt-4">
//               <Label>Yorum Yaz</Label>
//               <div className="flex gap-1">
//                 <StarRatingComponent
//                   rating={rating}
//                   handleRatingChange={handleRatingChange}
//                 />
//               </div>
//               <Textarea // Textarea kullanıldı
//                 name="reviewMsg"
//                 value={reviewMsg}
//                 onChange={(event) => setReviewMsg(event.target.value)}
//                 placeholder="Yorumunuzu buraya yazın..."
//                 rows={3} // Yüksekliği ayarla
//               />
//               <Button
//                 onClick={handleAddReview}
//                 disabled={reviewMsg.trim() === "" || rating === 0} // Rating 0 ise de disable
//                 size="sm" // Buton boyutu
//               >
//                 Yorumu Gönder
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
// ProductDetailsDialog.propTypes = {
//   open: PropTypes.bool.isRequired,
//   setOpen: PropTypes.func.isRequired,
//   productDetails: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     image: PropTypes.string,
//     title: PropTypes.string,
//     description: PropTypes.string,
//     price: PropTypes.number,
//     salePrice: PropTypes.number,
//     totalStock: PropTypes.number,
//   }),
// };

// export default ProductDetailsDialog;

// client/src/components/shopping-view/product-details.jsx

import { Heart, StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
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

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useSelector((state) => state.auth);
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
      navigate("/auth/login", { state: { from: location } });
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

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!isAuthenticated) {
      toast({
        title: "Lütfen giriş yapın",
        description: "Sepete ürün eklemek için giriş yapmanız gerekmektedir.",
        variant: "destructive",
      });
      navigate("/auth/login", { state: { from: location } });
      return;
    }

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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  async function handleAddReview() {
    if (!isAuthenticated) {
      toast({
        title: "Lütfen giriş yapın",
        description: "Ürüne yorum yapmak için giriş yapmanız gerekmektedir.",
        variant: "destructive",
      });
      navigate("/auth/login", { state: { from: location } });
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
      await dispatch(addReview(reviewData)).unwrap();
      setRating(0);
      setReviewMsg("");
      dispatch(getReviews(productDetails?._id));
      toast({
        variant: "success",
        title: "Yorum Başarıyla Eklendi!",
      });
    } catch (error) {
      console.error("Yorum ekleme hatası yakalandı:", error);
      toast({
        variant: "destructive",
        title: "Yorum Eklenemedi",
        description: error?.message || "Beklenmedik bir hata oluştu.",
      });
    }
  }

  useEffect(() => {
    if (productDetails?._id) {
      // Sadece ID varsa çalıştır
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails?._id, dispatch]); // productDetails yerine productDetails._id bağımlılığı

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // productDetails null veya undefined ise boş içerik göster (veya yükleniyor)
  if (!productDetails) {
    return (
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[600px]">
          {/* İsteğe bağlı: Yükleniyor göstergesi */}
          <p>Yükleniyor...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10 max-w-[90vw] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-hidden">
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

        <div className="flex flex-col max-h-[calc(90vh-4rem)]">
          <div className="flex-shrink-0 pb-4 mb-4 border-b">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-xl sm:text-2xl font-bold pr-2 text-gray-900">
                {productDetails.title}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors" // Hover efekti
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
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {productDetails.description}
            </p>
            {/* ------- FİYAT GÖSTERİMİ BAŞLANGIÇ*/}
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
                      <p className="line-through text-lg text-gray-400 ">
                        {`${productDetails.price.toFixed(2)} TL`}
                      </p>
                    )}

                  <p
                    className={`font-bold ${
                      productDetails?.price &&
                      productDetails.price > 0 &&
                      productDetails.price > productDetails.salePrice
                        ? "text-2xl text-green-600"
                        : "text-2xl text-black"
                    }`}
                  >
                    {`${productDetails.salePrice.toFixed(2)} TL`}
                  </p>
                </div>
              ) : productDetails?.price && productDetails.price > 0 ? (
                <div className="flex justify-start">
                  <p className="text-lg font-semibold text-black">
                    {`${productDetails.price.toFixed(2)} TL`}
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
            {/* ------- FİYAT GÖSTERİMİ SON ------- */}
            <div className="flex items-center mt-1 mb-3">
              <div className="flex items-center gap-0.5 pointer-events-none">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-xs text-gray-500 font-medium ml-1.5">
                ({averageReview.toFixed(1)})
              </span>

              {/* Yorum sayısını gösterme (opsiyonel) */}
              {reviews && reviews.length > 0 && (
                <span className="ml-2 text-xs text-gray-400">
                  ({reviews.length} yorum)
                </span>
              )}
            </div>
            <div className="mt-4 mb-1">
              {" "}
              {/* Boşluk */}
              {productDetails.totalStock === 0 ? (
                <Button
                  className="w-full opacity-60 cursor-not-allowed"
                  disabled
                >
                  Stokta Yok
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() =>
                    handleAddToCart(
                      productDetails._id,
                      productDetails.totalStock
                    )
                  }
                >
                  Sepete Ekle
                </Button>
              )}
            </div>
          </div>
          {/* Alt Kısım: Yorumlar (Kaydırılabilir) */}
          <div className="flex-grow overflow-y-auto pt-2 pr-2 -mr-2 custom-scrollbar">
            {" "}
            {/* Daha iyi kaydırma çubuğu için custom-scrollbar */}
            <h2 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">
              Yorumlar
            </h2>{" "}
            {/* Başlık stili */}
            <div className="grid gap-4">
              {" "}
              {/* Yorumlar arası boşluk */}
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-3" key={reviewItem._id}>
                    {" "}
                    {/* Daha az boşluk */}
                    <Avatar className="w-7 h-7 border">
                      {" "}
                      {/* Avatar küçültüldü */}
                      <AvatarFallback className="text-xs">
                        {" "}
                        {/* Font küçültüldü */}
                        {reviewItem?.userName
                          ? reviewItem.userName[0].toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      {" "}
                      {/* Dikey boşluk azaltıldı */}
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-xs sm:text-sm">
                          {" "}
                          {/* Font boyutu */}
                          {reviewItem?.userName || "Anonim"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 leading-snug">
                        {" "}
                        {/* Font, renk, satır aralığı */}
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
            {/* Yorum Ekleme Formu */}
            <div className="mt-6 flex flex-col gap-2 border-t pt-4">
              {" "}
              {/* Daha az boşluk */}
              <Label className="text-sm font-medium text-gray-700">
                Yorum Yaz
              </Label>{" "}
              {/* Label stili */}
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
                className="text-sm" // Font boyutu
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
