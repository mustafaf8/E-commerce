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
import { Separator } from "@/components/ui/separator"; // Arayüzde ayraç için
import { formatPrice } from "@/lib/utils";

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
  const { cartItems: cartForCheckout, appliedCoupon, discountAmount } = useSelector(
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

  // Sepet toplam tutarını hesapla
  const totalCartAmount = cartForCheckout?.items?.reduce(
    (sum, item) => sum + ((item?.salePrice > 0 ? item?.salePrice : item?.price || 0) * (item?.quantity || 0)),
    0
  ) || 0;

  // İndirim sonrası final tutar
  const finalAmount = totalCartAmount - (discountAmount || 0);

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
                Sipariş Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sepet Ürünleri */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Sepetinizdeki Ürünler</h3>
                {cartForCheckout?.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3 flex-1">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          Adet: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice((item?.salePrice > 0 ? item?.salePrice : item?.price || 0) * (item?.quantity || 0))} TL
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Toplam Tutarlar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-medium">{formatPrice(totalCartAmount)} TL</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kupon İndirimi:</span>
                    <span className="font-medium text-green-600">-{formatPrice(discountAmount)} TL</span>
                  </div>
                )}

                <Separator />
                
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-gray-900">Toplam Tutar:</span>
                  <span className="text-lg text-blue-600">{formatPrice(finalAmount)} TL</span>
                </div>
              </div>

              {/* Ödeme Formu veya Loading */}
              {isPaymentLoading && (
                <div className="flex items-center justify-center p-4">
                  <TextShimmer  className='text-xl font-medium [--base-color:theme(colors.blue.600)] [--base-gradient-color:theme(colors.blue.200)] dark:[--base-color:theme(colors.blue.700)] dark:[--base-gradient-color:theme(colors.blue.400)]' duration={1.5}>
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