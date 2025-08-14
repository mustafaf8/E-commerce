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
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { addressFormControls } from "@/config";
import { TextShimmer } from "@/components/ui/TextShimmer";
import {
  createGuestOrderThunk,
  resetPaymentState,
} from "@/store/shop/order-slice";
import IyzicoForm from "@/components/shopping-view/IyzicoForm";

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
  const { isLoading: orderIsLoading, checkoutFormContent } = useSelector(
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



  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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

    dispatch(resetPaymentState());

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

    try {
      const containerId = "iyzipay-checkout-form";
      const cn = document.getElementById(containerId);
      if (cn) cn.innerHTML = "";
    } catch {}
    dispatch(resetPaymentState());

    setIsPaymentLoading(true);
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
      })
      .finally(() => setIsPaymentLoading(false));
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2/3 col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Teslimat Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CommonForm
                formControls={guestAddressFormControls}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmitAddress}
                buttonText={"Ödemeye Geç"}
                isBtnDisabled={!isFormValid()}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2/3">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">
                Sipariş Özeti ve Ödeme
              </CardTitle>
            </CardHeader>
            <CardContent>
            
              {isPaymentLoading && (
                <div className="flex items-center justify-center p-4">
                  <TextShimmer className="font-medium text-lg" duration={1.5}>
                    Ödeme formu yükleniyor...
                  </TextShimmer>
                </div>
              )}
               {checkoutFormContent && !isPaymentLoading && (
                <IyzicoForm checkoutFormContent={checkoutFormContent} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default GuestCheckoutAddress;