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

function AdminOrdersView() {
  // Dialog state yönetimi
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();
  // Admin order state'ini seç
  const {
    orderList = [], // Başlangıç değeri olarak boş dizi ata
    orderDetails,
    isLoading: orderDetailsLoading, // Detay yükleniyor state'i
  } = useSelector((state) => state.adminOrder || {}); // state.adminOrder yoksa boş obje kullan

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tüm Siparişler admin icin</CardTitle>
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
            {/* orderList null/undefined kontrolü ve length kontrolü */}
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => {
                // Güvenli tarih formatlama
                let formattedDate = "N/A";
                if (orderItem?.orderDate) {
                  try {
                    const parsedDate = parseISO(orderItem.orderDate);
                    if (isValid(parsedDate)) {
                      formattedDate = format(parsedDate, "dd.MM.yyyy HH:mm"); // Saat de eklenebilir
                    }
                  } catch (e) {
                    console.error("Tarih formatlama hatası:", e);
                  }
                }

                return (
                  // Key prop eklendi
                  <TableRow key={orderItem?._id}>
                    <TableCell className="font-medium">
                      {orderItem?._id}
                    </TableCell>
                    <TableCell>{formattedDate}</TableCell>{" "}
                    {/* Formatlanmış tarih */}
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
                    </TableCell>{" "}
                    {/* TL ve format */}
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        Detay Gör
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Gösterilecek sipariş bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Tek Dialog */}
        <Dialog
          open={!!selectedOrderId}
          onOpenChange={(isOpen) => !isOpen && handleDialogClose()}
        >
          <DialogContent className="sm:max-w-[700px]">
            {" "}
            {/* Biraz daha geniş olabilir */}
            <DialogHeader>
              <DialogTitle>Sipariş Detayları ({selectedOrderId})</DialogTitle>
            </DialogHeader>
            {orderDetailsLoading ? (
              <div className="p-4 text-center">Yükleniyor...</div>
            ) : orderDetails ? (
              // Admin detay bileşenini kullan
              <AdminOrderDetailsView orderDetails={orderDetails} />
            ) : (
              <div className="p-4 text-center text-red-500">
                Sipariş detayları yüklenemedi.
              </div>
            )}
            <DialogFooter>
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
