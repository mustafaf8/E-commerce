// import { useSelector } from "react-redux";
// import { Badge } from "../ui/badge";
// import PropTypes from "prop-types";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";
// import { format, parseISO, isValid } from "date-fns";
// import { orderStatusMapping } from "@/config";

// function ShoppingOrderDetailsView({ orderDetails }) {
//   const { user } = useSelector((state) => state.auth);

//   if (!orderDetails) {
//     return <div></div>;
//   }

//   let formattedDate = "N/A";
//   if (orderDetails.orderDate) {
//     try {
//       const parsedDate = parseISO(orderDetails.orderDate);
//       if (isValid(parsedDate)) {
//         formattedDate = format(parsedDate, "dd.MM.yyyy HH:mm");
//       }
//     } catch (e) {
//       console.error("Detayda tarih formatlama hatası:", e);
//     }
//   }

//   return (
//     <div className="grid gap-2 pt-2 pl-2 ">
//       <div className="grid gap-2 text-sm">
//         <div className="flex items-center justify-between">
//           <p className="text-muted-foreground">Sipariş No</p>
//           <Label>{orderDetails._id}</Label>
//         </div>
//         <div className="flex items-center justify-between">
//           <p className="text-muted-foreground">Sipariş Tarihi</p>
//           {/* Formatlanmış tarihi kullan */}
//           <Label>{formattedDate}</Label>
//         </div>
//         <div className="flex items-center justify-between">
//           <p className="text-muted-foreground">Toplam Tutar</p>
//           <Label className="font-medium">
//             {orderDetails.totalAmount?.toFixed(2) || 0} TL
//           </Label>
//         </div>
//         <div className="flex items-center justify-between">
//           <p className="text-muted-foreground">Ödeme Yöntemi</p>
//           <Label className="capitalize">
//             {orderDetails.paymentMethod?.replace("_", " ") || "Belirtilmemiş"}
//           </Label>
//         </div>
//         <div className="flex items-center justify-between">
//           <p className="text-muted-foreground">Ödeme Durumu</p>
//           <Label className="capitalize">
//             {orderDetails.paymentStatus || "Bilinmiyor"}
//           </Label>
//         </div>
//         <div className="flex items-center justify-between">
//           <p className="text-muted-foreground">Sipariş Durumu</p>

//           <Badge
//             className={`p-1 px-3 w-24 justify-center ${
//               orderStatusMapping[orderDetails?.orderStatus]?.color ||
//               orderStatusMapping.default.color
//             } ${
//               // textColor eklendi
//               orderStatusMapping[orderDetails?.orderStatus]?.textColor ||
//               orderStatusMapping.default.textColor
//             }`}
//           >
//             {orderStatusMapping[orderDetails?.orderStatus]?.label ||
//               orderStatusMapping.default.label}
//           </Badge>
//         </div>
//       </div>
//       <Separator />
//       {/* Ürünler */}
//       <div className="grid gap-2">
//         <h3 className="font-semibold">Ürünler</h3>
//         <ul className="grid gap-2 text-sm">
//           {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
//             orderDetails.cartItems.map((item, index) => (
//               <li
//                 key={item.productId + "-" + index}
//                 className="flex items-center justify-between"
//               >
//                 <span className="text-muted-foreground">
//                   {item.title} (x{item.quantity})
//                 </span>
//                 <span>
//                   {(parseFloat(item.price || 0) * item.quantity).toFixed(2)} TL
//                 </span>
//               </li>
//             ))
//           ) : (
//             <li className="text-muted-foreground">Ürün bilgisi bulunamadı.</li>
//           )}
//         </ul>
//         <Separator className="my-2" />
//         <div className="flex items-center justify-between font-semibold">
//           <span>Genel Toplam</span>
//           <span>{orderDetails.totalAmount?.toFixed(2) || 0} TL</span>
//         </div>
//       </div>
//       <Separator />
//       {/* Teslimat Adresi */}
//       <div className="grid gap-2">
//         <h3 className="font-semibold">Teslimat Adresi</h3>
//         <div className="grid gap-0.5 text-sm text-muted-foreground">
//           <span>{user.userName}</span>
//           <span>{orderDetails.addressInfo?.address || "-"}</span>
//           <span>
//             {orderDetails.addressInfo?.city || "-"}
//             {orderDetails.addressInfo?.pincode
//               ? `, ${orderDetails.addressInfo.pincode}`
//               : ""}
//           </span>
//           <span>{orderDetails.addressInfo?.phone || "-"}</span>
//           {orderDetails.addressInfo?.notes && (
//             <span>Not: {orderDetails.addressInfo.notes}</span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// ShoppingOrderDetailsView.propTypes = {
//   orderDetails: PropTypes.shape({
//     _id: PropTypes.string,
//     orderDate: PropTypes.string,
//     totalAmount: PropTypes.number,
//     paymentMethod: PropTypes.string,
//     paymentStatus: PropTypes.string,
//     orderStatus: PropTypes.string,
//     cartItems: PropTypes.arrayOf(
//       PropTypes.shape({
//         productId: PropTypes.string,
//         title: PropTypes.string,
//         quantity: PropTypes.number,
//         price: PropTypes.string,
//       })
//     ),
//     addressInfo: PropTypes.shape({
//       address: PropTypes.string,
//       city: PropTypes.string,
//       pincode: PropTypes.string,
//       phone: PropTypes.string,
//       notes: PropTypes.string,
//     }),
//   }),
// };

