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

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Sipariş ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Sipariş Tarihi</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Sipariş Tutarı</p>
            <Label>{orderDetails?.totalAmount} TL</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Ödeme Yöntemi</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Ödeme Durumu</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Sipariş Durumu</p>
            <Label>
              {/* <Badge
                variant={
                  orderDetails.orderStatus === "confirmed"
                    ? "default"
                    : orderDetails.orderStatus === "pending"
                    ? "secondary"
                    : orderDetails.orderStatus === "failed" ||
                      orderDetails.orderStatus === "rejected"
                    ? "destructive"
                    : "outline"
                }
                className="text-xs"
              >
                {orderDetails?.orderStatus}
              </Badge> */}
              {/* <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "inProcess" ||
                      orderDetails?.orderStatus === "inShipping"
                    ? "bg-orange-300" // Hazırlanıyor veya Kargoda -> Turuncu
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge> */}
              <Badge
                className={`p-1 px-3 w-24 justify-center ${
                  statusMapping[orderDetails?.orderStatus]?.color ||
                  statusMapping.default.color
                }`}
              >
                {statusMapping[orderDetails?.orderStatus]?.label ||
                  statusMapping.default.label}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Sipariş Detayı</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex items-center justify-between">
                      <span>Başlık: {item.title}</span>
                      <span>Adet: {item.quantity}</span>
                      <span>Fiyat: {item.price} TL</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Teslimat Adresi</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

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
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
