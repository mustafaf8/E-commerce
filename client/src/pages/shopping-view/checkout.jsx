import Address from "@/components/shopping-view/address";
import img from "../../assets/banner-3.webp"; // Varlık yolunu kontrol et
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast"; // Shadcn toast hook import

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.shopOrder
  );

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast(); // <<< Hook'u burada çağırıp toast fonksiyonunu alıyoruz

  // Hata mesajını göstermek için (opsiyonel)
  useEffect(() => {
    if (orderError) {
      // toast fonksiyonunu kullanarak hata göster
      toast({
        variant: "destructive",
        title: "Sipariş Hatası",
        description:
          orderError.message || "Sipariş oluşturulurken bir hata oluştu.",
      });
      // Burada Redux state'indeki hatayı temizlemek gerekebilir.
      // dispatch(clearOrderError()); // Eğer slice'da varsa
    }
  }, [orderError, toast]); // toast'ı dependency array'e ekle

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
    // Sepet boş kontrolü
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      // toast fonksiyonunu kullan
      toast({
        variant: "destructive",
        title: "Sepetiniz boş",
        description: "Lütfen devam etmek için ürün ekleyin.",
      });
      return;
    }

    // Adres seçili mi kontrolü
    if (currentSelectedAddress === null) {
      // toast fonksiyonunu kullan
      toast({
        variant: "destructive",
        title: "Adres Seçilmedi",
        description: "Lütfen devam etmek için bir adres seçin.",
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
    };

    dispatch(createNewOrder(orderData))
      .unwrap()
      .then((result) => {
        console.log("createNewOrder result:", result);
        if (result?.success && result?.paymentPageUrl) {
          // Başarılı ve paymentPageUrl var, yönlendir!
          // toast fonksiyonunu kullan (title yeterli olabilir)
          toast({
            title: "Ödeme sayfasına yönlendiriliyorsunuz...",
            // description: "Lütfen bekleyin...", // Opsiyonel
          });
          // Yönlendirme burada gerçekleşecek
          window.location.href = result.paymentPageUrl;
        } else if (result?.success && result?.checkoutFormContent) {
          console.warn(
            "PaymentPageUrl alınamadı, checkoutFormContent ile devam edilmeli."
          );
          // toast fonksiyonunu kullan
          toast({
            variant: "destructive",
            title: "Yönlendirme Hatası",
            description:
              "Ödeme sayfasına yönlendirilemedi (Form içeriği alındı). Lütfen tekrar deneyin.",
          });
        } else {
          // Başarılı ama beklenen URL yok veya success=false
          // toast fonksiyonunu kullan
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
        console.error("createNewOrder error:", error);
        // Hata mesajı useEffect içinde zaten gösteriliyor, burada tekrar göstermeye gerek yok
        // Sadece konsol log yeterli olabilir veya spesifik başka bir işlem
      });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover"
          alt="Checkout Banner"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 p-4 md:p-8">
        <Address
          selectedAddress={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Sipariş Özeti
          </h2>
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
              {cartItems.items.map((item) => (
                <UserCartItemsContent
                  key={item.productId}
                  cartItem={item}
                  readOnly={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Sepetinizde ürün bulunmamaktadır.</p>
          )}
          {cartItems && cartItems.items && cartItems.items.length > 0 && (
            <>
              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span>{totalCartAmount.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo</span>
                  <span>Hesaplanacak</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Toplam</span>
                  <span>{totalCartAmount.toFixed(2)} TL</span>
                </div>
              </div>
              <div className="mt-6 w-full">
                <Button
                  onClick={handleInitiateIyzicoPayment}
                  className="w-full"
                  disabled={orderLoading || !currentSelectedAddress}
                >
                  {orderLoading
                    ? "Ödeme İşleniyor..."
                    : "Iyzico ile Güvenli Öde"}
                </Button>
                {!currentSelectedAddress && (
                  <p className="text-xs text-red-500 text-center mt-1">
                    Lütfen bir teslimat adresi seçin.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
