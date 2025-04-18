// import { Minus, Plus, Trash } from "lucide-react";
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
// import { useToast } from "../ui/use-toast";

// function UserCartItemsContent({ cartItem }) {
//   const { user } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { productList } = useSelector((state) => state.shopProducts);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   function handleUpdateQuantity(getCartItem, typeOfAction) {
//     if (typeOfAction == "plus") {
//       let getCartItems = cartItems.items || [];

//       if (getCartItems.length) {
//         const indexOfCurrentCartItem = getCartItems.findIndex(
//           (item) => item.productId === getCartItem?.productId
//         );

//         const getCurrentProductIndex = productList.findIndex(
//           (product) => product._id === getCartItem?.productId
//         );
//         const getTotalStock = productList[getCurrentProductIndex].totalStock;

//         console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

//         if (indexOfCurrentCartItem > -1) {
//           const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
//           if (getQuantity + 1 > getTotalStock) {
//             toast({
//               title: `Only ${getQuantity} quantity can be added for this item`,
//               variant: "destructive",
//             });

//             return;
//           }
//         }
//       }
//     }

//     dispatch(
//       updateCartQuantity({
//         userId: user?.id,
//         productId: getCartItem?.productId,
//         quantity:
//           typeOfAction === "plus"
//             ? getCartItem?.quantity + 1
//             : getCartItem?.quantity - 1,
//       })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         toast({
//           title: "Cart item is updated successfully",
//         });
//       }
//     });
//   }

//   function handleCartItemDelete(getCartItem) {
//     dispatch(
//       deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         toast({
//           title: "Cart item is deleted successfully",
//         });
//       }
//     });
//   }

//   return (
//     <div className="flex items-center space-x-4">
//       <img
//         src={cartItem?.image}
//         alt={cartItem?.title}
//         className="w-20 h-20 rounded object-cover"
//       />
//       <div className="flex-1">
//         <h3 className="font-extrabold">{cartItem?.title}</h3>
//         <div className="flex items-center gap-2 mt-1">
//           <Button
//             variant="outline"
//             className="h-8 w-8 rounded-full"
//             size="icon"
//             disabled={cartItem?.quantity === 1}
//             onClick={() => handleUpdateQuantity(cartItem, "minus")}
//           >
//             <Minus className="w-4 h-4" />
//             <span className="sr-only">Decrease</span>
//           </Button>
//           <span className="font-semibold">{cartItem?.quantity}</span>
//           <Button
//             variant="outline"
//             className="h-8 w-8 rounded-full"
//             size="icon"
//             onClick={() => handleUpdateQuantity(cartItem, "plus")}
//           >
//             <Plus className="w-4 h-4" />
//             <span className="sr-only">Decrease</span>
//           </Button>
//         </div>
//       </div>
//       <div className="flex flex-col items-end">
//         <p className="font-semibold">
//           {(
//             (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
//             cartItem?.quantity
//           ).toFixed(2)}
//           TL
//         </p>
//         <Trash
//           onClick={() => handleCartItemDelete(cartItem)}
//           className="cursor-pointer mt-1"
//           size={20}
//         />
//       </div>
//     </div>
//   );
// }

// export default UserCartItemsContent;

// Gemini klasor birlestirme/client/src/components/shopping-view/cart-items-content.jsx

import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
// *** YENİ Importlar ***
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate ve useLocation eklendi
// ***---***
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem, readOnly = false }) {
  // readOnly prop eklendi
  // *** YENİ Hook Kullanımları ***
  const { user, isAuthenticated } = useSelector((state) => state.auth); // isAuthenticated eklendi
  const navigate = useNavigate();
  const location = useLocation();
  // ***---***
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    // *** YENİ KONTROL ***
    if (!isAuthenticated) {
      toast({
        title: "Lütfen giriş yapın",
        description: "Sepeti güncellemek için giriş yapmanız gerekmektedir.",
        variant: "destructive",
      });
      navigate("/auth/login", { state: { from: location } });
      return;
    }

    // --- Var olan miktar kontrolü ve dispatch ---
    if (typeOfAction === "plus") {
      // ... (stok kontrolü aynı kalır)
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        // Ürün listede bulunamazsa veya stok bilgisi yoksa hata ver
        if (
          getCurrentProductIndex === -1 ||
          !productList[getCurrentProductIndex]?.totalStock
        ) {
          toast({
            title: "Stok bilgisi alınamadı.",
            variant: "destructive",
          });
          return;
        }

        const getTotalStock = productList[getCurrentProductIndex].totalStock;
        console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Bu üründen yalnızca ${getQuantity} adet eklenebilir`,
              variant: "info",
            });
            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Sepet güncellendi",
          variant: "success", // Başarı mesajı için yeşil tema
        });
      }
      // Hata durumu
      else {
        toast({
          title: "Güncelleme Başarısız",
          description: data.payload?.message || "Bir hata oluştu.",
          variant: "destructive",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    // *** YENİ KONTROL ***
    if (!isAuthenticated) {
      toast({
        title: "Lütfen giriş yapın",
        description: "Sepetten ürün silmek için giriş yapmanız gerekmektedir.",
        variant: "warning",
      });
      navigate("/auth/login", { state: { from: location } });
      return;
    }
    // *** KONTROL SONU ***

    // --- Var olan silme dispatch ---
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Ürün sepetten silindi",
          variant: "success", // Kırmızı tema
        });
      } else {
        toast({
          title: "Silme Başarısız",
          description: data.payload?.message || "Bir hata oluştu.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image || "placeholder.png"} // Varsayılan resim eklenebilir
        alt={cartItem?.title || "Ürün"}
        className="w-16 h-16 md:w-20 md:h-20 rounded object-cover border" // Boyut ve border eklendi
      />
      <div className="flex-1 min-w-0">
        {" "}
        {/* min-w-0 taşmayı önler */}
        <h3 className="font-semibold text-sm md:text-base truncate">
          {" "}
          {/* truncate eklendi */}
          {cartItem?.title || "Ürün Adı Yok"}
        </h3>
        {/* Sadece sepet görünümünde göster (checkout'ta gizle) */}
        {!readOnly && (
          <div className="flex items-center gap-2 mt-1">
            <Button
              variant="outline"
              className="h-7 w-7 md:h-8 md:w-8 rounded-full p-0" // padding sıfırlandı
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="sr-only">Azalt</span>
            </Button>
            <span className="font-semibold text-sm md:text-base w-6 text-center">
              {" "}
              {/* Genişlik ve hizalama */}
              {cartItem?.quantity}
            </span>
            <Button
              variant="outline"
              className="h-7 w-7 md:h-8 md:w-8 rounded-full p-0"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="sr-only">Arttır</span>
            </Button>
          </div>
        )}
        {/* Checkout sayfasında sadece miktarı göster */}
        {readOnly && (
          <p className="text-sm text-gray-600 mt-1">
            Adet: {cartItem?.quantity}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end flex-shrink-0 ml-2">
        {" "}
        {/* ml-2 eklendi */}
        <p className="font-semibold text-sm md:text-base">
          {(
            (cartItem?.salePrice > 0
              ? cartItem?.salePrice
              : cartItem?.price || 0) * // price null kontrolü
            cartItem?.quantity
          ).toFixed(2)}{" "}
          TL
        </p>
        {/* Sadece sepet görünümünde göster */}
        {!readOnly && (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100 h-7 w-7 mt-1" // Boyut ve margin ayarlandı
            onClick={() => handleCartItemDelete(cartItem)}
          >
            <Trash className="w-4 h-4" />
            <span className="sr-only">Sil</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserCartItemsContent;
