import Address from "@/components/shopping-view/address";
import img from "/tutu.png";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder, resetPaymentState } from "@/store/shop/order-slice";
import {
  applyCoupon,
  removeCoupon,
  clearCouponState,
} from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Ticket, X } from "lucide-react";
import { TextShimmer } from "@/components/ui/TextShimmer";
import IyzicoForm from "@/components/shopping-view/IyzicoForm";

function ShoppingCheckout() {
  const {
    cartItems,
    appliedCoupon,
    discountAmount,
    couponLoading,
    couponError,
  } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading: orderLoading, error: orderError, checkoutFormContent } =
  useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState("");
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


  // Sayfadan ayrılırken state ve DOM temizliği
  useEffect(() => {
    return () => {
      dispatch(resetPaymentState());
    };
  }, [dispatch]);

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

    dispatch(
      applyCoupon({ couponCode: couponCode.trim(), cartTotal: totalCartAmount })
    )
      .unwrap()
      .then((result) => {
        if (result?.success) {
          toast({
            title: "Kupon Uygulandı",
            description: `${formatPrice(
              result.discountAmount
            )} TL indirim uygulandı!`,
            variant: "success",
          });
          setCouponCode("");
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Kupon Uygulanamadı",
          description:
            error.message || "Kupon uygulanamadı. Lütfen tekrar deneyin.",
        });
      });
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon())
      .unwrap()
      .then(() => {
        toast({
          title: "Kupon Kaldırıldı",
          description: "Kupon indiriminiz kaldırılmıştır.",
          variant: "success",
        });
      });
  };

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
    const effectiveTcKimlikNo =
      user?.tcKimlikNo || currentSelectedAddress?.tcKimlikNo;
    if (!effectiveTcKimlikNo) {
      toast({
        variant: "warning",
        title: "TC Kimlik No Eksik",
        description:
          "Fatura için TC Kimlik No gereklidir. Lütfen profilinizi güncelleyin.",
      });
      return;
    }
    
    // Yeni bir deneme yapmadan önce sadece state'i temizliyoruz.
    dispatch(resetPaymentState());

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: currentSelectedAddress,
      tcKimlikNo: effectiveTcKimlikNo,
      appliedCoupon: appliedCoupon,
    };
    
    // Manuel DOM temizliği buradan kaldırıldı.
    
    dispatch(createNewOrder(orderData))
      .unwrap()
      .then((result) => {
        if (result?.success && result?.checkoutFormContent) {
          dispatch(clearCouponState());
          toast({ title: "Güvenli ödeme formu yüklendi", variant: "success" });
        } else {
          toast({
            variant: "destructive",
            title: "Ödeme Başlatılamadı",
            description:
              result?.message ||
              "ödeme başlatılamadı. Beklenmeyen yanıt.",
          });
        }
      })
      .catch(() => {
        // Hata zaten useEffect'te yakalanıyor.
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
                    aria-label="Profili Güncelle"
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
              <div className="space-y-4 pt-4">
                {/* Kupon Bölümü */}
                <div className="space-y-3">
                  <Separator className="my-3" />
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Ticket className="h-4 w-4" />
                    <span>İndirim Kuponu</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-xs text-green-600">
                          (
                          {appliedCoupon.discountType === "percentage"
                            ? `%${appliedCoupon.discountValue}`
                            : `${formatPrice(
                                appliedCoupon.discountValue
                              )} TL`}{" "}
                          indirim)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
                        aria-label="Kuponu Kaldır"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Kupon kodunu girin"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleApplyCoupon();
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4"
                        aria-label="Kuponu Uygula"
                      >
                        {couponLoading ? "..." : "Uygula"}
                      </Button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-sm text-red-600">{couponError}</p>
                  )}
                </div>

                {/* Fiyat Özeti */}
                <div className="space-y-2">
                  <Separator className="my-3" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Ara Toplam</span>
                    <span className="whitespace-nowrap">
                      {formatPrice(totalCartAmount)} TL
                    </span>
                  </div>
                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>İndirim ({appliedCoupon.code})</span>
                      <span className="whitespace-nowrap">
                        -{formatPrice(discountAmount)} TL
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Kargo</span>
                    <span>Ücretsiz</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span className="whitespace-nowrap">
                      {formatPrice(finalAmount)} TL
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {cartItems?.items?.length > 0 && (
            // Değişiklik 4: CardFooter'ı tamamen yeniden yapılandırıyoruz.
            <CardFooter className="flex flex-col items-stretch gap-2 pt-5">
              {orderLoading && (
                <div className="flex items-center justify-center p-4">
                  <TextShimmer  className='text-xl font-medium [--base-color:theme(colors.blue.600)] [--base-gradient-color:theme(colors.blue.200)] dark:[--base-color:theme(colors.blue.700)] dark:[--base-gradient-color:theme(colors.blue.400)]' duration={1.5}>
                    Ödeme formu yükleniyor...
                  </TextShimmer>
                </div>
              )}

              {/* checkoutFormContent yoksa ödeme butonunu göster */}
              {!checkoutFormContent && !orderLoading && (
                <>
                  <Button
                    onClick={handleInitiateIyzicoPayment}
                    className="w-full text-base py-3"
                    disabled={!currentSelectedAddress}
                    aria-label="Güvenli Ödeme"
                  >
                    Güvenli Öde
                  </Button>
                  {!currentSelectedAddress && (
                    <p className="text-xs text-red-600 text-center">
                      Lütfen bir teslimat adresi seçin.
                    </p>
                  )}
                </>
              )}

              {/* checkoutFormContent varsa IyzicoForm component'ini göster */}
              {checkoutFormContent && !orderLoading && (
                <IyzicoForm checkoutFormContent={checkoutFormContent} />
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
