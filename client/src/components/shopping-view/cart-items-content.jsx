import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import PropTypes from "prop-types";
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

  function handleUpdateQuantity(currentCartItem, typeOfAction) {
    let newQuantity;
    if (typeOfAction === "plus") {
      newQuantity = currentCartItem.quantity + 1;
    } else {
      newQuantity = currentCartItem.quantity - 1;
    }

    dispatch(
      updateCartQuantity({
        productId: currentCartItem.productId, // productId string olmalı
        quantity: newQuantity,
      })
    )
      .unwrap()
      .then((payload) => {
        if (payload?.success) {
          // Başarılı olunca toast göstermeye gerek yok, UI zaten güncellenecek.
          // İsterseniz yine de bir "Sepet güncellendi" mesajı gösterebilirsiniz.
          // toast({ title: "Sepet güncellendi", variant: "success" });
        }
        // Thunk içinden success:false ile dönen durumlar (rejectWithValue kullanılmadıysa)
        // else if (!payload?.success && payload?.message) {
        //   toast({ variant: "destructive", title: payload.message });
        // }
      })
      .catch((errorPayload) => {
        // rejectWithValue ile gelen errorPayload
        if (errorPayload && errorPayload.isStockError) {
          toast({
            variant: "destructive",
            title: "Stok Yetersiz!",
            description: `${errorPayload.message} Bu üründen en fazla ${errorPayload.availableStock} adet eklenebilir.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Miktar Güncellenemedi",
            description: errorPayload?.message || "Bir hata oluştu.",
          });
        }
      });
  }

  function handleCartItemDelete(currentCartItem) {
    dispatch(
      deleteCartItem({
        productId: currentCartItem.productId, // productId string olmalı
      })
    )
      .unwrap()
      .then((payload) => {
        if (payload?.success) {
          toast({
            title: "Ürün sepetten silindi",
            variant: "success",
          });
        }
        // else if (!payload?.success && payload?.message) {
        //   toast({ variant: "destructive", title: payload.message });
        // }
      })
      .catch((errorPayload) => {
        toast({
          title: "Silme Başarısız",
          description: errorPayload?.message || "Bir hata oluştu.",
          variant: "destructive",
        });
      });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image || "placeholder.png"}
        alt={cartItem?.title || "Ürün"}
        className="w-16 h-16 md:w-20 md:h-20 rounded object-cover border"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base truncate">
          {cartItem?.title || "Ürün Adı Yok"}
        </h3>
        {!readOnly && (
          <div className="flex items-center gap-2 mt-1">
            <Button
              variant="outline"
              className="h-7 w-7 md:h-8 md:w-8 rounded-full p-0"
              size="icon"
              disabled={cartItem?.quantity === 1} // Azaltma butonu 1'deyken disable olmalı
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="sr-only">Azalt</span>
            </Button>
            <span className="font-semibold text-sm md:text-base w-6 text-center">
              {cartItem?.quantity}
            </span>
            <Button
              variant="outline"
              className="h-7 w-7 md:h-8 md:w-8 rounded-full p-0"
              size="icon"
              // Stok kontrolü artık thunk içinde yapıldığı için buradaki disabled kaldırılabilir
              // VEYA anlık UI geri bildirimi için bırakılabilir, ancak thunk yine de son kararı verir.
              // disabled={cartItem.totalStock !== undefined && cartItem.quantity >= cartItem.totalStock}
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="sr-only">Arttır</span>
            </Button>
          </div>
        )}
        {readOnly && (
          <p className="text-sm text-gray-600 mt-1">
            Adet: {cartItem?.quantity}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end flex-shrink-0 ml-2">
        <p className="font-semibold text-sm md:text-base">
          {(
            (cartItem?.salePrice > 0
              ? cartItem?.salePrice
              : cartItem?.price || 0) * cartItem?.quantity
          ).toFixed(2)}{" "}
          TL
        </p>
        {!readOnly && (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:bg-red-100 h-7 w-7 mt-1"
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
UserCartItemsContent.propTypes = {
  cartItem: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    image: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    totalStock: PropTypes.number, // Bu alanın misafir sepetindeki item'larda da olması önemli
  }).isRequired,
  readOnly: PropTypes.bool,
};
export default UserCartItemsContent;
