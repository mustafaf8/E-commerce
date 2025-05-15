// // client/src/components/shopping-view/OrderTrackingModal.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   AlertCircle,
//   Loader2,
//   LogIn,
//   Search,
//   PackageCheck,
//   Truck,
//   PackageX,
// } from "lucide-react";
// import axios from "axios"; // API isteği için
// import { useToast } from "@/components/ui/use-toast";
// import { format, parseISO, isValid } from "date-fns"; // Tarih formatlama için

// const OrderTrackingModal = ({ isOpen, onClose }) => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [orderIdInput, setOrderIdInput] = useState("");
//   const [emailInput, setEmailInput] = useState(""); // Misafir doğrulaması için e-posta
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchResult, setSearchResult] = useState(null);
//   const [searchError, setSearchError] = useState("");

//   const handleTrackOrder = async (e) => {
//     e.preventDefault();
//     if (!orderIdInput.trim() || !emailInput.trim()) {
//       setSearchError("Sipariş ID ve E-posta adresinizi giriniz.");
//       setSearchResult(null);
//       return;
//     }
//     setIsLoading(true);
//     setSearchError("");
//     setSearchResult(null);

//     try {
//       // Backend'e istek at (Bu endpoint'i backend'de oluşturmanız gerekecek)
//       const response = await axios.get(
//         `http://localhost:5000/api/shop/order/track/${orderIdInput.trim()}?email=${encodeURIComponent(
//           emailInput.trim()
//         )}`
//       );
//       if (response.data.success) {
//         setSearchResult(response.data.data);
//       } else {
//         setSearchError(
//           response.data.message || "Sipariş bulunamadı veya e-posta eşleşmedi."
//         );
//       }
//     } catch (error) {
//       setSearchError(
//         error.response?.data?.message ||
//           "Sipariş sorgulanırken bir hata oluştu."
//       );
//       console.error("Sipariş sorgulama hatası:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLoginRedirect = () => {
//     navigate("/auth/login");
//     onClose(); // Modalı kapat
//   };

//   // Sipariş durumlarını kullanıcı dostu hale getiren fonksiyon
//   const getOrderStatusDisplay = (status) => {
//     const statusMapping = {
//       pending_payment: {
//         label: "Ödeme Bekleniyor",
//         icon: <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />,
//         color: "text-yellow-600",
//       },
//       pending: {
//         label: "Onay Bekleniyor",
//         icon: <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />,
//         color: "text-yellow-600",
//       },
//       confirmed: {
//         label: "Onaylandı",
//         icon: <PackageCheck className="w-5 h-5 text-blue-500 mr-2" />,
//         color: "text-blue-600",
//       },
//       inProcess: {
//         label: "Hazırlanıyor",
//         icon: <PackageCheck className="w-5 h-5 text-blue-500 mr-2" />,
//         color: "text-blue-600",
//       },
//       inShipping: {
//         label: "Kargoda",
//         icon: <Truck className="w-5 h-5 text-orange-500 mr-2" />,
//         color: "text-orange-600",
//       },
//       delivered: {
//         label: "Teslim Edildi",
//         icon: <PackageCheck className="w-5 h-5 text-green-500 mr-2" />,
//         color: "text-green-600",
//       },
//       cancelled: {
//         label: "İptal Edildi",
//         icon: <PackageX className="w-5 h-5 text-red-500 mr-2" />,
//         color: "text-red-600",
//       },
//       failed: {
//         label: "Başarısız Oldu",
//         icon: <PackageX className="w-5 h-5 text-red-500 mr-2" />,
//         color: "text-red-600",
//       },
//       default: {
//         label: status || "Bilinmiyor",
//         icon: <AlertCircle className="w-5 h-5 text-gray-500 mr-2" />,
//         color: "text-gray-600",
//       },
//     };
//     return statusMapping[status] || statusMapping.default;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString || !isValid(parseISO(dateString))) return "N/A";
//     return format(parseISO(dateString), "dd.MM.yyyy HH:mm");
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Sipariş Takibi</DialogTitle>
//           <DialogDescription>
//             Siparişinizin durumunu sorgulayın veya siparişlerinizi görmek için
//             giriş yapın.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleTrackOrder} className="grid gap-4 py-4">
//           <div className="grid gap-2">
//             <Label htmlFor="orderId">Sipariş Numaranız</Label>
//             <Input
//               id="orderId"
//               placeholder="Sipariş numaranızı girin (örn: 662f...)"
//               value={orderIdInput}
//               onChange={(e) => setOrderIdInput(e.target.value)}
//               required
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="email">E-posta Adresiniz</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="Siparişte kullandığınız e-posta"
//               value={emailInput}
//               onChange={(e) => setEmailInput(e.target.value)}
//               required
//             />
//           </div>
//           {searchError && (
//             <p className="text-sm text-red-600 flex items-center">
//               <AlertCircle className="w-4 h-4 mr-1" /> {searchError}
//             </p>
//           )}
//           <Button type="submit" disabled={isLoading} className="w-full">
//             {isLoading ? (
//               <Loader2 className="h-4 w-4 animate-spin mr-2" />
//             ) : (
//               <Search className="h-4 w-4 mr-2" />
//             )}
//             Siparişimi Sorgula
//           </Button>
//         </form>

