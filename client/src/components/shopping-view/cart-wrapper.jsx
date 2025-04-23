import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import PropTypes from "prop-types";

import UserCartItemsContent from "./cart-items-content";
import {
  SheetContent,
  SheetDescription, // Açıklama için eklenebilir
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

  return (
    // sm:max-w-lg daha geniş bir panel için
    <SheetContent className="sm:max-w-lg flex flex-col">
      <SheetHeader className="px-6 pt-6 pb-4 border-b">
        <SheetTitle className="text-lg font-semibold">Sepetiniz</SheetTitle>

        {cartItems && cartItems.length > 0 && (
          <SheetDescription>
            {cartItems.length} ürün sepetinizde bulunuyor.
          </SheetDescription>
        )}
      </SheetHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <UserCartItemsContent
                key={item.productId?._id || item.productId}
                cartItem={item}
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
          <Button onClick={handleCheckout} className="w-full text-base py-3">
            Ödeme Sayfasına Git
          </Button>
        </div>
      )}
    </SheetContent>
  );
}
UserCartWrapper.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      salePrice: PropTypes.number,
      price: PropTypes.number,
      quantity: PropTypes.number,
    })
  ),
  setOpenCartSheet: PropTypes.func.isRequired,
};

export default UserCartWrapper;
