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
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersWithOrders,
  fetchOrdersByUserIdForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
  clearSelectedUserOrders,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { format, parseISO, isValid } from "date-fns";
import { ArrowLeft, Loader2, Bell } from "lucide-react";

function UserListTable({ users, onViewOrdersClick, isLoading }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kullanıcı Adı</TableHead>
          <TableHead>E-posta</TableHead>
          <TableHead className="text-center">Sipariş Sayısı</TableHead>
          <TableHead className="text-right">Son Sipariş</TableHead>
          <TableHead className="text-right">İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            </TableCell>
          </TableRow>
        ) : users && users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user.userId}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {user.hasNewOrder && (
                    <Bell
                      className="h-4 w-4 text-blue-500 flex-shrink-0"
                      title="Yeni / İşlenmemiş Sipariş Var"
                    />
                  )}
                  <span>{user.userName || "N/A"}</span>
                </div>
              </TableCell>
              <TableCell>{user.email || user.phoneNumber || "N/A"}</TableCell>
              <TableCell className="text-center">{user.orderCount}</TableCell>
              <TableCell className="text-right">
                {user.lastOrderDate && isValid(parseISO(user.lastOrderDate))
                  ? format(parseISO(user.lastOrderDate), "dd.MM.yyyy")
                  : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewOrdersClick(user.userId)}
                >
                  Siparişleri Gör
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Siparişi olan kullanıcı bulunamadı.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function UserOrdersTable({ orders, onViewDetailsClick, isLoading }) {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sipariş No</TableHead>
          <TableHead>Sipariş Tarihi</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>Tutar</TableHead>
          <TableHead className="text-right">Detaylar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            </TableCell>
          </TableRow>
        ) : orders && orders.length > 0 ? (
          orders.map((orderItem) => {
            let formattedDate = "N/A";
            if (
              orderItem?.orderDate &&
              isValid(parseISO(orderItem.orderDate))
            ) {
              formattedDate = format(
                parseISO(orderItem.orderDate),
                "dd.MM.yyyy HH:mm"
              );
            }
            return (
              <TableRow key={orderItem._id}>
                <TableCell className="font-mono text-xs">
                  {orderItem._id}
                </TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>
                  <Badge
                    className={`p-1 px-3 text-xs justify-center min-w-[90px] ${
                      statusMapping[orderItem?.orderStatus]?.color ||
                      statusMapping.default.color
                    }`}
                  >
                    {statusMapping[orderItem?.orderStatus]?.label ||
                      statusMapping.default.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {orderItem.totalAmount?.toFixed(2) || 0} TL
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetailsClick(orderItem._id)}
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
              Bu kullanıcıya ait sipariş bulunamadı.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function AdminOrdersView() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedOrderIdForDetails, setSelectedOrderIdForDetails] =
    useState(null);

  const dispatch = useDispatch();
  const {
    userList,
    selectedUserOrders,
    orderDetails,
    isUserListLoading,
    isUserOrdersLoading,
    isDetailsLoading,
    error,
  } = useSelector(
    (state) =>
      state.adminOrder || {
        userList: [],
        selectedUserOrders: [],
        orderDetails: null,
        isUserListLoading: false,
        isUserOrdersLoading: false,
        isDetailsLoading: false,
        error: null,
      }
  );

  useEffect(() => {
    dispatch(fetchUsersWithOrders());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchOrdersByUserIdForAdmin(selectedUserId));
    }
  }, [selectedUserId, dispatch]);

  const handleViewUserOrders = (userId) => {
    setSelectedUserId(userId);
  };

  const handleBackToUserList = () => {
    setSelectedUserId(null);
    dispatch(clearSelectedUserOrders());
  };

  const handleViewOrderDetails = (orderId) => {
    setSelectedOrderIdForDetails(orderId);
    dispatch(getOrderDetailsForAdmin(orderId));
  };

  const handleDetailsDialogClose = () => {
    setSelectedOrderIdForDetails(null);
    dispatch(resetOrderDetails());
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedUserId && ( // Sadece kullanıcı seçiliyse geri butonu göster
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleBackToUserList}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <CardTitle>
              {selectedUserId
                ? `Kullanıcı Siparişleri`
                : "Sipariş Veren Kullanıcılar"}
            </CardTitle>
          </div>
          {/* Sağ tarafa başka bir şey eklenebilir */}
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {!selectedUserId ? (
          <UserListTable
            users={userList}
            onViewOrdersClick={handleViewUserOrders}
            isLoading={isUserListLoading}
          />
        ) : (
          <UserOrdersTable
            orders={selectedUserOrders}
            onViewDetailsClick={handleViewOrderDetails}
            isLoading={isUserOrdersLoading}
          />
        )}
      </CardContent>
      <Dialog
        open={!!selectedOrderIdForDetails}
        onOpenChange={(isOpen) => !isOpen && handleDetailsDialogClose()}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              Sipariş Detayları ({selectedOrderIdForDetails})
            </DialogTitle>
          </DialogHeader>
          {isDetailsLoading ? (
            <div className="p-4 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orderDetails ? (
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
    </Card>
  );
}

export default AdminOrdersView;
