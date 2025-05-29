import { useState } from "react";
import CommonForm from "../common/form";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import PropTypes from "prop-types";
import { Package, CreditCard, MapPin, User, ShoppingCart } from "lucide-react";
import { Card } from "../ui/card";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
          variant: "info",
        });
      }
    });
  }

  const statusMapping = {
    pending: { label: "Beklemede", color: "bg-yellow-400 text-yellow-800" },
    pending_payment: {
      label: "Ödeme Bekleniyor",
      color: "bg-amber-500 text-amber-800",
    },
    inProcess: {
      label: "Hazırlanıyor",
      color: "bg-orange-500 text-orange-100",
    },
    inShipping: { label: "Kargoda", color: "bg-teal-500 text-teal-100" },
    delivered: { label: "Teslim Edildi", color: "bg-green-600 text-green-100" },
    rejected: { label: "Reddedildi", color: "bg-red-600 text-red-100" },
    confirmed: { label: "Onaylandı", color: "bg-blue-500 text-blue-100" },
    cancelled: { label: "İptal Edildi", color: "bg-slate-500 text-slate-100" },
    default: { label: "Bilinmiyor", color: "bg-gray-700 text-gray-100" },
  };

  const isGuest = orderDetails?.isGuestOrder;
  const recipientName = isGuest
    ? orderDetails?.guestInfo?.fullName || orderDetails?.addressInfo?.fullName
    : orderDetails?.userId?.userName;
  const recipientEmail = isGuest
    ? orderDetails?.guestInfo?.email
    : orderDetails?.userId?.email;

  // Get current status information
  const currentStatus = orderDetails?.orderStatus || "default";
  const statusInfo = statusMapping[currentStatus] || statusMapping.default;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <Badge className={`px-3 py-1 ${statusInfo.color}`}>
          {statusInfo.label}
        </Badge>

        <div className="text-right">
          <div className="text-sm text-muted-foreground">Toplam Tutar</div>
          <div className="text-2xl font-bold">
            {orderDetails?.totalAmount?.toFixed(2) || 0}₺
          </div>
        </div>
      </div>

      {/* Sipariş Bilgileri */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Sipariş Bilgileri</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Sipariş Tarihi</div>
            <div className="font-medium">
              {orderDetails?.orderDate
                ? new Date(orderDetails.orderDate).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground">Sipariş No</div>
            <div className="font-mono text-xs break-all">
              {orderDetails?._id}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground">Ödeme Yöntemi</div>
            <div className="font-medium capitalize flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5" />
              {orderDetails?.paymentMethod?.replace("_", " ") ||
                "Belirtilmemiş"}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground">Ödeme Durumu</div>
            <div className="font-medium capitalize">
              {orderDetails?.paymentStatus || "Bilinmiyor"}
            </div>
          </div>
        </div>
      </Card>

      {/* Alıcı Bilgileri */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Alıcı Bilgileri</h3>
        </div>

        <div className="grid gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">Alıcı</div>
            <div className="font-medium">{recipientName || "N/A"}</div>
          </div>

          {recipientEmail && (
            <div>
              <div className="text-muted-foreground">E-posta</div>
              <div className="font-medium">{recipientEmail}</div>
            </div>
          )}

          <div>
            <div className="text-muted-foreground">Hesap Türü</div>
            <div className="font-medium">
              {isGuest ? "Misafir" : "Kayıtlı Kullanıcı"}
            </div>
          </div>
        </div>
      </Card>

      {/* Teslimat Adresi */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Teslimat Adresi</h3>
        </div>

        {orderDetails?.addressInfo ? (
          <div className="grid gap-2 text-sm">
            <div>
              <div className="text-muted-foreground">Alıcı</div>
              <div className="font-medium">
                {orderDetails.addressInfo.fullName || recipientName || "N/A"}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground">Adres</div>
              <div className="font-medium">
                {orderDetails.addressInfo.address}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-muted-foreground">Şehir</div>
                <div className="font-medium">
                  {orderDetails.addressInfo.city}
                </div>
              </div>

              <div>
                <div className="text-muted-foreground">Posta Kodu</div>
                <div className="font-medium">
                  {orderDetails.addressInfo.pincode}
                </div>
              </div>
            </div>

            <div>
              <div className="text-muted-foreground">Telefon</div>
              <div className="font-medium">
                {orderDetails.addressInfo.phone}
              </div>
            </div>

            {orderDetails.addressInfo.notes && (
              <div>
                <div className="text-muted-foreground">Not</div>
                <div className="font-medium italic">
                  {orderDetails.addressInfo.notes}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Adres bilgisi bulunamadı.
          </div>
        )}
      </Card>

      {/* Sipariş Öğeleri */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Sipariş Öğeleri</h3>
        </div>

        {orderDetails?.cartItems && orderDetails.cartItems.length > 0 ? (
          <div className="space-y-3">
            {orderDetails.cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="grid gap-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Birim: {item.price}₺ × {item.quantity}
                  </div>
                </div>
                <div className="font-semibold text-right">
                  {(item.price * item.quantity).toFixed(2)}₺
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-2 border-t">
              <div className="font-semibold">Toplam</div>
              <div className="font-bold text-right">
                {orderDetails?.totalAmount?.toFixed(2) || 0}₺
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Ürün bilgisi bulunamadı.
          </div>
        )}
      </Card>

      {/* Durum Güncelleme */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Sipariş Durumunu Güncelle</h3>
        </div>

        <CommonForm
          formControls={[
            {
              label: "Sipariş Durumu",
              name: "status",
              componentType: "select",
              options: [
                { id: "pending", label: "Beklemede" },
                { id: "confirmed", label: "Onaylandı" },
                { id: "inProcess", label: "Hazırlanıyor" },
                { id: "inShipping", label: "Kargoda" },
                { id: "delivered", label: "Teslim Edildi" },
                { id: "rejected", label: "Reddedildi" },
                { id: "cancelled", label: "İptal Edildi" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText={"Güncelle"}
          onSubmit={handleUpdateStatus}
        />
      </Card>
    </div>
  );
}

AdminOrderDetailsView.propTypes = {
  orderDetails: PropTypes.shape({
    _id: PropTypes.string,
    orderDate: PropTypes.string,
    totalAmount: PropTypes.number,
    paymentMethod: PropTypes.string,
    paymentStatus: PropTypes.string,
    orderStatus: PropTypes.string,
    isGuestOrder: PropTypes.bool,
    guestInfo: PropTypes.shape({
      fullName: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
    }),
    addressInfo: PropTypes.shape({
      fullName: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      pincode: PropTypes.string,
      phone: PropTypes.string,
      notes: PropTypes.string,
    }),
    userId: PropTypes.shape({
      userName: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
    }),
    cartItems: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string,
        title: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
      })
    ),
  }).isRequired,
};

export default AdminOrderDetailsView;
