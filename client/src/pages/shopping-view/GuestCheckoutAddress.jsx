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
  resetPaymentState,
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
  const { isLoading: orderIsLoading, paymentPageUrl, checkoutFormContent } = useSelector(
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
  // Eski yönlendirme davranışını kaldırıyoruz; gömülü form render edilecek
  useEffect(() => {
    const containerId = "iyzipay-checkout-form";
    const formContainer = document.getElementById(containerId);
    if (checkoutFormContent && formContainer) {
      try {
        // Konteynırı temizle
        formContainer.innerHTML = "";
        // Geçici div ile içeriği parse et
        const temp = document.createElement("div");
        temp.innerHTML = checkoutFormContent;
        // Script etiketlerini yeniden yarat (innerHTML ile eklenen script'ler çalışmaz)
        const scripts = Array.from(temp.querySelectorAll("script"));
        scripts.forEach((oldScript) => {
          const newScript = document.createElement("script");
          Array.from(oldScript.attributes).forEach((attr) =>
            newScript.setAttribute(attr.name, attr.value)
          );
          if (oldScript.src) {
            newScript.src = oldScript.src;
          } else {
            newScript.text = oldScript.text || oldScript.innerHTML;
          }
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        // Tüm childları konteynıra taşı
        while (temp.firstChild) {
          formContainer.appendChild(temp.firstChild);
        }
        formContainer.style.display = "block";
      } catch (e) {
        // no-op
      }
    }

    return () => {
      const cn = document.getElementById(containerId);
      if (cn) cn.innerHTML = "";
      dispatch(resetPaymentState());
    };
  }, [checkoutFormContent, dispatch]);

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

    dispatch(createGuestOrderThunk(orderData))
      .unwrap()
      .then((result) => {
        if (result.success && result.checkoutFormContent) {
          toast({
            title: "Güvenli ödeme formu yüklendi",
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Teslimat Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <CommonForm
                formControls={guestAddressFormControls}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmitAddress}
                buttonText={orderIsLoading ? "İşleniyor..." : "Ödemeye Geç"}
                isBtnDisabled={orderIsLoading || !isFormValid()}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sipariş Özeti ve Ödeme</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSubmitAddress}
                disabled={orderIsLoading || !isFormValid()}
                className="w-full mb-4"
              >
                {orderIsLoading ? "İşleniyor..." : "Ödemeye Geç"}
              </Button>
              <div id="iyzipay-checkout-form" className="hidden" />
              {checkoutFormContent && (
                <style>{`#iyzipay-checkout-form{display:block}`}</style>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default GuestCheckoutAddress;
