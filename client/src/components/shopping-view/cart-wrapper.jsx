import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

import UserCartItemsContent from "./cart-items-content";
import {
  SheetContent,
  SheetDescription, // Açıklama için eklenebilir
  SheetFooter, // Footer için eklenebilir (opsiyonel, manuel div de olur)
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { ShoppingCart } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems?.reduce(
      (sum, currentItem) =>
        sum +
        (currentItem?.salePrice > 0
          ? currentItem?.salePrice
          : currentItem?.price || 0) * // Fiyat null ise 0 kabul et
          (currentItem?.quantity || 0), // Miktar null ise 0 kabul et
      0
    ) || 0; // cartItems null veya undefined ise 0

  // Ödeme sayfasına gitme fonksiyonu
  const handleCheckout = () => {
    // Sepet boşsa gitme (buton zaten disabled olacak ama ekstra kontrol)
    if (!cartItems || cartItems.length === 0) return;
    navigate("/shop/checkout");
    setOpenCartSheet(false); // Sheet'i kapat
  };

  // return (
  //   <SheetContent className="sm:max-w-md">
  //     <SheetHeader>
  //       <SheetTitle>Sepetiniz</SheetTitle>
  //     </SheetHeader>
  //     <div className="mt-8 space-y-4">
  //       {cartItems && cartItems.length > 0
  //         ? cartItems.map((item) => <UserCartItemsContent cartItem={item} />)
  //         : null}
  //     </div>
  //     <div className="mt-8 space-y-4">
  //       <div className="flex justify-between">
  //         <span className="font-bold">Toplam</span>
  //         <span className="font-bold">{totalCartAmount} TL</span>
  //       </div>
  //     </div>
  //     <Button
  //       onClick={() => {
  //         navigate("/shop/checkout");
  //         setOpenCartSheet(false);
  //       }}
  //       className="w-full mt-6"
  //     >
  //       Ödeme Sayfasına Git
  //     </Button>
  //   </SheetContent>
  // );

  return (
    // sm:max-w-lg daha geniş bir panel için
    <SheetContent className="sm:max-w-lg flex flex-col">
      <SheetHeader className="px-6 pt-6 pb-4 border-b">
        <SheetTitle className="text-lg font-semibold">Sepetiniz</SheetTitle>
        {/* İsteğe bağlı: Sepette kaç ürün olduğunu belirten bir açıklama */}
        {cartItems && cartItems.length > 0 && (
          <SheetDescription>
            {cartItems.length} ürün sepetinizde bulunuyor.
          </SheetDescription>
        )}
      </SheetHeader>

      {/* Ürün Listesi (Kaydırılabilir Alan) */}
      <div className="flex-1 overflow-y-auto">
        {" "}
        {/* flex-1 ile genişleyip kalan alanı doldurur */}
        <div className="p-6 space-y-4">
          {" "}
          {/* Padding ve ürünler arası boşluk */}
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <UserCartItemsContent
                // Key olarak productId'yi kullanmak daha güvenli
                key={item.productId?._id || item.productId}
                cartItem={item}
                // cart-wrapper içinde miktar değiştirme/silme işlemleri olacak
                readOnly={false}
              />
            ))
          ) : (
            // Boş Sepet Durumu
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-10">
              <ShoppingCart className="w-12 h-12 mb-4 text-gray-400" />
              <p>Sepetiniz şu anda boş.</p>
              <p className="text-sm mt-1">
                Hemen alışverişe başlayıp sepetinizi doldurun!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alt Kısım: Toplam ve Buton (Sabit Alan) */}
      {/* Sadece sepette ürün varsa göster */}
      {cartItems && cartItems.length > 0 && (
        <div className="border-t p-6 space-y-4">
          {" "}
          {/* Üst kenarlık ve padding */}
          <Separator className="my-2" /> {/* Toplamdan önce ayırıcı */}
          <div className="flex justify-between text-base font-medium">
            <span>Toplam Tutar:</span>
            <span className="font-bold text-lg">
              {" "}
              {/* Toplamı vurgula */}
              {totalCartAmount.toFixed(2)} TL
            </span>
          </div>
          <Button
            onClick={handleCheckout}
            className="w-full text-base py-3" // Daha belirgin buton
            // Sepet boşsa butonu devre dışı bırakmaya gerek yok, çünkü bu bölüm zaten gösterilmeyecek
            // disabled={!cartItems || cartItems.length === 0}
          >
            Ödeme Sayfasına Git
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