//         {searchResult && (
//           <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
//             <h3 className="text-lg font-semibold mb-2">Sipariş Durumu</h3>
//             <div className="space-y-1 text-sm">
//               <p>
//                 <strong>Sipariş No:</strong> {searchResult._id}
//               </p>
//               <p>
//                 <strong>Tarih:</strong> {formatDate(searchResult.orderDate)}
//               </p>
//               <p className="flex items-center">
//                 <strong>Durum:</strong>
//                 <span
//                   className={`ml-2 font-medium ${
//                     getOrderStatusDisplay(searchResult.orderStatus).color
//                   } flex items-center`}
//                 >
//                   {getOrderStatusDisplay(searchResult.orderStatus).icon}
//                   {getOrderStatusDisplay(searchResult.orderStatus).label}
//                 </span>
//               </p>
//               <p>
//                 <strong>Toplam Tutar:</strong>{" "}
//                 {searchResult.totalAmount?.toFixed(2)} TL
//               </p>
//               {/* İsterseniz daha fazla detay eklenebilir */}
//             </div>
//           </div>
//         )}

//         <div className="mt-6 text-center">
//           <p className="text-sm text-muted-foreground mb-2">veya</p>
//           <Button
//             variant="outline"
//             onClick={handleLoginRedirect}
//             className="w-full"
//           >
//             <LogIn className="h-4 w-4 mr-2" />
//             Giriş Yaparak Tüm Siparişlerinizi Görün
//           </Button>
//         </div>
//         <DialogFooter className="mt-4">
//           <DialogClose asChild>
//             <Button type="button" variant="secondary">
//               Kapat
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default OrderTrackingModal;

// client/src/components/shopping-view/OrderTrackingModal.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Loader2,
  LogIn,
  Search,
  PackageCheck,
  Truck,
  PackageX,
} from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO, isValid } from "date-fns";

const OrderTrackingModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderIdInput, setOrderIdInput] = useState("");
  // const [emailInput, setEmailInput] = useState(''); // E-POSTA STATE'İ KALDIRILDI
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      // Sadece orderId kontrolü
      setSearchError("Lütfen Sipariş Numaranızı giriniz.");
      setSearchResult(null);
      return;
    }
    setIsLoading(true);
    setSearchError("");
    setSearchResult(null);

    try {
      // Backend'e istek atarken e-posta parametresi kaldırıldı
      const response = await axios.get(
        `http://localhost:5000/api/shop/order/track/${orderIdInput.trim()}` // E-posta query parametresi kaldırıldı
      );
      if (response.data.success) {
        setSearchResult(response.data.data);
      } else {
        setSearchError(response.data.message || "Sipariş bulunamadı."); // Hata mesajı güncellendi
      }
    } catch (error) {
      setSearchError(
        error.response?.data?.message ||
          "Sipariş sorgulanırken bir hata oluştu."
      );
      console.error("Sipariş sorgulama hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/auth/login");
    onClose();
  };

  const getOrderStatusDisplay = (status) => {
    const statusMapping = {
      pending_payment: {
        label: "Ödeme Bekleniyor",
        icon: <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />,
        color: "text-yellow-600",
      },
      pending: {
        label: "Onay Bekleniyor",
        icon: <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />,
        color: "text-yellow-600",
      },
      confirmed: {
        label: "Onaylandı",
        icon: <PackageCheck className="w-5 h-5 text-blue-500 mr-2" />,
        color: "text-blue-600",
      },
      inProcess: {
        label: "Hazırlanıyor",
        icon: <PackageCheck className="w-5 h-5 text-blue-500 mr-2" />,
        color: "text-blue-600",
      },
      inShipping: {
        label: "Kargoda",
        icon: <Truck className="w-5 h-5 text-orange-500 mr-2" />,
        color: "text-orange-600",
      },
      delivered: {
        label: "Teslim Edildi",
        icon: <PackageCheck className="w-5 h-5 text-green-500 mr-2" />,
        color: "text-green-600",
      },
      cancelled: {
        label: "İptal Edildi",
        icon: <PackageX className="w-5 h-5 text-red-500 mr-2" />,
        color: "text-red-600",
      },
      failed: {
        label: "Başarısız Oldu",
        icon: <PackageX className="w-5 h-5 text-red-500 mr-2" />,
        color: "text-red-600",
      },
      default: {
        label: status || "Bilinmiyor",
        icon: <AlertCircle className="w-5 h-5 text-gray-500 mr-2" />,
        color: "text-gray-600",
      },
    };
    return statusMapping[status] || statusMapping.default;
  };

  const formatDate = (dateString) => {
    if (!dateString || !isValid(parseISO(dateString))) return "N/A";
    return format(parseISO(dateString), "dd.MM.yyyy HH:mm");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sipariş Takibi</DialogTitle>
          <DialogDescription>
            Siparişinizin durumunu sorgulayın veya siparişlerinizi görmek için
            giriş yapın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleTrackOrder} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="orderId">Sipariş Numaranız</Label>
            <Input
              id="orderId"
              placeholder="Sipariş numaranızı girin (örn: 662f...)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              required
            />
          </div>
          {/* E-POSTA INPUT ALANI KALDIRILDI
          <div className="grid gap-2">
            <Label htmlFor="email">E-posta Adresiniz</Label>
            <Input
              id="email"
              type="email"
              placeholder="Siparişte kullandığınız e-posta"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
          </div>
          */}
          {searchError && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {searchError}
            </p>
          )}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Siparişimi Sorgula
          </Button>
        </form>

        {searchResult && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-2">Sipariş Durumu</h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Sipariş No:</strong> {searchResult._id}
              </p>
              <p>
                <strong>Tarih:</strong> {formatDate(searchResult.orderDate)}
              </p>
              <p className="flex items-center">
                <strong>Durum:</strong>
                <span
                  className={`ml-2 font-medium ${
                    getOrderStatusDisplay(searchResult.orderStatus).color
                  } flex items-center`}
                >
                  {getOrderStatusDisplay(searchResult.orderStatus).icon}
                  {getOrderStatusDisplay(searchResult.orderStatus).label}
                </span>
              </p>

              <p>
                <strong>Toplam Tutar:</strong>{" "}
                {searchResult.totalAmount?.toFixed(2)} TL
              </p>
              {searchResult.guestInfo?.fullName && ( // Sadece misafir siparişi ise ve isim varsa göster
                <p>
                  <strong>Alıcı:</strong>{" "}
                  {searchResult.guestInfo.fullName.substring(0, 1) +
                    "****" +
                    searchResult.guestInfo.fullName.substring(
                      searchResult.guestInfo.fullName.lastIndexOf(" ") - 1,
                      searchResult.guestInfo.fullName.lastIndexOf(" ")
                    ) +
                    "****"}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">veya</p>
          <Button
            variant="outline"
            onClick={handleLoginRedirect}
            className="w-full"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Giriş Yaparak Tüm Siparişlerinizi Görün
          </Button>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Kapat
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderTrackingModal;
