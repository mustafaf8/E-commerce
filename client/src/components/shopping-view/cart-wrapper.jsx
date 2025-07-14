import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import PropTypes from "prop-types";
import { formatPrice } from "@/lib/utils";

import UserCartItemsContent from "./cart-items-content";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { ShoppingCartIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

function UserCartWrapper({ setOpenCartSheet }) {
  const navigate = useNavigate();
  const { items: currentCartItemsArray } = useSelector(
    (state) => state.shopCart.cartItems
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const totalCartAmount =
    currentCartItemsArray?.reduce(
      (sum, currentItem) =>
        sum +
        (currentItem?.salePrice > 0
          ? currentItem?.salePrice
          : currentItem?.price || 0) *
          (currentItem?.quantity || 0),
      0
    ) || 0;

  const handleCheckout = () => {
    if (!currentCartItemsArray || currentCartItemsArray.length === 0) return;
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
        {currentCartItemsArray && currentCartItemsArray.length > 0 && (
          <SheetDescription>
            {currentCartItemsArray.length} ürün sepetinizde bulunuyor.
          </SheetDescription>
        )}
      </SheetHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {currentCartItemsArray && currentCartItemsArray.length > 0 ? (
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

      {currentCartItemsArray && currentCartItemsArray.length > 0 && (
        <div className="border-t p-6 space-y-4">
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-medium">
            <span>Toplam Tutar:</span>
            <span className="font-bold text-lg whitespace-nowrap">
              {formatPrice(totalCartAmount)} TL
            </span>
          </div>
          <Button onClick={handleCheckout} className="w-full text-base py-3">
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
