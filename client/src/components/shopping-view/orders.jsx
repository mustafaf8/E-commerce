import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/utils";
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
import { orderStatusMappingUser } from "@/config";
import { ScrollArea } from "@/components/ui/scroll-area";

function ShoppingOrders() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    orderList = [],
    orderDetails,
    isLoading: orderDetailsLoading,
  } = useSelector((state) => state.shopOrder || {});

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

  const formatOrderDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const parsedDate = parseISO(dateString);
      if (isValid(parsedDate)) {
        return format(parsedDate, "dd.MM.yyyy");
      }
    } catch (e) {
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
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Sipariş No
                      </p>
                      <p className="text-xs md:text-sm font-medium break-all">{orderItem?._id}</p>
                    </div>
                    <Badge
                      className={`p-1 px-3 w-24 justify-center text-xs mt-2.5 ${
                        orderStatusMappingUser[orderItem?.orderStatus]?.color ||
                        orderStatusMappingUser.default.color
                      } ${
                        orderStatusMappingUser[orderItem?.orderStatus] ||
                        orderStatusMappingUser.default
                      }`}
                    >
                      {orderStatusMappingUser[orderItem?.orderStatus]?.label ||
                        orderStatusMappingUser.default.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Sipariş Tarihi
                      </p>
                      <p className="text-sm">
                        {formatOrderDate(orderItem?.orderDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tutar</p>
                      <p className="text-sm font-medium whitespace-nowrap">
                        {formatPrice(orderItem?.totalAmount || 0)} TL
                      </p>
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
                <TableHead>Sipariş No</TableHead>
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
                      <TableCell>
                        {formatOrderDate(orderItem?.orderDate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`p-1 px-3 w-24 justify-center ${
                            orderStatusMappingUser[orderItem?.orderStatus]
                              ?.color || orderStatusMappingUser.default.color
                          }`}
                        >
                          {orderStatusMappingUser[orderItem?.orderStatus]
                            ?.label || orderStatusMappingUser.default.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatPrice(orderItem?.totalAmount || 0)} TL
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
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
          <DialogContent className="sm:max-w-[600px] w-[95%] p-0 flex flex-col max-h-[90vh]">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle>
                Sipariş Detayları ({selectedOrderId ? selectedOrderId : ""})
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="px-6 py-4">
                {orderDetailsLoading ? (
                  <div className="text-center">Yükleniyor...</div>
                ) : orderDetails ? (
                  <ShoppingOrderDetailsView orderDetails={orderDetails} />
                ) : (
                  selectedOrderId && (
                    <div className="text-center text-red-500">
                      Sipariş detayları yüklenemedi.
                    </div>
                  )
                )}
              </div>
            </ScrollArea>

            <DialogFooter className="p-6 pt-4 border-t bg-gray-50 dark:bg-gray-800">
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
