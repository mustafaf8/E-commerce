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
import { addressFormControls } from "@/config";
import {
  createGuestOrderThunk,
  resetPaymentPageUrl,
} from "@/store/shop/order-slice";

const initialAddressFormData = {
  fullName: "",
  address: "",
  city: "",
  pincode: "",
  phone: "",
  email: "",
  notes: "",
  tcKimlikNo: "",
};

function GuestCheckoutAddress() {
  const [formData, setFormData] = useState(initialAddressFormData);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading: orderIsLoading, paymentPageUrl } = useSelector(
    (state) => state.shopOrder
  );
  const { cartItems: cartForCheckout, appliedCoupon } = useSelector(
    (state) => state.shopCart
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shop/checkout");
    }
    if (
      !cartForCheckout ||
      !cartForCheckout.items ||
      cartForCheckout.items.length === 0
    ) {
      toast({
        title: "Sepetiniz Boş",
        description: "Ödeme yapmak için sepetinize ürün eklemelisiniz.",
        variant: "warning",
      });
      navigate("/shop/home");
    }
  }, [isAuthenticated, navigate, toast, cartForCheckout]);

  const isFormValid = () => {
    return (
      formData.email.trim() !== "" &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      formData.fullName.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.pincode.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.tcKimlikNo.trim() !== "" &&
      /^[0-9]{11}$/.test(formData.tcKimlikNo)
    );
  };
  useEffect(() => {
    if (paymentPageUrl) {
     // console.log("PaymentPageUrl alındı, yönlendiriliyor:", paymentPageUrl);
      dispatch(resetPaymentPageUrl());
      window.location.href = paymentPageUrl;
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
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        notes: formData.notes,
        tcKimlikNo: formData.tcKimlikNo,
      },
      cartItems: cartForCheckout.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      appliedCoupon: appliedCoupon || null,
    };

   // console.log("Misafir siparişi için gönderilecek veri:", orderData);

    dispatch(createGuestOrderThunk(orderData))
      .unwrap()
      .then((result) => {
        if (result.success && result.paymentPageUrl) {
          toast({
            title: "Ödeme sayfasına yönlendiriliyorsunuz...",
            variant: "success",
          });
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
    ...addressFormControls,
  ];

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
            setFormData={setFormData}
            onSubmit={handleSubmitAddress}
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
