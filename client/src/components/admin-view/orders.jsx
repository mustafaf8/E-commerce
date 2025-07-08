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
import {
  ArrowLeft,
  Loader2,
  Bell,
  UserCog,
  UserMinus,
  ShoppingBag,
} from "lucide-react";
import PropTypes from "prop-types";
import { orderStatusMappingAdmin } from "@/config";
import useAdminPermission from "@/hooks/useAdminPermission";

function UserListTable({ users, onViewOrdersClick, isLoading }) {
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
    ).isRequired,
    onViewOrdersClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };
  // Filter out any entries that might be guest/misafir related
  const filteredUsers = users.filter(
    (user) =>
      !(
        user.userName?.toLowerCase().includes("misafir") ||
        user.userId === "GUEST_ORDERS_VIRTUAL_ID"
      )
  );

  const [showAll, setShowAll] = useState(false);
  const displayUsers = showAll ? filteredUsers : filteredUsers.slice(0, 12);

  return (
    <div className="overflow-visible">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="border-b border-border h-7">
            <TableHead className="py-1 text-xs">Kullanıcı</TableHead>
            <TableHead className="py-1 text-xs">E-posta</TableHead>
            <TableHead className="text-center py-1 text-xs">Sip.</TableHead>
            <TableHead className="text-right py-1 text-xs">Tarih</TableHead>
            <TableHead className="text-right py-1 text-xs w-20">
              İşlem
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-2">
                <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            displayUsers.map((user) => (
              <TableRow key={user.userId} className="border-b border-muted h-7">
                <TableCell className="font-medium py-1 text-xs">
                  <div className="flex items-center gap-1">
                    {user.hasNewOrder && (
                      <Bell
                        className="h-3 w-3 text-blue-500 flex-shrink-0"
                        title="Yeni / İşlenmemiş Sipariş Var"
                      />
                    )}
                    <span className="truncate max-w-[100px]">
                      {user.userName || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-1 text-xs truncate max-w-[120px]">
                  {user.email || user.phoneNumber || "N/A"}
                </TableCell>
                <TableCell className="text-center py-1 text-xs">
                  {user.orderCount}
                </TableCell>
                <TableCell className="text-right py-1 text-xs">
                  {user.lastOrderDate && isValid(parseISO(user.lastOrderDate))
                    ? format(parseISO(user.lastOrderDate), "dd.MM.yy")
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right py-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-5 px-2 text-xs"
                    onClick={() => onViewOrdersClick(user.userId)}
                  >
                    Görüntüle
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-xs py-2">
                Siparişi olan kullanıcı bulunamadı.
              </TableCell>
            </TableRow>
          )}
          {filteredUsers.length > 12 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-1">
                <Button
                  variant="link"
                  className="text-xs text-muted-foreground h-5 p-0"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll
                    ? "Daha Az Göster"
                    : `Tümünü Görüntüle (${filteredUsers.length})`}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
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
  const [showAll, setShowAll] = useState(false);
  const displayOrders = showAll ? orders : orders.slice(0, 14);

  return (
    <div className="overflow-visible">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="border-b border-border h-7">
            <TableHead className="py-1 text-xs">No</TableHead>
            <TableHead className="py-1 text-xs">Tarih</TableHead>
            <TableHead className="py-1 text-xs">Durum</TableHead>
            <TableHead className="py-1 text-xs">Tutar</TableHead>
            <TableHead className="text-right py-1 text-xs w-16">
              Detay
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-2">
                <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : orders && orders.length > 0 ? (
            displayOrders.map((orderItem) => {
              let formattedDate = "N/A";
              if (
                orderItem?.orderDate &&
                isValid(parseISO(orderItem.orderDate))
              ) {
                formattedDate = format(
                  parseISO(orderItem.orderDate),
                  "dd.MM.yy"
                );
              }

              // Get status info
              const status = orderItem?.orderStatus || "default";
              const statusInfo =
                orderStatusMappingAdmin[status] ||
                orderStatusMappingAdmin.default;

              return (
                <TableRow
                  key={orderItem._id}
                  className="border-b border-muted h-7"
                >
                  <TableCell className="font-mono text-xs py-1 truncate max-w-[70px]">
                    {orderItem._id.substring(orderItem._id.length - 8)}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    {formattedDate}
                  </TableCell>
                  <TableCell className="py-1">
                    <Badge
                      className={`p-0.5 px-1 text-[10px] justify-center min-w-[60px] ${statusInfo.color} ${statusInfo.textColor}`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium py-1 text-xs">
                    {orderItem.totalAmount?.toFixed(2) || 0}₺
                  </TableCell>
                  <TableCell className="text-right py-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-5 px-1 text-xs"
                      onClick={() => onViewDetailsClick(orderItem._id)}
                    >
                      Detay
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-xs py-2">
                Sipariş bulunamadı.
              </TableCell>
            </TableRow>
          )}
          {orders.length > 14 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-1">
                <Button
                  variant="link"
                  className="text-xs text-muted-foreground h-5 p-0"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll
                    ? "Daha Az Göster"
                    : `Tümünü Görüntüle (${orders.length})`}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
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
      })
    ).isRequired,
    onViewDetailsClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };
  const [showAll, setShowAll] = useState(false);
  const displayOrders = showAll ? orders : orders.slice(0, 14);

  // Define which statuses are considered "new" and need notification
  const newOrderStatuses = [
    "pending",
    "pending_payment",
    "confirmed",
    "failed",
  ];
  return (
    <div className="overflow-visible">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow className="border-b border-border h-7">
            <TableHead className="py-1 text-xs">No</TableHead>
            <TableHead className="py-1 text-xs">Alıcı</TableHead>
            <TableHead className="py-1 text-xs">Tarih</TableHead>
            <TableHead className="py-1 text-xs">Durum</TableHead>
            <TableHead className="py-1 text-xs">Tutar</TableHead>
            <TableHead className="text-right py-1 text-xs w-16">
              Detay
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-2">
                <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : orders && orders.length > 0 ? (
            displayOrders.map((orderItem) => {
              let formattedDate = "N/A";
              if (
                orderItem?.orderDate &&
                isValid(parseISO(orderItem.orderDate))
              ) {
                formattedDate = format(
                  parseISO(orderItem.orderDate),
                  "dd.MM.yy"
                );
              }

              // Get status info
              const status = orderItem?.orderStatus || "default";
              const statusInfo =
                orderStatusMappingAdmin[status] ||
                orderStatusMappingAdmin.default;

              // Check if this is a new order that needs attention
              const isNewOrder =
                newOrderStatuses.includes(status) || orderItem.isNew;

              const guestName =
                orderItem.guestInfo?.fullName ||
                orderItem.addressInfo?.fullName ||
                "Misafir";
              const guestEmail = orderItem.guestInfo?.email;

              // Get the last 8 characters of the order ID
              const shortOrderId = orderItem._id.substring(
                orderItem._id.length - 8
              );

              return (
                <TableRow
                  key={orderItem._id}
                  className="border-b border-muted h-7"
                >
                  <TableCell className="font-mono text-xs py-1">
                    <div className="flex items-center gap-1">
                      {isNewOrder && (
                        <Bell
                          className="h-3 w-3 text-blue-500 flex-shrink-0"
                          title="Yeni / İşlenmemiş Sipariş"
                        />
                      )}
                      {shortOrderId}
                    </div>
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    <div className="truncate max-w-[90px]">{guestName}</div>
                    {guestEmail && (
                      <div className="text-[10px] text-muted-foreground truncate max-w-[90px]">
                        {guestEmail}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-1 text-xs">
                    {formattedDate}
                  </TableCell>
                  <TableCell className="py-1">
                    <Badge
                      className={`p-0.5 px-1 text-[10px] justify-center min-w-[60px] ${statusInfo.color} ${statusInfo.textColor}`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium py-1 text-xs">
                    {orderItem.totalAmount?.toFixed(2) || 0}₺
                  </TableCell>
                  <TableCell className="text-right py-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-5 px-1 text-xs"
                      onClick={() => onViewDetailsClick(orderItem._id)}
                    >
                      Detay
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-xs py-2">
                Misafir siparişi bulunamadı.
              </TableCell>
            </TableRow>
          )}
          {orders.length > 14 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-1">
                <Button
                  variant="link"
                  className="text-xs text-muted-foreground h-5 p-0"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll
                    ? "Daha Az Göster"
                    : `Tümünü Görüntüle (${orders.length})`}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function AdminOrdersView() {
  const canView = useAdminPermission("orders");
  const canManage = useAdminPermission("orders", "manage");
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

  // Filter out guest users from registered users
  const filteredUserList = userList.filter(
    (user) =>
      !(
        user.userName?.toLowerCase().includes("misafir") ||
        user.userId === "GUEST_ORDERS_VIRTUAL_ID"
      )
  );

  // Calculate total orders with filtered user list
  const registeredUserOrdersCount = filteredUserList.reduce(
    (acc, user) => acc + (user.orderCount || 0),
    0
  );
  const guestOrdersCount = guestOrderList.length || 0;
  const totalOrdersCount = registeredUserOrdersCount + guestOrdersCount;

  useEffect(() => {
    if (canView) {
      dispatch(fetchUsersWithOrders());
      dispatch(fetchAllGuestOrdersForAdmin());
    }
  }, [dispatch, canView]);

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
  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-red-600 text-xs p-2 bg-red-50 rounded-md">hata</p>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Sipariş Yönetimi</h2>
        <Card className="p-2 shadow-sm">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5 text-blue-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Toplam</div>
                <div className="text-sm font-bold">{totalOrdersCount}</div>
              </div>
            </div>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-1.5">
              <UserCog className="h-3.5 w-3.5 text-indigo-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Kayıtlı</div>
                <div className="text-sm font-bold">
                  {registeredUserOrdersCount}
                </div>
              </div>
            </div>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-1.5">
              <UserMinus className="h-3.5 w-3.5 text-amber-600" />
              <div>
                <div className="text-[10px] text-muted-foreground">Misafir</div>
                <div className="text-sm font-bold">{guestOrdersCount}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Registered Users Side */}
        <Card className="shadow-sm md:col-span-3">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCog className="h-3.5 w-3.5" />
              Kayıtlı Kullanıcı Siparişleri
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-2">
            {selectedUserId ? (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={handleBackToUserList}
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                  <h3 className="text-xs font-medium">
                    {userList.find((u) => u.userId === selectedUserId)
                      ?.userName || selectedUserId}
                  </h3>
                </div>
                <RegisteredUserOrdersTable
                  orders={selectedUserOrders}
                  onViewDetailsClick={handleViewOrderDetails}
                  isLoading={isUserOrdersLoading}
                />
              </div>
            ) : (
              <UserListTable
                users={filteredUserList}
                onViewOrdersClick={handleViewUserOrders}
                isLoading={isUserListLoading}
              />
            )}
          </CardContent>
        </Card>

        {/* Guest Orders Side */}
        <Card className="shadow-sm md:col-span-3">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserMinus className="h-3.5 w-3.5" />
              Misafir Siparişleri
            </CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-2">
            <GuestOrdersTable
              orders={guestOrderList}
              onViewDetailsClick={handleViewOrderDetails}
              isLoading={isGuestOrdersLoading}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={!!selectedOrderIdForDetails}
        onOpenChange={(isOpen) => !isOpen && handleDetailsDialogClose()}
      >
        <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <ShoppingBag className="h-5 w-5" />
              Sipariş Detayları
              <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 py-0.5 px-2 rounded ml-2">
                {selectedOrderIdForDetails}
              </span>
            </DialogTitle>
          </DialogHeader>

          {isDetailsLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Sipariş detayları yükleniyor...
              </p>
            </div>
          ) : orderDetails ? (
            <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
              <AdminOrderDetailsView orderDetails={orderDetails} canManage={canManage} />
            </div>
          ) : (
            <div className="p-8 text-center text-red-500">
              <p>Sipariş detayları yüklenemedi.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Lütfen daha sonra tekrar deneyin veya sistem yöneticisiyle
                iletişime geçin.
              </p>
            </div>
          )}

          <DialogFooter className="px-6 py-3 border-t bg-gray-50 dark:bg-gray-900">
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

export default AdminOrdersView;
