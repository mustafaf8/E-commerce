import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import PropTypes from "prop-types";
import { Separator } from "../ui/separator";
import { format, parseISO, isValid } from "date-fns";
import { orderStatusMappingUser } from "@/config";
import { Card } from "../ui/card";
import { Package, MapPin, User, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { cancelOrder } from "@/store/shop/order-slice";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import ConfirmationModal from "@/components/admin-view/ConfirmationModal";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!orderDetails) {
    return <div>Sipariş detayı bulunamadı.</div>;
  }

  let formattedDate = "N/A";
  if (orderDetails.orderDate) {
    try {
      const parsedDate = parseISO(orderDetails.orderDate);
      if (isValid(parsedDate)) {
        formattedDate = format(parsedDate, "dd.MM.yyyy HH:mm");
      }
    } catch (e) {
    }
  }

  const isGuest = orderDetails.isGuestOrder;
  const currentStatusKey = orderDetails.orderStatus || "default";
  const statusInfo =
    orderStatusMappingUser[currentStatusKey] || orderStatusMappingUser.default;

  const recipientName = isGuest
    ? orderDetails.guestInfo?.fullName ||
      orderDetails.addressInfo?.fullName ||
      "Misafir Kullanıcı"
    : isAuthenticated && user
    ? user.userName
    : orderDetails.addressInfo?.fullName || "Kullanıcı Adı Yok";

  const recipientEmail = isGuest
    ? orderDetails.guestInfo?.email
    : isAuthenticated && user
    ? user.email
    : "E-posta Yok";

  const cancellableStatuses = ["pending", "pending_payment", "confirmed"];
  const canCancel = cancellableStatuses.includes(orderDetails.orderStatus);

  const handleCancelOrder = () => {
    dispatch(cancelOrder(orderDetails._id)).then(() => {
      setShowCancelConfirm(false);
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-full">
      {/* Üst Bilgi: Durum ve Toplam Tutar */}
      <div className="flex justify-between gap-3 bg-white p-4 rounded-lg shadow-sm max-md:flex-col">
        <Badge
          className={`w-fit px-3 py-1.5 text-sm ${statusInfo.color} ${statusInfo.textColor}`}
        >
          {statusInfo.label}
        </Badge>
        <div>
          <div className="text-sm text-muted-foreground">
            Toplam Tutar
          </div>
          <div className="text-lg font-bold whitespace-nowrap">
            {formatPrice(orderDetails.totalAmount || 0)} TL
          </div>
        </div>
      </div>

      {/* Sipariş Bilgileri */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">
            Sipariş Bilgileri
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1 ">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Sipariş No:</p>
            <p className="text-sm font-medium break-all">{orderDetails._id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Sipariş Tarihi:</p>
            <p className="text-sm font-medium">{formattedDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ödeme Yöntemi:</p>
            <p className="text-sm font-medium capitalize">
              {orderDetails.paymentMethod?.replace("_", " ") || "Belirtilmemiş"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ödeme Durumu:</p>
            <p className="text-sm font-medium capitalize">
              {orderDetails.paymentStatus || "Bilinmiyor"}
            </p>
          </div>
        </div>
      </div>

      {/* Alıcı Bilgileri */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">
            Alıcı Bilgileri
          </h3>
        </div>
        <div className=" grid grid-cols-2 gap-3 max-md:grid-cols-1">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ad Soyad:</p>
            <p className="text-sm font-medium">{recipientName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">E-posta:</p>
            <p className="text-sm font-medium break-all">{recipientEmail}</p>
          </div>
          {/* TC Kimlik No */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">TC Kimlik No:</p>
            <p className="text-sm font-medium">
              {isGuest 
                ? orderDetails.guestInfo?.tcKimlikNo || "Belirtilmemiş"
                : orderDetails.tcKimlikNo || "Belirtilmemiş"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Teslimat Adresi */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">
            Teslimat Adresi
          </h3>
        </div>
        {orderDetails.addressInfo ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {orderDetails.addressInfo.fullName || recipientName}
            </p>
            <p className="text-sm text-muted-foreground">
              {orderDetails.addressInfo.address}
            </p>
            <p className="text-sm text-muted-foreground">
              {orderDetails.addressInfo.city}
              {orderDetails.addressInfo.pincode
                ? `, ${orderDetails.addressInfo.pincode}`
                : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              Tel: {orderDetails.addressInfo.phone || "-"}
            </p>
            {orderDetails.addressInfo.notes && (
              <p className="text-sm text-muted-foreground italic mt-2 pt-2 border-t">
                Not: {orderDetails.addressInfo.notes}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Teslimat adresi bilgisi bulunamadı.
          </p>
        )}
      </div>

      {/* Sipariş Öğeleri */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">
            Sipariş Öğeleri
          </h3>
        </div>
        {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
          <div className="space-y-4">
            {orderDetails.cartItems.map((item, index) => (
              <div
                key={item.productId + "-" + index}
                className="flex flex-col border-b pb-3 last:border-0 last:pb-0"
              >
                <p className="text-sm font-medium mb-1" title={item.title}>
                  {item.title}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatPrice(parseFloat(item.price || 0))} TL x {item.quantity} adet
                  </p>
                  <p className="text-sm font-semibold whitespace-nowrap">
                    {formatPrice(parseFloat(item.price || 0) * item.quantity)} TL
                  </p>
                </div>
              </div>
            ))}
            
            {/* Kupon ve Toplam Bilgileri */}
            <div className="space-y-2 pt-3 border-t">
              {orderDetails.appliedCoupon && orderDetails.appliedCoupon.code && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <p>Ara Toplam:</p>
                    <p className="whitespace-nowrap">
                      {formatPrice(
                        (orderDetails.totalAmount || 0) +
                          (orderDetails.appliedCoupon.discountAmount || 0)
                      )}{" "}
                      TL
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600">
                    <p>
                      Kupon İndirimi ({orderDetails.appliedCoupon.code}):
                    </p>
                    <p className="whitespace-nowrap">
                      -
                      {formatPrice(
                        orderDetails.appliedCoupon.discountAmount || 0
                      )}{" "}
                      TL
                    </p>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center pt-2 border-t text-base font-semibold">
                <p>Genel Toplam:</p>
                <p className="whitespace-nowrap">
                  {formatPrice(orderDetails.totalAmount || 0)} TL
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sipariş içeriği bulunamadı.
          </p>
        )}
      </div>

      {canCancel && (
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-medium"
          onClick={() => setShowCancelConfirm(true)}
          aria-label="Siparişi İptal Et"
        >
          Siparişi İptal Et
        </button>
      )}

      <ConfirmationModal
        isOpen={showCancelConfirm}
        message="Bu siparişi iptal etmek istediğinize emin misiniz?"
        onConfirm={handleCancelOrder}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  );
}

ShoppingOrderDetailsView.propTypes = {
  orderDetails: PropTypes.shape({
    _id: PropTypes.string,
    orderDate: PropTypes.string,
    totalAmount: PropTypes.number,
    paymentMethod: PropTypes.string,
    paymentStatus: PropTypes.string,
    orderStatus: PropTypes.string,
    isGuestOrder: PropTypes.bool,
    addressInfo: PropTypes.object,
    cartItems: PropTypes.array,
    guestInfo: PropTypes.object,
    tcKimlikNo: PropTypes.string,
    appliedCoupon: PropTypes.shape({
      code: PropTypes.string,
      discountAmount: PropTypes.number,
    }),
  }),
};

export default ShoppingOrderDetailsView;
