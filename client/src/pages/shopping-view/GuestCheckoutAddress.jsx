// client/src/pages/shopping-view/GuestCheckoutAddress.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { addressFormControls } from "@/config"; // Mevcut adres form kontrollerini kullanabiliriz
import { getGuestCart } from "@/lib/guestCartUtils"; // Misafir sepetini almak için
import {
  createGuestOrderThunk,
  resetPaymentPageUrl,
} from "@/store/shop/order-slice";

// ÖNEMLİ: order-slice.js içinde createGuestOrderThunk adında yeni bir thunk oluşturmanız gerekecek.
// Bu thunk, backend'deki /api/shop/order/guest-create endpoint'ine istek atacak.
// Şimdilik bu import'u yorum satırı yapalım ve mantığı kuralım.

const initialAddressFormData = {
  fullName: "", // Tam ad soyad için yeni bir alan ekleyebiliriz
  address: "",
  city: "",
  pincode: "",
  phone: "",
  email: "", // Misafir siparişi için e-posta alalım
  notes: "",
};

function GuestCheckoutAddress() {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [cartForCheckout, setCartForCheckout] = useState({
    items: [],
    guestCartId: null,
  });
  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    isLoading: orderIsLoading,
    error: orderError,
    paymentPageUrl, // useSelector ile paymentPageUrl'i al
  } = useSelector((state) => state.shopOrder);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Eğer kullanıcı bir şekilde bu sayfaya giriş yapmışken gelirse, normal checkout'a yönlendir.
    if (isAuthenticated) {
      navigate("/shop/checkout");
    }
    // Misafir sepetini yükle
    const guestCart = getGuestCart();
    if (!guestCart || guestCart.items.length === 0) {
      toast({
        title: "Sepetiniz Boş",
        description: "Ödeme yapmak için sepetinize ürün eklemelisiniz.",
        variant: "warning",
      });
      navigate("/shop/home"); // Veya sepet sayfasına
    } else {
      setCartForCheckout(guestCart);
    }
  }, [isAuthenticated, navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    // Temel doğrulama: email, fullName, address, city, pincode, phone zorunlu
    return (
      formData.email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.fullName.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.pincode.trim() !== "" &&
      formData.phone.trim() !== ""
    );
  };
  useEffect(() => {
    if (paymentPageUrl) {
      console.log("PaymentPageUrl alındı, yönlendiriliyor:", paymentPageUrl);
      window.location.href = paymentPageUrl; // Iyzico sayfasına yönlendir
      // Yönlendirme sonrası URL'yi Redux state'inden temizlemek iyi bir pratiktir.
      // Böylece kullanıcı geri gelirse tekrar yönlendirme olmaz.
      dispatch(resetPaymentPageUrl()); // Yeni bir action tanımlayıp bunu dispatch edin.
    }
  }, [paymentPageUrl, dispatch]);

  const handleSubmitAddress = async (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm zorunlu alanları doğru bir şekilde doldurun.",
        variant: "destructive",
      });
      return;
    }

    if (cartForCheckout.items.length === 0) {
      toast({ title: "Sepetiniz boş!", variant: "warning" });
      return;
    }

    const orderData = {
      guestInfo: {
        // Adres ve iletişim bilgileri
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        notes: formData.notes,
      },
      cartItems: cartForCheckout.items.map((item) => ({
        // Sadece productId ve quantity yeterli olabilir
        productId: item.productId,
        quantity: item.quantity,
        // Backend fiyatı zaten Product modelinden alacak
      })),
      // guestCartId: cartForCheckout.guestCartId, // Backend'e iletmek isteyebilirsiniz
    };

    console.log("Misafir siparişi için gönderilecek veri:", orderData);

    dispatch(createGuestOrderThunk(orderData))
      .unwrap()
      .then((result) => {
        if (result.success && result.paymentPageUrl) {
          toast({
            title: "Ödeme sayfasına yönlendiriliyorsunuz...",
            variant: "success",
          });
          // Yönlendirme artık useEffect ile paymentPageUrl değiştiğinde yapılacak
          // window.location.href = result.paymentPageUrl;
          // Misafir siparişi başlatıldıktan sonra yerel sepeti temizleyebiliriz.
          // Redux thunk içinde de yapılabilir.
          // clearGuestCart(); // Bu, payment-success sayfasında veya callback'ten sonra yapılmalı.
        } else {
          toast({
            title: "Ödeme başlatılamadı",
            description: result.message || "Bilinmeyen bir hata oluştu.",
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        toast({
          title: "Sipariş oluşturma hatası",
          description: err.message || "Beklenmedik bir hata.",
          variant: "destructive",
        });
      });
  };

  // addressFormControls'u bu component'e uyarlama (email ve fullName ekleyerek)
  const guestAddressFormControls = [
    {
      name: "fullName",
      label: "Ad Soyad",
      placeholder: "Adınız ve Soyadınız",
      componentType: "input",
      type: "text",
    },
    {
      name: "email",
      label: "E-posta Adresiniz",
      placeholder: "siparis@example.com",
      componentType: "input",
      type: "email",
    },
    ...addressFormControls, // Mevcut adres kontrollerini buraya yay
  ];
  // addressFormControls içinde 'notes' alanı zaten var, 'email' ve 'fullName' eklendi.

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Teslimat Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Siparişinizi teslim edebilmemiz için lütfen bilgilerinizi girin.
          </p>
          <CommonForm
            formControls={guestAddressFormControls}
            formData={formData}
            setFormData={setFormData} // CommonForm'un inputları güncellemesi için
            onSubmit={handleSubmitAddress} // Formun onSubmit'i bu olacak
            buttonText={orderIsLoading ? "İşleniyor..." : "Ödemeye Devam Et"}
            isBtnDisabled={orderIsLoading || !isFormValid()}
          />
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            onClick={() => navigate("/shop/home")}
            className="mx-auto"
          >
            Sepete Geri Dön
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default GuestCheckoutAddress;
