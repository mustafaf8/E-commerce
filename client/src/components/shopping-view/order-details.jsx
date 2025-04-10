// import { useSelector } from "react-redux";
// import { Badge } from "../ui/badge";
// import { DialogContent } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";

// function ShoppingOrderDetailsView({ orderDetails }) {
//   const { user } = useSelector((state) => state.auth);

//   return (
//     <DialogContent className="sm:max-w-[600px]">
//       <div className="grid gap-6">
//         <div className="grid gap-2">
//           <div className="flex mt-6 items-center justify-between">
//             <p className="font-medium">Order ID</p>
//             <Label>{orderDetails?._id}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Date</p>
//             <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Price</p>
//             <Label>${orderDetails?.totalAmount}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment method</p>
//             <Label>{orderDetails?.paymentMethod}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment Status</p>
//             <Label>{orderDetails?.paymentStatus}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Status</p>
//             <Label>
//               <Badge
//                 className={`py-1 px-3 ${
//                   orderDetails?.orderStatus === "confirmed"
//                     ? "bg-green-500"
//                     : orderDetails?.orderStatus === "rejected"
//                     ? "bg-red-600"
//                     : "bg-black"
//                 }`}
//               >
//                 {orderDetails?.orderStatus}
//               </Badge>
//             </Label>
//           </div>
//         </div>
//         <Separator />
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Order Details</div>
//             <ul className="grid gap-3">
//               {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
//                 ? orderDetails?.cartItems.map((item) => (
//                     <li className="flex items-center justify-between">
//                       <span>Title: {item.title}</span>
//                       <span>Quantity: {item.quantity}</span>
//                       <span>Price: ${item.price}</span>
//                     </li>
//                   ))
//                 : null}
//             </ul>
//           </div>
//         </div>
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Shipping Info</div>
//             <div className="grid gap-0.5 text-muted-foreground">
//               <span>{user.userName}</span>
//               <span>{orderDetails?.addressInfo?.address}</span>
//               <span>{orderDetails?.addressInfo?.city}</span>
//               <span>{orderDetails?.addressInfo?.pincode}</span>
//               <span>{orderDetails?.addressInfo?.phone}</span>
//               <span>{orderDetails?.addressInfo?.notes}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DialogContent>
//   );
// }

// export default ShoppingOrderDetailsView;

import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
// DialogContent'i buradan kaldırın, çünkü parent component (orders.jsx) zaten bunu sağlıyor.
// import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
// date-fns fonksiyonlarını import et
import { format, parseISO, isValid } from "date-fns";