// export default ShoppingOrderDetailsView;

import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import PropTypes from "prop-types";
import { Separator } from "../ui/separator"; // Separator shadcn/ui'den import ediliyor
import { format, parseISO, isValid } from "date-fns";
import { orderStatusMapping } from "@/config";
import { Card } from "../ui/card"; // Card componentini import ediyoruz
import { Package, CreditCard, MapPin, User, ShoppingCart } from "lucide-react"; // İkonları import ediyoruz

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth); // isAuthenticated eklendi

  if (!orderDetails) {
    return <div>Sipariş detayı bulunamadı.</div>; // Veya bir yükleniyor göstergesi
  }

  let formattedDate = "N/A";
  if (orderDetails.orderDate) {
    try {
      const parsedDate = parseISO(orderDetails.orderDate);
      if (isValid(parsedDate)) {
        formattedDate = format(parsedDate, "dd.MM.yyyy HH:mm");
      }
    } catch (e) {
      console.error("Detayda tarih formatlama hatası:", e);
    }
  }

  const isGuest = orderDetails.isGuestOrder;
  const currentStatusKey = orderDetails.orderStatus || "default";
  const statusInfo =
    orderStatusMapping[currentStatusKey] || orderStatusMapping.default;

  // Alıcı bilgilerini belirle
  const recipientName = isGuest
    ? orderDetails.guestInfo?.fullName ||
      orderDetails.addressInfo?.fullName ||
      "Misafir Kullanıcı"
    : isAuthenticated && user
    ? user.userName
    : orderDetails.addressInfo?.fullName || "Kullanıcı Adı Yok";

  const recipientEmail = isGuest
    ? orderDetails.guestInfo?.email
    : isAuthenticated && user
    ? user.email
    : "E-posta Yok";

  return (
    <div className="grid gap-4 pt-2">
      {/* Üst Bilgi: Durum ve Toplam Tutar */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
        <Badge
          className={`px-3 py-1 text-xs sm:text-sm ${statusInfo.color} ${statusInfo.textColor}`}
        >
          {statusInfo.label}
        </Badge>
        <div className="text-right">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Toplam Tutar
          </div>
          <div className="text-lg sm:text-xl font-bold">
            {orderDetails.totalAmount?.toFixed(2) || 0} TL
          </div>
        </div>
      </div>

      {/* Sipariş Bilgileri Kartı */}
      <Card className="p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-4 w-4 text-primary" />
          <h3 className="text-sm sm:text-base font-semibold">
            Sipariş Bilgileri
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
          <div>
            <p className="text-muted-foreground">Sipariş No:</p>
            <p className="font-medium break-all">{orderDetails._id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sipariş Tarihi:</p>
            <p className="font-medium">{formattedDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ödeme Yöntemi:</p>
            <p className="font-medium capitalize">
              {orderDetails.paymentMethod?.replace("_", " ") || "Belirtilmemiş"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Ödeme Durumu:</p>
            <p className="font-medium capitalize">
              {orderDetails.paymentStatus || "Bilinmiyor"}
            </p>
          </div>
        </div>
      </Card>

      {/* Alıcı Bilgileri Kartı */}
      {!isGuest && isAuthenticated && user && (
        <Card className="p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-primary" />
            <h3 className="text-sm sm:text-base font-semibold">
              Alıcı Bilgileri
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
            <div>
              <p className="text-muted-foreground">Ad Soyad:</p>
              <p className="font-medium">{recipientName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">E-posta:</p>
              <p className="font-medium">{recipientEmail}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Teslimat Adresi Kartı */}
      <Card className="p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="text-sm sm:text-base font-semibold">
            Teslimat Adresi
          </h3>
        </div>
        {orderDetails.addressInfo ? (
          <div className="grid gap-1 text-xs sm:text-sm">
            <p className="font-medium">
              {orderDetails.addressInfo.fullName || recipientName}
            </p>
            <p className="text-muted-foreground">
              {orderDetails.addressInfo.address}
            </p>
            <p className="text-muted-foreground">
              {orderDetails.addressInfo.city}
              {orderDetails.addressInfo.pincode
                ? `, ${orderDetails.addressInfo.pincode}`
                : ""}
            </p>
            <p className="text-muted-foreground">
              Tel: {orderDetails.addressInfo.phone || "-"}
            </p>
            {orderDetails.addressInfo.notes && (
              <p className="text-xs text-muted-foreground italic pt-1 mt-1 border-t border-gray-200 dark:border-gray-700">
                Not: {orderDetails.addressInfo.notes}
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground">
            Teslimat adresi bilgisi bulunamadı.
          </p>
        )}
      </Card>

      {/* Sipariş Öğeleri Kartı */}
      <Card className="p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <h3 className="text-sm sm:text-base font-semibold">
            Sipariş Öğeleri
          </h3>
        </div>
        {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
          <div className="space-y-3">
            {orderDetails.cartItems.map((item, index) => (
              <div
                key={item.productId + "-" + index}
                className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0 text-xs sm:text-sm"
              >
                <div className="flex-grow pr-2">
                  <p className="font-medium truncate" title={item.title}>
                    {item.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Birim Fiyat: {parseFloat(item.price || 0).toFixed(2)} TL x{" "}
                    {item.quantity} adet
                  </p>
                </div>
                <p className="font-semibold whitespace-nowrap">
                  {(parseFloat(item.price || 0) * item.quantity).toFixed(2)} TL
                </p>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between items-center font-semibold text-sm sm:text-base pt-2 border-t">
              <p>Genel Toplam:</p>
              <p>{orderDetails.totalAmount?.toFixed(2) || 0} TL</p>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground">
            Sipariş içeriği bulunamadı.
          </p>
        )}
      </Card>
    </div>
  );
}

ShoppingOrderDetailsView.propTypes = {
  orderDetails: PropTypes.shape({
    _id: PropTypes.string,
    orderDate: PropTypes.string,
    totalAmount: PropTypes.number,
    paymentMethod: PropTypes.string,
    paymentStatus: PropTypes.string,
    orderStatus: PropTypes.string,
    isGuestOrder: PropTypes.bool, // Eklendi
    guestInfo: PropTypes.shape({
      // Eklendi
      fullName: PropTypes.string,
      email: PropTypes.string,
    }),
    cartItems: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string,
        title: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // price string veya number olabilir
      })
    ),
    addressInfo: PropTypes.shape({
      fullName: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      pincode: PropTypes.string,
      phone: PropTypes.string,
      notes: PropTypes.string,
    }),
  }),
};

export default ShoppingOrderDetailsView;
