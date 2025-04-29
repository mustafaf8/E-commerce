import Address from "@/components/shopping-view/address";
import img from "../../assets/tutu.jpg"; // Varlık yolunu kontrol et
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast"; // Shadcn toast hook import
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.shopOrder
  );
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  console.log(
    "Checkout Render - currentSelectedAddress:",
    currentSelectedAddress
  );

  const seciliAdresNesnesi = currentSelectedAddress;
  const dispatch = useDispatch();
  const { toast } = useToast(); // <<< Hook'u burada çağırıp toast fonksiyonunu alıyoruz

  // Hata mesajını göstermek için (opsiyonel)
  useEffect(() => {
    if (orderError) {
      toast({
        variant: "destructive",
        title: "Sipariş Hatası",
        description:
          orderError.message || "Sipariş oluşturulurken bir hata oluştu.",
      });
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
        variant: "warning",
        title: "Sepetiniz boş",
        description: "Lütfen devam etmek için ürün ekleyin.",
      });
      return;
    }

    // Adres seçili mi kontrolü
    if (currentSelectedAddress === null) {
      // toast fonksiyonunu kullan
      toast({
        variant: "warning",
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
            variant: "success",
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
      });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[200px] md:h-[200px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover"
          alt="Checkout Banner"
        />
        {/* Başlık eklendi */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white">Ödeme</h1>
        </div>
      </div>

      {/* Ana içerik grid'i */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 px-4 py-8">
        {/* Sol Taraf: Adres Seçimi */}
        <Address
          seciliAdresProp={currentSelectedAddress} // İsmi değiştirdim (prop adı vs state adı)
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />

        {/* Sağ Taraf: Sipariş Özeti (Yeniden Düzenlendi) */}
        <Card className="shadow-md">
          {" "}
          {/* Daha belirgin gölge */}
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {" "}
              {/* Font boyutu ayarlandı */}
              Sipariş Özeti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {" "}
            {/* Dikey boşluk artırıldı */}
            {/* Ürün Listesi */}
            {cartItems?.items?.length > 0 ? (
              <div className="max-h-60 overflow-y-auto pr-2 space-y-4 border rounded-md p-3 bg-gray-50">
                {" "}
                {/* Padding ve arka plan eklendi */}
                {cartItems.items.map((item) => (
                  <UserCartItemsContent
                    key={item.productId?._id || item.productId} // Daha sağlam key
                    cartItem={item}
                    readOnly={true} // Sadece gösterim
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Sepetinizde ürün bulunmamaktadır.
              </p>
            )}
            {/* Toplamlar Bölümü */}
            {cartItems?.items?.length > 0 && (
              <div className="space-y-2 pt-4">
                <Separator className="my-3" />{" "}
                {/* Ara toplamdan önce ayırıcı */}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Ara Toplam</span>
                  <span>{totalCartAmount.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Kargo</span>
                  <span>Ücretsiz</span> {/* Veya sabit bir değer */}
                </div>
                <Separator className="my-3" /> {/* Toplamdan önce ayırıcı */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span>{totalCartAmount.toFixed(2)} TL</span>
                </div>
              </div>
            )}
          </CardContent>
          {/* Ödeme Butonu */}
          {cartItems?.items?.length > 0 && (
            <CardFooter className="flex flex-col items-stretch gap-2 pt-5">
              {" "}
              {/* Yukarı boşluk */}
              <Button
                onClick={handleInitiateIyzicoPayment}
                className="w-full text-base py-3" // Daha büyük buton
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
