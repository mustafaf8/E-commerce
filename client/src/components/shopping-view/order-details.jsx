import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import PropTypes from "prop-types";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { format, parseISO, isValid } from "date-fns";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) {
    return <div></div>;
  }

  let formattedDate = "N/A";
  if (orderDetails.orderDate) {
    try {
      const parsedDate = parseISO(orderDetails.orderDate);
      if (isValid(parsedDate)) {
        formattedDate = format(parsedDate, "dd.MM.yyyy HH:mm");
      }
    } catch (e) {
      console.error("Detayda tarih formatlama hatası:", e);
    }
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

  return (
    <div className="grid gap-2 pt-2 pl-2 ">
      <div className="grid gap-2 text-sm">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Sipariş No</p>
          <Label>{orderDetails._id}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Sipariş Tarihi</p>
          {/* Formatlanmış tarihi kullan */}
          <Label>{formattedDate}</Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Toplam Tutar</p>
          <Label className="font-medium">
            {orderDetails.totalAmount?.toFixed(2) || 0} TL
          </Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Ödeme Yöntemi</p>
          <Label className="capitalize">
            {orderDetails.paymentMethod?.replace("_", " ") || "Belirtilmemiş"}
          </Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Ödeme Durumu</p>
          <Label className="capitalize">
            {orderDetails.paymentStatus || "Bilinmiyor"}
          </Label>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Sipariş Durumu</p>

          <Badge
            className={`p-1 px-3 w-24 justify-center ${
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
      {/* Ürünler */}
      <div className="grid gap-2">
        <h3 className="font-semibold">Ürünler</h3>
        <ul className="grid gap-2 text-sm">
          {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
            orderDetails.cartItems.map((item, index) => (
              <li
                key={item.productId + "-" + index}
                className="flex items-center justify-between"
              >
                <span className="text-muted-foreground">
                  {item.title} (x{item.quantity})
                </span>
                <span>
                  {(parseFloat(item.price || 0) * item.quantity).toFixed(2)} TL
                </span>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">Ürün bilgisi bulunamadı.</li>
          )}
        </ul>
        <Separator className="my-2" />
        <div className="flex items-center justify-between font-semibold">
          <span>Genel Toplam</span>
          <span>{orderDetails.totalAmount?.toFixed(2) || 0} TL</span>
        </div>
      </div>
      <Separator />
      {/* Teslimat Adresi */}
      <div className="grid gap-2">
        <h3 className="font-semibold">Teslimat Adresi</h3>
        <div className="grid gap-0.5 text-sm text-muted-foreground">
          <span>{user.userName}</span>
          <span>{orderDetails.addressInfo?.address || "-"}</span>
          <span>
            {orderDetails.addressInfo?.city || "-"}
            {orderDetails.addressInfo?.pincode
              ? `, ${orderDetails.addressInfo.pincode}`
              : ""}
          </span>
          <span>{orderDetails.addressInfo?.phone || "-"}</span>
          {orderDetails.addressInfo?.notes && (
            <span>Not: {orderDetails.addressInfo.notes}</span>
          )}
        </div>
      </div>
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
    cartItems: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string,
        title: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.string,
      })
    ),
    addressInfo: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      pincode: PropTypes.string,
      phone: PropTypes.string,
      notes: PropTypes.string,
    }),
  }),
};

export default ShoppingOrderDetailsView;