// Bu bileşenin hem admin hem de kullanıcı detayı için kullanıldığını varsayarsak,
// daha genel bir isim vermek veya iki ayrı component yapmak daha iyi olabilir.
// Şimdilik ShoppingOrderDetailsView olarak devam edelim.
function ShoppingOrderDetailsView({ orderDetails }) {
  // orderDetails null ise veya yükleniyorsa erken dönüş yap

  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) {
    return <div></div>;
  }

  // Güvenli tarih formatlama
  let formattedDate = "N/A";
  if (orderDetails.orderDate) {
    // orderDate var mı?
    try {
      const parsedDate = parseISO(orderDetails.orderDate); // ISO string'i parse et
      if (isValid(parsedDate)) {
        // Geçerli bir tarih mi?
        formattedDate = format(parsedDate, "dd.MM.yyyy HH:mm"); // Formatla
      }
    } catch (e) {
      console.error("Detayda tarih formatlama hatası:", e);
    }
  }

  // Adres bilgisindeki iletişim adını al
  // const contactName =
  //   orderDetails?.addressInfo?.contactName || "Alıcı Bilgisi Yok";

  const statusMapping = {
    pending: { label: "Beklemede", color: "bg-yellow-400" },
    inProcess: { label: "Hazırlanıyor", color: "bg-orange-500" },
    inShipping: { label: "Kargoda", color: "bg-orange-500" },
    delivered: { label: "Teslim Edildi", color: "bg-green-600" },
    rejected: { label: "Reddedildi", color: "bg-red-600" },
    confirmed: { label: "Onaylandı", color: "bg-green-600" },
    default: { label: "Bilinmiyor", color: "bg-black" },
  };

  return (
    // DialogContent wrapper'ı kaldırıldı. Parent component sağlamalı.
    <div className="grid gap-2 pt-2 pl-2 ">
      {" "}
      {/* Padding/gap ayarları */}
      {/* Sipariş Bilgileri */}
      <div className="grid gap-2 text-sm">
        {" "}
        {/* text-sm eklendi */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Sipariş No</p>
          <Label>{orderDetails._id}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Sipariş Tarihi</p>
          {/* Formatlanmış tarihi kullan */}
          <Label>{formattedDate}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Toplam Tutar</p>
          <Label className="font-medium">
            {orderDetails.totalAmount?.toFixed(2) || 0} TL
          </Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Ödeme Yöntemi</p>
          <Label className="capitalize">
            {orderDetails.paymentMethod?.replace("_", " ") || "Belirtilmemiş"}
          </Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Ödeme Durumu</p>
          <Label className="capitalize">
            {orderDetails.paymentStatus || "Bilinmiyor"}
          </Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Sipariş Durumu</p>
          {/* <Badge
            variant={
              orderDetails.orderStatus === "confirmed"
                ? "default"
                : orderDetails.orderStatus === "pending"
                ? "secondary"
                : orderDetails.orderStatus === "failed" ||
                  orderDetails.orderStatus === "rejected"
                ? "destructive"
                : "outline"
            }
            className="text-xs"
          >
            {orderDetails.orderStatus || "Bilinmiyor"}
          </Badge> */}
          {/* <Badge
            className={`py-1 px-3 ${
              orderDetails?.orderStatus === "confirmed"
                ? "bg-green-500"
                : orderDetails?.orderStatus === "rejected"
                ? "bg-red-600"
                : orderDetails?.orderStatus === "inProcess" ||
                  orderDetails?.orderStatus === "inShipping"
                ? "bg-orange-300" // Hazırlanıyor veya Kargoda -> Turuncu
                : "bg-black"
            }`}
          >
            {orderDetails?.orderStatus}
          </Badge> */}

          <Badge
            className={`p-1 px-3 w-24 justify-center ${
              statusMapping[orderDetails?.orderStatus]?.color ||
              statusMapping.default.color
            }`}
          >
            {statusMapping[orderDetails?.orderStatus]?.label ||
              statusMapping.default.label}
          </Badge>
        </div>
      </div>
      <Separator />
      {/* Ürünler */}
      <div className="grid gap-2">
        <h3 className="font-semibold">Ürünler</h3>
        <ul className="grid gap-2 text-sm">
          {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
            orderDetails.cartItems.map((item, index) => (
              <li
                key={item.productId + "-" + index}
                className="flex items-center justify-between"
              >
                <span className="text-muted-foreground">
                  {item.title} (x{item.quantity})
                </span>
                <span>
                  {(parseFloat(item.price || 0) * item.quantity).toFixed(2)} TL
                </span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">Ürün bilgisi bulunamadı.</li>
          )}
        </ul>
        <Separator className="my-2" />
        <div className="flex items-center justify-between font-semibold">
          <span>Genel Toplam</span>
          <span>{orderDetails.totalAmount?.toFixed(2) || 0} TL</span>
        </div>
      </div>
      <Separator />
      {/* Teslimat Adresi */}
      <div className="grid gap-2">
        <h3 className="font-semibold">Teslimat Adresi</h3>
        <div className="grid gap-0.5 text-sm text-muted-foreground">
          <span>{user.userName}</span>
          <span>{orderDetails.addressInfo?.address || "-"}</span>
          <span>
            {orderDetails.addressInfo?.city || "-"}
            {orderDetails.addressInfo?.pincode
              ? `, ${orderDetails.addressInfo.pincode}`
              : ""}
          </span>
          <span>{orderDetails.addressInfo?.phone || "-"}</span>
          {orderDetails.addressInfo?.notes && (
            <span>Not: {orderDetails.addressInfo.notes}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingOrderDetailsView;

//burada hata var cunku fiyat hepsi ayni order larin detay kisminda hal bu ki siparis tutatri kadar olmali siparis gecmisindeki gibi ilk sayfa detaydan once
