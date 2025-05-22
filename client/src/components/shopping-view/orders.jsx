import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
import { format, parseISO, isValid } from "date-fns";

function ShoppingOrders() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    orderList = [],
    orderDetails,
    isLoading: orderDetailsLoading,
  } = useSelector((state) => state.shopOrder || {});

  console.log(orderList, `orderDetails ${user?.id}`);
  function handleFetchOrderDetails(getId) {
    setSelectedOrderId(getId);
    dispatch(getOrderDetails(getId));
  }

  function handleDialogClose() {
    setSelectedOrderId(null);
    dispatch(resetOrderDetails());
  }

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
  
  // Format order date helper function
  const formatOrderDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const parsedDate = parseISO(dateString);
      if (isValid(parsedDate)) {
        return format(parsedDate, "dd.MM.yyyy");
      }
    } catch (e) {
      console.error("Tarih formatlama hatası:", e);
    }
    return "N/A";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sipariş Geçmişim</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile Card View (shown on small screens) */}
        <div className="md:hidden space-y-4">
          {orderList && orderList.length > 0 ? (
            orderList.map((orderItem) => (
              <Card key={orderItem?._id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Sipariş No</p>
                      <p className="text-sm font-medium">{orderItem?._id}</p>
                    </div>
                    <Badge
                      className={`p-1 px-3 text-xs ${
                        statusMapping[orderItem?.orderStatus]?.color ||
                        statusMapping.default.color
                      }`}
                    >
                      {statusMapping[orderItem?.orderStatus]?.label ||
                        statusMapping.default.label}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Sipariş Tarihi</p>
                      <p className="text-sm">{formatOrderDate(orderItem?.orderDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tutar</p>
                      <p className="text-sm font-medium">{orderItem?.totalAmount?.toFixed(2) || 0} TL</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-1"
                    onClick={() => handleFetchOrderDetails(orderItem?._id)}
                  >
                    Detaylar
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Sipariş geçmişiniz bulunmamaktadır.
            </div>
          )}
        </div>
        
        {/* Desktop Table View (hidden on small screens) */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead >Sipariş No</TableHead>
                <TableHead>Sipariş Tarihi</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Detaylar</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => {
                  return (
                    <TableRow key={orderItem?._id}>
                      <TableCell className="font-medium">
                        {orderItem?._id}
                      </TableCell>
                      <TableCell>{formatOrderDate(orderItem?.orderDate)}</TableCell>
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
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        >
                          Detaylar
                        </Button>
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
        </div>
        
        <Dialog
          open={!!selectedOrderId}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              handleDialogClose();
            }
          }}
        >
          <DialogContent className="sm:max-w-[600px] max-sm:w-[95%] max-sm:max-w-[95%]">
            <DialogHeader>
              <DialogTitle className="max-sm:text-sm">Sipariş Detayları ({selectedOrderId ? selectedOrderId.substring(0, 8) + "..." : ""})</DialogTitle>
            </DialogHeader>
            {orderDetailsLoading ? (
              <div className="p-4 text-center">Yükleniyor...</div>
            ) : orderDetails ? (
              <ShoppingOrderDetailsView orderDetails={orderDetails} />
            ) : (
              selectedOrderId && (
                <div className="p-4 text-center text-red-500">
                  Sipariş detayları yüklenemedi.
                </div>
              )
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

export default ShoppingOrders;
