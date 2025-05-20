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
  fetchAllGuestOrdersForAdmin,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { format, parseISO, isValid } from "date-fns";
import { ArrowLeft, Loader2, Bell, Users } from "lucide-react";
import PropTypes from "prop-types";

const orderStatusMapping = {
  pending: {
    label: "Beklemede",
    color: "bg-yellow-400",
    textColor: "text-yellow-800 dark:text-yellow-200",
  },
  pending_payment: {
    label: "Ödeme Bekleniyor",
    color: "bg-amber-500",
    textColor: "text-amber-800 dark:text-amber-200",
  },
  confirmed: {
    label: "Onaylandı",
    color: "bg-blue-500",
    textColor: "text-blue-100 dark:text-blue-200",
  },
  inProcess: {
    label: "Hazırlanıyor",
    color: "bg-orange-500",
    textColor: "text-orange-100 dark:text-orange-200",
  },
  inShipping: {
    label: "Kargoda",
    color: "bg-teal-500",
    textColor: "text-teal-100 dark:text-teal-200",
  },
  delivered: {
    label: "Teslim Edildi",
    color: "bg-green-600",
    textColor: "text-green-100 dark:text-green-200",
  },
  rejected: {
    label: "Reddedildi",
    color: "bg-red-600",
    textColor: "text-red-100 dark:text-red-200",
  },
  cancelled: {
    label: "İptal Edildi",
    color: "bg-slate-500",
    textColor: "text-slate-100 dark:text-slate-200",
  },
  failed: {
    label: "Başarısız",
    color: "bg-red-700",
    textColor: "text-red-100 dark:text-red-200",
  },
  default: {
    label: "Bilinmiyor",
    color: "bg-gray-700",
    textColor: "text-gray-100 dark:text-gray-200",
  },
};

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
  UserOrdersTable.propTypes = {
    orders: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        orderDate: PropTypes.string,
        orderStatus: PropTypes.string,
        totalAmount: PropTypes.number,
      })
    ).isRequired,
    onViewDetailsClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };
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

function RegisteredUserOrdersTable({ orders, onViewDetailsClick, isLoading }) {
  return (
    <UserOrdersTable
      orders={orders}
      onViewDetailsClick={onViewDetailsClick}
      isLoading={isLoading}
    />
  );
}

RegisteredUserOrdersTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      orderDate: PropTypes.string,
      orderStatus: PropTypes.string,
      totalAmount: PropTypes.number,
    })
  ).isRequired,
  onViewDetailsClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

function GuestOrdersTable({ orders, onViewDetailsClick, isLoading }) {
  GuestOrdersTable.propTypes = {
    orders: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        orderDate: PropTypes.string,
        orderStatus: PropTypes.string,
        totalAmount: PropTypes.number,
        guestInfo: PropTypes.shape({
          fullName: PropTypes.string,
          email: PropTypes.string,
        }),
        addressInfo: PropTypes.shape({
          fullName: PropTypes.string,
        }),
      })
    ).isRequired,
    onViewDetailsClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sipariş No</TableHead>
          <TableHead>Alıcı (Misafir)</TableHead>
          <TableHead>Sipariş Tarihi</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>Tutar</TableHead>
          <TableHead className="text-right">Detaylar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">
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
            const statusInfo =
              orderStatusMapping[orderItem?.orderStatus] ||
              orderStatusMapping.default;
            const guestName =
              orderItem.guestInfo?.fullName ||
              orderItem.addressInfo?.fullName ||
              "Misafir";
            const guestEmail = orderItem.guestInfo?.email;

            return (
              <TableRow key={orderItem._id}>
                <TableCell className="font-mono text-xs">
                  {orderItem._id}
                </TableCell>
                <TableCell className="text-sm">
                  <div>{guestName}</div>
                  {guestEmail && (
                    <div className="text-xs text-muted-foreground">
                      {guestEmail}
                    </div>
                  )}
                </TableCell>
                <TableCell>{formattedDate}</TableCell>
                <TableCell>
                  <Badge
                    className={`p-1 px-3 text-xs justify-center min-w-[100px] ${statusInfo.color} ${statusInfo.textColor}`}
                  >
                    {statusInfo.label}
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
            <TableCell colSpan={6} className="text-center">
              Misafir siparişi bulunamadı.
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
    guestOrderList,
    isGuestOrdersLoading,
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
        guestOrderList: [],
        isGuestOrdersLoading: false,
      }
  );

  useEffect(() => {
    dispatch(fetchUsersWithOrders());
    dispatch(fetchAllGuestOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUserId && selectedUserId !== "GUEST_ORDERS_VIRTUAL_ID") {
      // "GUEST_ORDERS_VIRTUAL_ID" HARİÇ
      dispatch(fetchOrdersByUserIdForAdmin(selectedUserId));
    } else if (selectedUserId === "GUEST_ORDERS_VIRTUAL_ID") {
      // Bu durumda misafir siparişleri zaten guestOrderList'te,
      // selectedUserOrders'ı temizleyebiliriz veya misafirleri oraya atayabiliriz.
      // Şimdilik ayrı tutuyoruz.
      dispatch(clearSelectedUserOrders());
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
    <div className="flex flex-col space-y-6">
      {error && (
        <p className="text-red-600 text-sm mt-2 p-4 bg-red-100 rounded-md">
          {error}
        </p>
      )}
      {selectedUserId && (
        <div className="flex items-center gap-2 mb-0 px-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleBackToUserList}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {selectedUserId === "GUEST_ORDERS_VIRTUAL_ID"
              ? "Tüm Misafir Siparişleri"
              : `Kullanıcı Siparişleri (${
                  userList.find((u) => u.userId === selectedUserId)?.userName ||
                  selectedUserId
                })`}
          </h2>
        </div>
      )}
      {!selectedUserId ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Sipariş Veren Kullanıcılar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UserListTable
              users={userList}
              onViewOrdersClick={handleViewUserOrders}
              isLoading={isUserListLoading}
            />
          </CardContent>
        </Card>
      ) : selectedUserId === "GUEST_ORDERS_VIRTUAL_ID" ? (
        // Misafir Siparişleri Listesi Gösterimi
        <Card>
          <CardHeader>
            {/* Başlık yukarıda zaten var, gerekirse buraya da eklenebilir */}
          </CardHeader>
          <CardContent>
            <GuestOrdersTable
              orders={guestOrderList}
              onViewDetailsClick={handleViewOrderDetails}
              isLoading={isGuestOrdersLoading}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>{/* Başlık yukarıda zaten var */}</CardHeader>
          <CardContent>
            <RegisteredUserOrdersTable
              orders={selectedUserOrders}
              onViewDetailsClick={handleViewOrderDetails}
              isLoading={isUserOrdersLoading}
            />
          </CardContent>
        </Card>
      )}
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
    </div>
  );
}
UserListTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string.isRequired,
      userName: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      orderCount: PropTypes.number,
      lastOrderDate: PropTypes.string,
      hasNewOrder: PropTypes.bool,
    })
  ),
  onViewOrdersClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default AdminOrdersView;
