import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Trash2, Star } from "lucide-react";
import {
  fetchAllReviewsAdmin,
  updateReviewStatusAdmin,
  deleteReviewAdmin,
  setCurrentFilter,
  clearError
} from "@/store/admin/review-slice";
import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import useAdminPermission from "@/hooks/useAdminPermission";

const ReviewsPage = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const canView = useAdminPermission('reviews');
  const canManage = useAdminPermission('reviews', 'manage');
  
  const { reviews, isLoading, error, currentFilter } = useSelector((state) => state.adminReviews);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    if (canView) {
      dispatch(fetchAllReviewsAdmin(currentFilter));
    }
  }, [dispatch, canView, currentFilter]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error,
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const handleFilterChange = (filter) => {
    dispatch(setCurrentFilter(filter));
  };

  const handleStatusUpdate = (reviewId, newStatus) => {
    dispatch(updateReviewStatusAdmin({ reviewId, status: newStatus }))
      .then((result) => {
        if (!result.error) {
          toast({
            title: "Başarılı",
            description: `Yorum ${newStatus === "approved" ? "onaylandı" : "reddedildi"}`,
            variant: "success",
          });
        }
      });
  };

  const handleDeleteReview = (reviewId) => {
    setConfirmModal({
      isOpen: true,
      message: "Bu yorumu silmek istediğinizden emin misiniz?",
      onConfirm: () => {
        dispatch(deleteReviewAdmin(reviewId))
          .then((result) => {
            if (!result.error) {
              toast({
                title: "Başarılı",
                description: "Yorum başarıyla silindi",
                variant: "success",
              });
            }
            setConfirmModal({ isOpen: false, message: "", onConfirm: null });
          });
      },
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", text: "Onay Bekliyor" },
      approved: { variant: "default", text: "Onaylandı" },
      rejected: { variant: "destructive", text: "Reddedildi" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={14}
            className={`${
              index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800">Yorum Yönetimi</h1>
        <p className="text-gray-500 mt-2">
          Ürün yorumlarını yönetin ve moderasyon yapın
        </p>
      </div>

      {/* Filtre Butonları */}
      <div className="mt-6 flex gap-2">
        <Button
          variant={currentFilter === "all" ? "default" : "outline"}
          onClick={() => handleFilterChange("all")}
        >
          Tümü
        </Button>
        <Button
          variant={currentFilter === "pending" ? "default" : "outline"}
          onClick={() => handleFilterChange("pending")}
        >
          Onay Bekleyenler
        </Button>
        <Button
          variant={currentFilter === "approved" ? "default" : "outline"}
          onClick={() => handleFilterChange("approved")}
        >
          Onaylananlar
        </Button>
        <Button
          variant={currentFilter === "rejected" ? "default" : "outline"}
          onClick={() => handleFilterChange("rejected")}
        >
          Reddedilenler
        </Button>
      </div>

      {/* Yorumlar Tablosu */}
      <div className="mt-6 bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Yorumlar yükleniyor...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Henüz yorum bulunmuyor.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün Adı</TableHead>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>Puan</TableHead>
                <TableHead>Yorum</TableHead>
                <TableHead>Durum</TableHead>
                {canManage && <TableHead>İşlemler</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell className="font-medium">
                    {review.productId?.title || "Ürün bulunamadı"}
                  </TableCell>
                  <TableCell>
                    {review.userId?.userName || review.userName || "Kullanıcı bulunamadı"}
                  </TableCell>
                  <TableCell>
                    {renderStars(review.reviewValue)}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div title={review.reviewMessage}>
                      {truncateText(review.reviewMessage)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(review.status)}
                  </TableCell>
                  {canManage && (
                    <TableCell>
                      <div className="flex gap-1">
                        {review.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                              onClick={() => handleStatusUpdate(review._id, "approved")}
                            >
                              <Check size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              onClick={() => handleStatusUpdate(review._id, "rejected")}
                            >
                              <X size={14} />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, message: "", onConfirm: null })}
      />
    </div>
  );
};

export default ReviewsPage; 