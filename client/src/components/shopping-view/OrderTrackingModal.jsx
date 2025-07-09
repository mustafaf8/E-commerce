import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Loader2,
  LogIn,
  Search,
  PackageCheck,
  Truck,
  PackageX,
} from "lucide-react";
import PropTypes from "prop-types";
import { format, parseISO, isValid } from "date-fns";
import { orderStatusMappingUser } from "@/config";
import React from "react";
import api from "@/api/axiosInstance";

const statusIcons = {
  pending_payment: <AlertCircle className="w-5 h-5 mr-2" />,
  pending: <AlertCircle className="w-5 h-5 mr-2" />,
  confirmed: <PackageCheck className="w-5 h-5 mr-2" />,
  inProcess: <PackageCheck className="w-5 h-5 mr-2" />,
  inShipping: <Truck className="w-5 h-5 mr-2" />,
  delivered: <PackageCheck className="w-5 h-5 mr-2" />,
  cancelled: <PackageX className="w-5 h-5 mr-2" />,
  failed: <PackageX className="w-5 h-5 mr-2" />,
  rejected: <PackageX className="w-5 h-5 mr-2" />,
  default: <AlertCircle className="w-5 h-5 mr-2" />,
};

const OrderTrackingModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [orderIdInput, setOrderIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      setSearchError("Lütfen Sipariş Numaranızı giriniz.");
      setSearchResult(null);
      return;
    }
    setIsLoading(true);
    setSearchError("");
    setSearchResult(null);

    try {
      const response = await api.get(
        `/shop/order/track/${orderIdInput.trim()}`
      );
      if (response.data.success && response.data.data) {
        setSearchResult(response.data.data);
      } else {
        setSearchError(response.data.message || "Sipariş bulunamadı.");
        setSearchResult(null);
      }
    } catch (error) {
      setSearchError(
        error.response?.data?.message ||
          "Sipariş sorgulanırken bir hata oluştu."
      );
      setSearchResult(null);
     // console.error("Sipariş sorgulama hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/auth/login");
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString || !isValid(parseISO(dateString))) return "N/A";
    return format(parseISO(dateString), "dd.MM.yyyy HH:mm");
  };

  useEffect(() => {
    if (!isOpen) {
      setOrderIdInput("");
      setSearchResult(null);
      setSearchError("");
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sipariş Takibi</DialogTitle>
          <DialogDescription>
            Siparişinizin durumunu sorgulayın veya siparişlerinizi görmek için
            giriş yapın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleTrackOrder} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="orderId">Sipariş Numaranız</Label>
            <Input
              id="orderId"
              placeholder="Sipariş numaranızı girin (örn: 6e3b16a08t72z4f03e52c743)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              required
            />
          </div>
          {searchError && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" /> {searchError}
            </p>
          )}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Siparişimi Sorgula
          </Button>
        </form>

        {/* searchResult null değilse ve bir obje ise render et */}
        {searchResult && typeof searchResult === "object" && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-2">Sipariş Durumu</h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Sipariş No:</strong> {searchResult._id || "N/A"}
              </p>
              <p>
                <strong>Tarih:</strong> {formatDate(searchResult.orderDate)}
              </p>
              {/* Durum gösterimi standardize edildi */}
              {(() => {
                const statusKey = searchResult.orderStatus;
                const statusInfo =
                  (statusKey && orderStatusMappingUser[statusKey]) ||
                  orderStatusMappingUser.default;
                const iconElement =
                  (statusKey && statusIcons[statusKey]) || statusIcons.default;

                return (
                  <p className="flex items-center">
                    <strong>Durum:</strong>
                    <span className={`ml-2 font-medium flex items-center`}>
                      {React.cloneElement(iconElement, {
                        className: `w-5 h-5 mr-2`,
                      })}
                      {statusInfo.label || orderStatusMappingUser.default.label}
                    </span>
                  </p>
                );
              })()}

              <p>
                <strong>Toplam Tutar:</strong>{" "}
                {searchResult.totalAmount?.toFixed(2) || "N/A"} TL
              </p>
              {searchResult.guestInfo?.fullName && (
                <p>
                  <strong>Alıcı:</strong>{" "}
                  {searchResult.guestInfo.fullName.substring(0, 1) +
                    "****" +
                    searchResult.guestInfo.fullName.substring(
                      searchResult.guestInfo.fullName.lastIndexOf(" ") - 1,
                      searchResult.guestInfo.fullName.lastIndexOf(" ")
                    ) +
                    "****"}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">veya</p>
          <Button
            variant="outline"
            onClick={handleLoginRedirect}
            className="w-full"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Giriş Yaparak Tüm Siparişlerinizi Görün
          </Button>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Kapat
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

OrderTrackingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderTrackingModal;
