import Address from "@/components/shopping-view/address";
import img from "/tutu.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.shopOrder
  );
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  //console.log(
  //  "Checkout Render - currentSelectedAddress:",
  //  currentSelectedAddress
  //);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    if (orderError) {
      toast({
        variant: "destructive",
        title: "Sipariş Hatası",
        description:
          orderError.message || "Sipariş oluşturulurken bir hata oluştu.",
      });
    }
  }, [orderError, toast]);

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiateIyzicoPayment() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        variant: "warning",
        title: "Sepetiniz boş",
        description: "Lütfen devam etmek için ürün ekleyin.",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        variant: "warning",
        title: "Adres Seçilmedi",
        description: "Lütfen devam etmek için bir adres seçin.",
      });
      return;
    }

    if (!user?.tcKimlikNo) {
      toast({
        variant: "warning",
        title: "TC Kimlik No Eksik",
        description: "Fatura için TC Kimlik No gereklidir. Lütfen profilinizi güncelleyin.",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: currentSelectedAddress,
      tcKimlikNo: user?.tcKimlikNo,
    };

    dispatch(createNewOrder(orderData))
      .unwrap()
      .then((result) => {
       // console.log("createNewOrder result:", result);
        if (result?.success && result?.paymentPageUrl) {
          toast({
            title: "Ödeme sayfasına yönlendiriliyorsunuz...",
            variant: "success",
          });
          window.location.href = result.paymentPageUrl;
        } else if (result?.success && result?.checkoutFormContent) {
         // console.warn(
         //   "PaymentPageUrl alınamadı, checkoutFormContent ile devam edilmeli."
         // );
          toast({
            variant: "destructive",
            title: "Yönlendirme Hatası",
            description:
              "Ödeme sayfasına yönlendirilemedi (Form içeriği alındı). Lütfen tekrar deneyin.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Ödeme Başlatılamadı",
            description:
              result?.message ||
              "Iyzico ödeme başlatılamadı. Beklenmeyen yanıt.",
          });
        }
      })
      .catch((error) => {
       // console.error("createNewOrder error:", error);
      });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[120px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover"
          alt="Checkout Banner"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Ödeme</h1>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 px-4 py-8">
        <div className="space-y-4">
          <Address
            seciliAdresProp={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
          
          {/* TC Kimlik No Uyarısı */}
          {!user?.tcKimlikNo && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">
                      TC Kimlik Numarası Gerekli
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Fatura işlemleri için TC Kimlik Numaranız gereklidir.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => navigate("/shop/account")}
                  >
                    Profili Güncelle
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Sipariş Özeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {cartItems?.items?.length > 0 ? (
              <div className="max-h-60 overflow-y-auto pr-2 space-y-4 border rounded-md p-3 bg-gray-50">
                {cartItems.items.map((item) => (
                  <UserCartItemsContent
                    key={item.productId?._id || item.productId}
                    cartItem={item}
                    readOnly={true}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Sepetinizde ürün bulunmamaktadır.
              </p>
            )}
            {cartItems?.items?.length > 0 && (
              <div className="space-y-2 pt-4">
                <Separator className="my-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Ara Toplam</span>
                  <span className="whitespace-nowrap">{formatPrice(totalCartAmount)} TL</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Kargo</span>
                  <span>Ücretsiz</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span className="whitespace-nowrap">{formatPrice(totalCartAmount)} TL</span>
                </div>
              </div>
            )}
          </CardContent>
          {cartItems?.items?.length > 0 && (
            <CardFooter className="flex flex-col items-stretch gap-2 pt-5">
              <Button
                onClick={handleInitiateIyzicoPayment}
                className="w-full text-base py-3"
                disabled={orderLoading || !currentSelectedAddress}
              >
                {orderLoading ? "İşleniyor..." : "Iyzico ile Güvenli Öde"}
              </Button>
              {!currentSelectedAddress && (
                <p className="text-xs text-red-600 text-center">
                  Lütfen bir teslimat adresi seçin.
                </p>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
