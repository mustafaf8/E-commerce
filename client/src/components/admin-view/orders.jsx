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
  fetchPendingFailedOrders,
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
  AlertTriangle,
  Package,
  Calendar,
  DollarSign,
  Eye,
  Users,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import PropTypes from "prop-types";
import { orderStatusMappingAdmin } from "@/config";
import useAdminPermission from "@/hooks/useAdminPermission";
import { Skeleton } from "../ui/skeleton";

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
  
  const filteredUsers = users.filter(
    (user) =>
      !(
        user.userName?.toLowerCase().includes("misafir") ||
        user.userId === "GUEST_ORDERS_VIRTUAL_ID"
      )
  );

  const [showAll, setShowAll] = useState(false);
  const displayUsers = showAll ? filteredUsers : filteredUsers.slice(0, 8);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 font-medium">Siparişi olan kullanıcı bulunamadı</p>
        <p className="text-gray-400 text-sm mt-1">Henüz kayıtlı kullanıcı siparişi yok</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayUsers.map((user) => (
        <div
          key={user.userId}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => onViewOrdersClick(user.userId)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {user.hasNewOrder && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Bell className="h-2 w-2 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{user.userName || "N/A"}</p>
              <p className="text-xs text-gray-500">{user.email || user.phoneNumber || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user.orderCount} sipariş</p>
              <p className="text-xs text-gray-500">
                {user.lastOrderDate && isValid(parseISO(user.lastOrderDate))
                  ? format(parseISO(user.lastOrderDate), "dd.MM.yy")
                  : "N/A"}
              </p>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      {filteredUsers.length > 8 && (
        <div className="text-center pt-2">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Daha Az Göster" : `Tümünü Görüntüle (${filteredUsers.length})`}
          </Button>
        </div>
      )}
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
  const displayOrders = showAll ? orders : orders.slice(0, 8);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-16" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 font-medium">Sipariş bulunamadı</p>
        <p className="text-gray-400 text-sm mt-1">Bu kullanıcının henüz siparişi yok</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayOrders.map((orderItem) => {
        let formattedDate = "N/A";
        if (orderItem?.orderDate && isValid(parseISO(orderItem.orderDate))) {
          formattedDate = format(parseISO(orderItem.orderDate), "dd.MM.yy");
        }

        const status = orderItem?.orderStatus || "default";
        const statusInfo = orderStatusMappingAdmin[status] || orderStatusMappingAdmin.default;

        return (
          <div
            key={orderItem._id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onViewDetailsClick(orderItem._id)}
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-16 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs font-mono">
                  {orderItem._id.substring(orderItem._id.length - 8)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{formattedDate}</p>
                <p className="text-xs text-gray-500">Sipariş Tarihi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${statusInfo.color} ${statusInfo.textColor}`}>
                {statusInfo.label}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{orderItem.totalAmount?.toFixed(2) || 0}₺</p>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
      
      {orders.length > 8 && (
        <div className="text-center pt-2">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Daha Az Göster" : `Tümünü Görüntüle (${orders.length})`}
          </Button>
        </div>
      )}
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
  const displayOrders = showAll ? orders : orders.slice(0, 8);

  const newOrderStatuses = ["pending", "pending_payment", "confirmed", "failed"];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-16" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <UserMinus className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 font-medium">Misafir siparişi bulunamadı</p>
        <p className="text-gray-400 text-sm mt-1">Henüz misafir siparişi yok</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayOrders.map((orderItem) => {
        let formattedDate = "N/A";
        if (orderItem?.orderDate && isValid(parseISO(orderItem.orderDate))) {
          formattedDate = format(parseISO(orderItem.orderDate), "dd.MM.yy");
        }

        const status = orderItem?.orderStatus || "default";
        const statusInfo = orderStatusMappingAdmin[status] || orderStatusMappingAdmin.default;
        const isNewOrder = newOrderStatuses.includes(status) || orderItem.isNew;

        const guestName = orderItem.guestInfo?.fullName || orderItem.addressInfo?.fullName || "Misafir";
        const guestEmail = orderItem.guestInfo?.email;
        const shortOrderId = orderItem._id.substring(orderItem._id.length - 8);

        return (
          <div
            key={orderItem._id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onViewDetailsClick(orderItem._id)}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-8 w-16 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-mono">{shortOrderId}</span>
                </div>
                {isNewOrder && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bell className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{guestName}</p>
                {guestEmail && (
                  <p className="text-xs text-gray-500">{guestEmail}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">{formattedDate}</p>
                <p className="text-sm font-medium">{orderItem.totalAmount?.toFixed(2) || 0}₺</p>
              </div>
              <Badge className={`${statusInfo.color} ${statusInfo.textColor}`}>
                {statusInfo.label}
              </Badge>
              <Button variant="outline" size="sm" className="h-8">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
      
      {orders.length > 8 && (
        <div className="text-center pt-2">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Daha Az Göster" : `Tümünü Görüntüle (${orders.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}

function AdminOrdersView() {
  const canView = useAdminPermission("orders");
  const canManage = useAdminPermission("orders", "manage");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedOrderIdForDetails, setSelectedOrderIdForDetails] = useState(null);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

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
    pendingFailedOrders,
    isPendingFailedLoading,
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
        pendingFailedOrders: [],
        isPendingFailedLoading: false,
      }
  );

  const filteredUserList = userList.filter(
    (user) =>
      !(
        user.userName?.toLowerCase().includes("misafir") ||
        user.userId === "GUEST_ORDERS_VIRTUAL_ID"
      )
  );

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

  useEffect(() => {
    if (isPendingModalOpen) {
      dispatch(fetchPendingFailedOrders());
    }
  }, [isPendingModalOpen, dispatch]);

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
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
              <p className="text-gray-500">Tüm siparişleri görüntüleyin ve yönetin</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsPendingModalOpen(true)}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Sorunlu Ödemeler
            {pendingFailedOrders.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingFailedOrders.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-blue-900">{totalOrdersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium">Kayıtlı Kullanıcı</p>
                <p className="text-2xl font-bold text-indigo-900">{registeredUserOrdersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <UserMinus className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-amber-600 font-medium">Misafir Siparişi</p>
                <p className="text-2xl font-bold text-amber-900">{guestOrdersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registered Users Section */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-indigo-600" />
              Kayıtlı Kullanıcı Siparişleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUserId ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToUserList}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Geri Dön
                  </Button>
                  <h3 className="text-sm font-medium text-gray-600">
                    {userList.find((u) => u.userId === selectedUserId)?.userName || selectedUserId}
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

        {/* Guest Orders Section */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserMinus className="h-5 w-5 text-amber-600" />
              Misafir Siparişleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GuestOrdersTable
              orders={guestOrderList}
              onViewDetailsClick={handleViewOrderDetails}
              isLoading={isGuestOrdersLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
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

      {/* Pending and Failed Orders Dialog */}
      <Dialog
        open={isPendingModalOpen}
        onOpenChange={setIsPendingModalOpen}
      >
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Sorunlu Ödemeler
              {pendingFailedOrders.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingFailedOrders.length}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {isPendingFailedLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Sorunlu ödemeler yükleniyor...
              </p>
            </div>
          ) : pendingFailedOrders.length > 0 ? (
            <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Sipariş No</TableHead>
                    <TableHead className="text-xs">Tarih</TableHead>
                    <TableHead className="text-xs">Müşteri Bilgisi</TableHead>
                    <TableHead className="text-xs">Tutar</TableHead>
                    <TableHead className="text-xs">Durum</TableHead>
                    <TableHead className="text-xs">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingFailedOrders.map((order) => {
                    const orderDate = isValid(parseISO(order.orderDate))
                      ? format(parseISO(order.orderDate), "dd.MM.yyyy HH:mm")
                      : "Geçersiz tarih";

                    const customerInfo = order.isGuestOrder
                      ? `${order.guestInfo?.name || "Misafir"} - ${order.guestInfo?.email || order.guestInfo?.phoneNumber || "N/A"}`
                      : `${order.userId?.userName || "N/A"} - ${order.userId?.email || order.userId?.phoneNumber || "N/A"}`;

                    return (
                      <TableRow key={order._id}>
                        <TableCell className="text-xs font-mono">
                          {order._id}
                        </TableCell>
                        <TableCell className="text-xs">
                          {orderDate}
                        </TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">
                          {customerInfo}
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          ₺{order.totalAmount?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.orderStatus === "pending_payment"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {orderStatusMappingAdmin[order.orderStatus]?.label || order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrderIdForDetails(order._id);
                              dispatch(getOrderDetailsForAdmin(order._id));
                              setIsPendingModalOpen(false);
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            Detay
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-200 mb-4" />
              <p className="text-lg font-medium mb-2">Sorunlu Ödeme Yok</p>
              <p className="text-sm">
                Şu anda bekleyen veya başarısız ödeme bulunmuyor.
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

