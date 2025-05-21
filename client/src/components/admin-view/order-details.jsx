import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
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

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetails (Admin)");

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
    pending: { label: "Beklemede", color: "bg-yellow-400" },
    inProcess: { label: "Hazırlanıyor", color: "bg-orange-500" },
    inShipping: { label: "Kargoda", color: "bg-orange-500" },
    delivered: { label: "Teslim Edildi", color: "bg-green-600" },
    rejected: { label: "Reddedildi", color: "bg-red-600" },
    confirmed: { label: "Onaylandı", color: "bg-green-600" },
    default: { label: "Bilinmiyor", color: "bg-black" },
  };

  const isGuest = orderDetails?.isGuestOrder;
  const recipientEmail = isGuest
    ? orderDetails?.guestInfo?.email
    : orderDetails?.userId?.email;

  return (
    <div className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <div className="grid gap-6 ">
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Sipariş ID</p>
            <Label className="font-mono text-xs">{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Sipariş Tarihi</p>
            <Label>
              {orderDetails?.orderDate
                ? new Date(orderDetails.orderDate).toLocaleDateString("tr-TR")
                : "N/A"}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Sipariş Tutarı</p>
            <Label className="font-semibold">
              {orderDetails?.totalAmount?.toFixed(2) || 0} TL
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Ödeme Yöntemi</p>
            <Label className="capitalize">
              {orderDetails?.paymentMethod?.replace("_", " ") ||
                "Belirtilmemiş"}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Ödeme Durumu</p>
            <Label className="capitalize">
              {orderDetails?.paymentStatus || "Bilinmiyor"}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Sipariş Durumu</p>
            <Badge
              className={`py-1 px-3 text-xs justify-center min-w-[90px] ${
                // min-width eklendi
                statusMapping[orderDetails?.orderStatus]?.color ||
                statusMapping.default.color
              }`}
            >
              {statusMapping[orderDetails?.orderStatus]?.label ||
                statusMapping.default.label}
            </Badge>
          </div>
        </div>
        <Separator />
        <div className="grid gap-3">
          <h3 className="font-semibold text-base">Sipariş İçeriği</h3>{" "}
          <ul className="grid gap-2 text-sm">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item, index) => (
                <li
                  key={item.productId + "-" + index}
                  className="flex items-center justify-between border-b pb-1 last:border-b-0"
                >
                  <span className="flex-1 mr-2 truncate" title={item.title}>
                    {item.title}{" "}
                    <span className="text-muted-foreground">
                      (x{item.quantity})
                    </span>
                  </span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toFixed(2)} TL
                  </span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground text-center">
                Sipariş içeriği boş.
              </li>
            )}
          </ul>
        </div>
        <Separator />
        {/* Teslimat Adresi */}
        <div className="grid gap-2">
          <h3 className="font-semibold text-base">Teslimat Adresi</h3>
          {orderDetails?.addressInfo ? (
            <div className="grid gap-0.5 text-sm text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">Alıcı:</span>
                {user?.userName || "N/A"}
              </span>
              {isGuest && recipientEmail && (
                <span>
                  <span className="font-medium text-foreground">E-posta:</span>{" "}
                  {recipientEmail}
                </span>
              )}

              <span>
                <span className="font-medium text-foreground">Adres:</span>
                {orderDetails.addressInfo.address}
              </span>
              <span>
                <span className="font-medium text-foreground">Şehir:</span>
                {orderDetails.addressInfo.city}
              </span>
              <span>
                <span className="font-medium text-foreground">Posta Kodu:</span>
                {orderDetails.addressInfo.pincode}
              </span>
              <span>
                <span className="font-medium text-foreground">Telefon:</span>
                {orderDetails.addressInfo.phone}
              </span>
              {orderDetails.addressInfo.notes && (
                <span>
                  <span className="font-medium text-foreground">Not:</span>
                  {orderDetails.addressInfo.notes}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Adres bilgisi bulunamadı.
            </p>
          )}
        </div>
        <Separator />

        <div>
          <CommonForm
            formControls={[
              {
                label: "Sipariş Durumu",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Beklemede" },
                  { id: "inProcess", label: "Hazırlanıyor" },
                  { id: "inShipping", label: "Kargoda" },
                  { id: "delivered", label: "Teslim Edildi" },
                  { id: "rejected", label: "Reddedildi" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Sipariş Durumunu Güncelle"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
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
        price: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default AdminOrderDetailsView;
