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

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// Dialog importları
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
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
// Tarih formatlama için (eğer kullanıyorsan)
import { format, parseISO, isValid } from "date-fns";

function ShoppingOrders() {
  // Hangi siparişin detayının açık olduğunu tutacak state
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Gerekli Redux state'leri (detayların yüklenme durumu dahil)
  const {
    orderList = [],
    orderDetails,
    isLoading: orderDetailsLoading,
  } = useSelector((state) => state.shopOrder || {});

  console.log(orderList, `orderDetails ${user?.id}`);

  // "Detaylar" butonuna tıklandığında çalışacak fonksiyon
  function handleFetchOrderDetails(getId) {
    setSelectedOrderId(getId); // Hangi siparişin istendiğini state'e kaydet
    dispatch(getOrderDetails(getId)); // Detayları Redux üzerinden getir
  }

  // Dialog kapatıldığında çalışacak fonksiyon
  function handleDialogClose() {
    setSelectedOrderId(null); // Seçili ID'yi sıfırla
    dispatch(resetOrderDetails()); // Redux'taki detayları temizle
  }

  // Kullanıcı değiştiğinde sipariş listesini getir
  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

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
    <Card>
      <CardHeader>
        <CardTitle>Sipariş Geçmişim</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Sipariş Tarihi</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>
                <span className="sr-only">Detaylar</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => {
                // Güvenli tarih formatlama (split hatasını önlemek için)
                let formattedDate = "N/A";
                if (orderItem?.orderDate) {
                  try {
                    const parsedDate = parseISO(orderItem.orderDate);
                    if (isValid(parsedDate)) {
                      formattedDate = format(parsedDate, "dd.MM.yyyy");
                    }
                  } catch (e) {
                    console.error("Tarih formatlama hatası:", e);
                  }
                }

                return (
                  <TableRow key={orderItem?._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={`p-1 px-3 w-24 justify-center ${
                          statusMapping[orderItem?.orderStatus]?.color ||
                          statusMapping.default.color
                        }`}
                      >
                        {statusMapping[orderItem?.orderStatus]?.label ||
                          statusMapping.default.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {orderItem?.totalAmount?.toFixed(2) || 0} TL
                    </TableCell>
                    <TableCell>
                      {/* Buton sadece state'i güncelleyip action'ı dispatch eder */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        Detaylar
                      </Button>
                      {/* Dialog artık map içinde DEĞİL */}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Sipariş geçmişiniz bulunmamaktadır.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* SADECE BİR TANE Dialog bileşeni, map döngüsünün dışında */}
        <Dialog
          open={!!selectedOrderId} // Sadece bir sipariş ID'si seçiliyse açık olacak
          onOpenChange={(isOpen) => {
            // Dialog kapanmaya çalışırsa (overlay tıklama, ESC vb.)
            if (!isOpen) {
              handleDialogClose(); // State'leri temizle
            }
          }}
        >
          {/* DialogContent Dialog içinde olmalı */}
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Sipariş Detayları ({selectedOrderId})</DialogTitle>
            </DialogHeader>

            {/* Yüklenme veya hata durumunu göster */}
            {orderDetailsLoading ? (
              <div className="p-4 text-center">Yükleniyor...</div>
            ) : orderDetails ? (
              // Yüklenen detayları gösteren component
              <ShoppingOrderDetailsView orderDetails={orderDetails} />
            ) : (
              // Yükleme başarısızsa veya detay yoksa
              selectedOrderId && (
                <div className="p-4 text-center text-red-500">
                  Sipariş detayları yüklenemedi.
                </div>
              )
            )}

            <DialogFooter>
              {/* Kapatma butonu (onOpenChange tetiklenir) */}
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

export default ShoppingOrders;
