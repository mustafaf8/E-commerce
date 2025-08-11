import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
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
import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import { useToast } from "@/components/ui/use-toast";

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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { toast } = useToast();

  const cancellableStatuses = ["pending", "pending_payment", "confirmed"];

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/auth/login");
    onClose();
  };

  const handleGuestCancel = async () => {
    if (!searchResult?._id) return;
    try {
      const resp = await api.put(
        `/shop/order/guest-cancel/${searchResult._id}`
      );
      if (resp.data?.success) {
        setSearchResult(resp.data.data);
        toast({
          title: "Başarılı",
          description: "Siparişiniz başarıyla iptal edildi.",
          variant: "success",
        });
      } else {
        toast({
          title: "Hata",
          description: resp.data?.message || "Sipariş iptal edilemedi.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Hata",
        description: err.response?.data?.message || "Sipariş iptal edilemedi.",
        variant: "destructive",
      });
    } finally {
      setShowCancelConfirm(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || !isValid(parseISO(dateString))) return "N/A";
    return format(parseISO(dateString), "dd.MM.yyyy HH:mm");
  };

  const formatOrderId = (orderId) => {
    if (!orderId) return "N/A";
    if (orderId.length > 12) {
      return `${orderId.substring(0, 8)}...${orderId.substring(
        orderId.length - 4
      )}`;
    }
    return orderId;
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
      <DialogContent className="w-[95vw] max-w-md sm:max-w-[500px]">
        <DialogHeader className="space-y-1 pb-2">
          <DialogTitle className="text-base sm:text-lg text-center">
            Sipariş Takibi
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-center">
            Siparişinizin durumunu sorgulayın veya siparişlerinizi görmek için
            giriş yapın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleTrackOrder} className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Input
              id="orderId"
              placeholder="Sipariş numaranızı girin"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              required
              className="text-xs sm:text-sm h-9"
            />
          </div>
          {searchError && (
            <p className="text-xs text-red-600 flex items-start">
              <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
              <span className="break-words">{searchError}</span>
            </p>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full text-xs sm:text-sm h-9"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin mr-2" />
            ) : (
              <Search className="h-3 w-3 mr-2" />
            )}
            Siparişimi Sorgula
          </Button>
        </form>

        {/* searchResult null değilse ve bir obje ise render et */}
        {searchResult && typeof searchResult === "object" && (
          <div className="mt-3 p-2.5 sm:p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm sm:text-base font-semibold mb-2">
              Sipariş Durumu
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="break-words">
                <strong>Sipariş No:</strong>{" "}
                <span className="font-mono text-xs">
                  <span className="sm:hidden">
                    {formatOrderId(searchResult._id || "N/A")}
                  </span>
                  <span className="hidden sm:inline">
                    {searchResult._id || "N/A"}
                  </span>
                </span>
              </div>
              <div>
                <strong>Tarih:</strong> {formatDate(searchResult.orderDate)}
              </div>
              {/* Durum gösterimi standardize edildi */}
              {(() => {
                const statusKey = searchResult.orderStatus;
                const statusInfo =
                  (statusKey && orderStatusMappingUser[statusKey]) ||
                  orderStatusMappingUser.default;
                const iconElement =
                  (statusKey && statusIcons[statusKey]) || statusIcons.default;

                return (
                  <div className="flex items-start sm:items-center">
                    <strong className="mr-2">Durum:</strong>
                    <span className={`font-medium flex items-center`}>
                      {React.cloneElement(iconElement, {
                        className: `w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0`,
                      })}
                      <span className="break-words text-xs">
                        {statusInfo.label ||
                          orderStatusMappingUser.default.label}
                      </span>
                    </span>
                  </div>
                );
              })()}

              <div>
                <strong>Toplam Tutar:</strong>{" "}
                <span className="whitespace-nowrap font-semibold text-green-600">
                  {formatPrice(searchResult.totalAmount || 0)} TL
                </span>
              </div>
              {searchResult.guestInfo?.fullName && (
                <div className="break-words">
                  <strong>Alıcı:</strong>{" "}
                  {searchResult.guestInfo.fullName.substring(0, 1) +
                    "****" +
                    searchResult.guestInfo.fullName.substring(
                      searchResult.guestInfo.fullName.lastIndexOf(" ") - 1,
                      searchResult.guestInfo.fullName.lastIndexOf(" ")
                    ) +
                    "****"}
                </div>
              )}
            </div>
          </div>
        )}

        {/* İptal butonu */}
        {searchResult &&
          cancellableStatuses.includes(searchResult.orderStatus) && (
            <div className="mt-3">
              <Button
                variant="destructive"
                className="w-full text-xs sm:text-sm h-9"
                onClick={() => setShowCancelConfirm(true)}
              >
                Siparişi İptal Et
              </Button>
            </div>
          )}

        <ConfirmationModal
          isOpen={showCancelConfirm}
          message="Bu siparişi iptal etmek istediğinizden emin misiniz?"
          onConfirm={handleGuestCancel}
          onCancel={() => setShowCancelConfirm(false)}
        />

        <div className="mt-0 text-center space-y-0">
          <p className="text-xs text-muted-foreground mb-2">veya</p>
          <Button
            variant="outline"
            onClick={handleLoginRedirect}
            className="w-full text-xs sm:text-sm h-9"
          >
            <LogIn className="h-3 w-3 mr-2" />
            <span className="break-words">
              Giriş Yaparak Tüm Siparişlerinizi Görün
            </span>
          </Button>
        </div>
        <DialogFooter className="mt-3 pt-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="w-full text-xs sm:text-sm h-9"
            >
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
