import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../ui/button";
import PropTypes from "prop-types";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { applyCoupon, removeCoupon } from "@/store/shop/cart-slice";
import { Input } from "@/components/ui/input";

import UserCartItemsContent from "./cart-items-content";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { ShoppingCartIcon, Ticket, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function UserCartWrapper({ setOpenCartSheet }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const {
    cartItems,
    appliedCoupon,
    discountAmount,
    couponLoading,
    couponError,
  } = useSelector((state) => state.shopCart);
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [couponCode, setCouponCode] = useState("");

  const currentCartItemsArray = cartItems?.items || [];

  const totalCartAmount =
    currentCartItemsArray.reduce(
      (sum, currentItem) =>
        sum +
        (currentItem?.salePrice > 0
          ? currentItem?.salePrice
          : currentItem?.price || 0) *
          (currentItem?.quantity || 0),
      0
    ) || 0;
  
  const finalAmount = totalCartAmount - (discountAmount || 0);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        variant: "warning",
        title: "Kupon Kodu Gerekli",
        description: "Lütfen geçerli bir kupon kodu girin.",
      });
      return;
    }

    dispatch(applyCoupon({ couponCode: couponCode.trim(), cartTotal: totalCartAmount }))
      .unwrap()
      .then((result) => {
        if (result?.success) {
          toast({
            title: "Kupon Uygulandı",
            description: `${formatPrice(result.discountAmount)} TL indirim kazandınız!`,
            variant: "success",
          });
          setCouponCode("");
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Kupon Hatası",
          description: error.message || "Geçersiz veya uygulanamayan kupon.",
        });
      });
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon())
      .unwrap()
      .then(() => {
        toast({
          title: "Kupon Kaldırıldı",
          variant: "success",
        });
      });
  };

  const handleCheckout = () => {
    if (currentCartItemsArray.length === 0) return;
    if (!isAuthenticated) {
      navigate("/shop/guest-checkout-address");
    } else {
      navigate("/shop/checkout");
    }
    if (setOpenCartSheet) setOpenCartSheet(false);
  };

  const checkoutButtonText = isAuthenticated
    ? "Ödeme Sayfasına Git"
    : "Hemen Al";

  return (
    <SheetContent className="sm:max-w-lg flex flex-col max-[500px]:px-0">
      <SheetHeader className="px-6 pt-6 pb-4 border-b">
        <SheetTitle className="text-lg font-semibold">Sepetiniz</SheetTitle>
        {currentCartItemsArray.length > 0 && (
          <SheetDescription>
            {currentCartItemsArray.length} ürün sepetinizde bulunuyor.
          </SheetDescription>
        )}
      </SheetHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {currentCartItemsArray.length > 0 ? (
            currentCartItemsArray.map((item) => (
              <UserCartItemsContent
                key={item.productId}
                cartItem={item}
                readOnly={false}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-10">
              <ShoppingCartIcon className="w-12 h-12 mb-4 text-gray-400" />
              <p>Sepetiniz şu anda boş.</p>
              <p className="text-sm mt-1">
                Hemen alışverişe başlayıp sepetinizi doldurun!
              </p>
            </div>
          )}
        </div>
      </div>

      {currentCartItemsArray.length > 0 && (
        <div className="border-t p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Ara Toplam</span>
              <span className="whitespace-nowrap">
                {formatPrice(totalCartAmount)} TL
              </span>
            </div>
            {/* Sadece misafir kullanıcılar için kupon alanı */}
            {!isAuthenticated && (
              <>
                {appliedCoupon ? (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Kupon ({appliedCoupon.code})</span>
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap">
                        -{formatPrice(discountAmount)} TL
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-6 w-6 p-0 hover:bg-green-100"
                        aria-label="Kuponu Kaldır"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                     <div className="flex items-center gap-2 text-sm font-medium">
                        <Ticket className="h-4 w-4" />
                        <span>İndirim Kuponu</span>
                      </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Kupon Kodunuz"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        aria-label="Kuponu Uygula"
                      >
                        {couponLoading ? "..." : "Uygula"}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 pt-1">{couponError}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <Separator />
          <div className="flex justify-between text-base font-medium">
            <span>Genel Toplam:</span>
            <span className="font-bold text-lg whitespace-nowrap">
              {formatPrice(finalAmount)} TL
            </span>
          </div>
          <Button onClick={handleCheckout} className="w-full text-base py-3" aria-label={checkoutButtonText}>
            {checkoutButtonText}
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

UserCartWrapper.propTypes = {
  setOpenCartSheet: PropTypes.func.isRequired,
};

export default UserCartWrapper;
