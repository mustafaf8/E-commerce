// import { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Dialog } from "../ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import ShoppingOrderDetailsView from "./order-details";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllOrdersByUserId,
//   getOrderDetails,
//   resetOrderDetails,
// } from "@/store/shop/order-slice";
// import { Badge } from "../ui/badge";

// function ShoppingOrders() {
//   const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

//   function handleFetchOrderDetails(getId) {
//     dispatch(getOrderDetails(getId));
//   }

//   useEffect(() => {
//     dispatch(getAllOrdersByUserId(user?.id));
//   }, [dispatch]);

//   useEffect(() => {
//     if (orderDetails !== null) setOpenDetailsDialog(true);
//   }, [orderDetails]);

//   console.log(orderDetails, "siparis detaylari");

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Sipariş Gecmisi</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Sipariş No</TableHead>
//               <TableHead>Sipariş Tarihi</TableHead>
//               <TableHead>Ödeme Durumu</TableHead>
//               <TableHead>Sipariş Tutari</TableHead>
//               <TableHead>
//                 <span className="sr-only">Details</span>
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {orderList && orderList.length > 0
//               ? orderList.map((orderItem) => (
//                   <TableRow>
//                     <TableCell>{orderItem?._id}</TableCell>
//                     <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
//                     <TableCell>
//                       <Badge
//                         className={`py-1 px-3 ${
//                           orderItem?.orderStatus === "confirmed"
//                             ? "bg-green-500"
//                             : orderItem?.orderStatus === "rejected"
//                             ? "bg-red-600"
//                             : "bg-black"
//                         }`}
//                       >
//                         {orderItem?.orderStatus}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>{orderItem?.totalAmount} TL</TableCell>
//                     <TableCell>
//                       <Dialog
//                         open={openDetailsDialog}
//                         onOpenChange={() => {
//                           setOpenDetailsDialog(false);
//                           dispatch(resetOrderDetails());
//                         }}
//                       >
//                         <Button
//                           onClick={() =>
//                             handleFetchOrderDetails(orderItem?._id)
//                           }
//                         >
//                           Detaylar
//                         </Button>
//                         <ShoppingOrderDetailsView orderDetails={orderDetails} />
//                       </Dialog>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               : null}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }

// export default ShoppingOrders;

// import { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// // Dialog importları
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogClose,
// } from "../ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import ShoppingOrderDetailsView from "./order-details";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllOrdersByUserId,
//   getOrderDetails,
//   resetOrderDetails,
// } from "@/store/shop/order-slice";
// import { Badge } from "../ui/badge";
// // Tarih formatlama için (eğer kullanıyorsan)
// import { format, parseISO, isValid } from "date-fns";

// function ShoppingOrders() {
//   // Hangi siparişin detayının açık olduğunu tutacak state
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   // Gerekli Redux state'leri (detayların yüklenme durumu dahil)
//   const {
//     orderList = [],
//     orderDetails,
//     isLoading: orderDetailsLoading,
//   } = useSelector((state) => state.shopOrder || {});

//   console.log(orderList, `orderDetails ${user?.id}`);

//   // "Detaylar" butonuna tıklandığında çalışacak fonksiyon
//   function handleFetchOrderDetails(getId) {
//     setSelectedOrderId(getId); // Hangi siparişin istendiğini state'e kaydet
//     dispatch(getOrderDetails(getId)); // Detayları Redux üzerinden getir
//   }

//   // Dialog kapatıldığında çalışacak fonksiyon
//   function handleDialogClose() {
//     setSelectedOrderId(null); // Seçili ID'yi sıfırla
//     dispatch(resetOrderDetails()); // Redux'taki detayları temizle
//   }

//   // Kullanıcı değiştiğinde sipariş listesini getir
//   useEffect(() => {
//     if (user?.id) {
//       dispatch(getAllOrdersByUserId(user.id));
//     }
//   }, [dispatch, user?.id]);

//   const statusMapping = {
//     pending: { label: "Beklemede", color: "bg-yellow-400" },
//     inProcess: { label: "Hazırlanıyor", color: "bg-orange-500" },
//     inShipping: { label: "Kargoda", color: "bg-orange-500" },
//     delivered: { label: "Teslim Edildi", color: "bg-green-600" },
//     rejected: { label: "Reddedildi", color: "bg-red-600" },
//     confirmed: { label: "Onaylandı", color: "bg-green-600" },
//     default: { label: "Bilinmiyor", color: "bg-black" },
//   };
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Sipariş Geçmişim</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Sipariş No</TableHead>
//               <TableHead>Sipariş Tarihi</TableHead>
//               <TableHead>Durum</TableHead>
//               <TableHead>Tutar</TableHead>
//               <TableHead>
//                 <span className="sr-only">Detaylar</span>
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {orderList && orderList.length > 0 ? (
//               orderList.map((orderItem) => {
//                 // Güvenli tarih formatlama (split hatasını önlemek için)
//                 let formattedDate = "N/A";
//                 if (orderItem?.orderDate) {
//                   try {
//                     const parsedDate = parseISO(orderItem.orderDate);
//                     if (isValid(parsedDate)) {
//                       formattedDate = format(parsedDate, "dd.MM.yyyy");
//                     }
//                   } catch (e) {
//                     console.error("Tarih formatlama hatası:", e);
//                   }
//                 }

//                 return (
//                   <TableRow key={orderItem?._id}>
//                     <TableCell>{orderItem?._id}</TableCell>
//                     <TableCell>{formattedDate}</TableCell>
//                     <TableCell>
//                       <Badge
//                         className={`p-1 px-3 w-24 justify-center ${
//                           statusMapping[orderItem?.orderStatus]?.color ||
//                           statusMapping.default.color
//                         }`}
//                       >
//                         {statusMapping[orderItem?.orderStatus]?.label ||
//                           statusMapping.default.label}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       {orderItem?.totalAmount?.toFixed(2) || 0} TL
//                     </TableCell>
//                     <TableCell>
//                       {/* Buton sadece state'i güncelleyip action'ı dispatch eder */}
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleFetchOrderDetails(orderItem?._id)}
//                       >
//                         Detaylar
//                       </Button>
//                       {/* Dialog artık map içinde DEĞİL */}
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center">
//                   Sipariş geçmişiniz bulunmamaktadır.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>

//         {/* SADECE BİR TANE Dialog bileşeni, map döngüsünün dışında */}
//         <Dialog
//           open={!!selectedOrderId} // Sadece bir sipariş ID'si seçiliyse açık olacak
//           onOpenChange={(isOpen) => {
//             // Dialog kapanmaya çalışırsa (overlay tıklama, ESC vb.)
//             if (!isOpen) {
//               handleDialogClose(); // State'leri temizle
//             }
//           }}
//         >
//           {/* DialogContent Dialog içinde olmalı */}
//           <DialogContent className="sm:max-w-[600px]">
//             <DialogHeader>
//               <DialogTitle>Sipariş Detayları ({selectedOrderId})</DialogTitle>
//             </DialogHeader>

//             {/* Yüklenme veya hata durumunu göster */}
//             {orderDetailsLoading ? (
//               <div className="p-4 text-center">Yükleniyor...</div>
//             ) : orderDetails ? (
//               // Yüklenen detayları gösteren component
//               <ShoppingOrderDetailsView orderDetails={orderDetails} />
//             ) : (
//               // Yükleme başarısızsa veya detay yoksa
//               selectedOrderId && (
//                 <div className="p-4 text-center text-red-500">
//                   Sipariş detayları yüklenemedi.
//                 </div>
//               )
//             )}

//             <DialogFooter>
//               {/* Kapatma butonu (onOpenChange tetiklenir) */}
//               <DialogClose asChild>
//                 <Button type="button" variant="secondary">
//                   Kapat
//                 </Button>
//               </DialogClose>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   );
// }

// export default ShoppingOrders;

// client/src/components/admin-view/orders.jsx
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// Dialog importları (Shadcn UI varsayımıyla)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details"; // Admin detay bileşeni
import { useDispatch, useSelector } from "react-redux";
// Admin slice'ından action'ları import et
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails, // Bu da admin slice'ında olmalı
} from "@/store/admin/order-slice"; // <<< DİKKAT: admin slice yolu
import { Badge } from "../ui/badge";
import { format, parseISO, isValid } from "date-fns";
import { Skeleton } from "../ui/skeleton"; // Skeleton eklendi

function AdminOrdersView() {
  // Dialog state yönetimi
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();
  // Admin order state'ini seç
  const {
    orderList = [], // Başlangıç değeri olarak boş dizi ata
    orderDetails,
    isLoading: orderDetailsLoading,
    // Ana liste yükleniyor durumu (eğer varsa, yoksa false varsay)
    isLoading: listLoading, // Varsa bu ismi kullanın, yoksa `listIsLoading` gibi farklı bir isim verin
  } = useSelector((state) => state.adminOrder || { isLoading: false }); // state.adminOrder yoksa boş obje ve isLoading:false kullan

  // Detayları getirme fonksiyonu
  function handleFetchOrderDetails(getId) {
    setSelectedOrderId(getId);
    dispatch(getOrderDetailsForAdmin(getId)); // Admin action'ını çağır
  }

  // Dialog kapatma fonksiyonu
  function handleDialogClose() {
    setSelectedOrderId(null);
    dispatch(resetOrderDetails()); // Admin slice'ındaki action'ı çağır
  }

  // Bileşen yüklendiğinde tüm siparişleri getir
  useEffect(() => {
    dispatch(getAllOrdersForAdmin()); // Admin action'ını çağır
  }, [dispatch]);

  console.log(orderList, "orderList (Admin)"); // Konsol log'u güncelleyelim

  const statusMapping = {
    pending: { label: "Beklemede", color: "bg-yellow-400" },
    inProcess: { label: "Hazırlanıyor", color: "bg-orange-500" },
    inShipping: { label: "Kargoda", color: "bg-orange-500" },
    delivered: { label: "Teslim Edildi", color: "bg-green-600" },
    rejected: { label: "Reddedildi", color: "bg-red-600" },
    confirmed: { label: "Onaylandı", color: "bg-green-600" },
    default: { label: "Bilinmiyor", color: "bg-black" },
  };

  // Yükleme durumunda gösterilecek Skeleton sayısı
  const skeletonRowCount = 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tüm Siparişler</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tabloyu yatay kaydırma için sarmala */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            {" "}
            {/* min-w-full ekleyerek taşmayı sağla */}
            <TableHeader>
              <TableRow>
                {/* Başlık hücrelerine padding ve boyut ayarları */}
                <TableHead className="py-2 px-2 sm:px-4 text-xs sm:text-sm max-[850px]:hidden">
                  Sipariş No
                </TableHead>
                {/* Tarih sütununu küçük ekranlarda gizle */}
                <TableHead className="py-2 px-2 sm:px-4 text-xs sm:text-sm hidden md:table-cell">
                  Sipariş Tarihi
                </TableHead>
                <TableHead className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                  Durum
                </TableHead>
                <TableHead className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                  Tutar
                </TableHead>
                <TableHead className="py-2 px-2 sm:px-4 text-xs sm:text-sm text-right">
                  {" "}
                  {/* Sağ hizala */}
                  <span className="sr-only">Detaylar</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listLoading ? ( // Ana liste yüklenirken Skeleton göster
                Array.from({ length: skeletonRowCount }).map((_, index) => (
                  <TableRow key={`skel-${index}`}>
                    <TableCell className="py-2 px-2 sm:px-4">
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell className="py-2 px-2 sm:px-4 hidden md:table-cell">
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="py-2 px-2 sm:px-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="py-2 px-2 sm:px-4">
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="py-2 px-2 sm:px-4 text-right">
                      <Skeleton className="h-8 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => {
                  // Güvenli tarih formatlama
                  let formattedDate = "N/A";
                  if (orderItem?.orderDate) {
                    try {
                      const parsedDate = parseISO(orderItem.orderDate);
                      if (isValid(parsedDate)) {
                        formattedDate = format(parsedDate, "dd.MM.yyyy HH:mm");
                      }
                    } catch (e) {
                      console.error("Tarih formatlama hatası:", e);
                    }
                  }

                  return (
                    <TableRow key={orderItem?._id}>
                      {/* Hücrelere padding ve boyut ayarları */}
                      <TableCell className="py-2 px-2 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap max-[850px]:hidden">
                        {orderItem?._id}
                      </TableCell>
                      {/* Tarih sütununu küçük ekranlarda gizle */}
                      <TableCell className="py-2 px-2 sm:px-4 text-xs sm:text-sm hidden md:table-cell">
                        {formattedDate}
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4">
                        <Badge
                          className={`p-1 px-2 sm:px-3 w-20 sm:w-24 justify-center text-[10px] sm:text-xs ${
                            // Boyut ve padding ayarlandı
                            statusMapping[orderItem?.orderStatus]?.color ||
                            statusMapping.default.color
                          }`}
                        >
                          {statusMapping[orderItem?.orderStatus]?.label ||
                            statusMapping.default.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                        {orderItem?.totalAmount?.toFixed(2) || 0} TL
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 h-auto" // Buton boyutu ve padding ayarlandı
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          Detay Gör
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-xs sm:text-sm"
                  >
                    Gösterilecek sipariş bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Tek Dialog */}
        <Dialog
          open={!!selectedOrderId}
          onOpenChange={(isOpen) => !isOpen && handleDialogClose()}
        >
          {/* Dialog içeriğinin de duyarlı olmasını sağla */}
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Sipariş Detayları ({selectedOrderId})</DialogTitle>
            </DialogHeader>
            {orderDetailsLoading ? (
              <div className="p-4 text-center">Yükleniyor...</div>
            ) : orderDetails ? (
              <AdminOrderDetailsView orderDetails={orderDetails} />
            ) : (
              selectedOrderId && (
                <div className="p-4 text-center text-red-500">
                  Sipariş detayları yüklenemedi.
                </div>
              )
            )}
            <DialogFooter className="mt-4">
              {" "}
              {/* Footer'a biraz boşluk */}
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Kapat
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
