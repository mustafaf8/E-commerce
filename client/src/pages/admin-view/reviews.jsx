import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Trash2, Star, MessageSquare, Filter, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  fetchAllReviewsAdmin,
  updateReviewStatusAdmin,
  deleteReviewAdmin,
  setCurrentFilter,
  clearError
} from "@/store/admin/review-slice";
import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import useAdminPermission from "@/hooks/useAdminPermission";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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

  const statusConfig = {
    pending: { 
      variant: "secondary", 
      text: "Onay Bekliyor",
      icon: <AlertCircle className="h-4 w-4 mr-1" />,
      badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300"
    },
    approved: { 
      variant: "default", 
      text: "Onaylandı",
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
      badgeClass: "bg-green-100 text-green-800 border-green-300"
    },
    rejected: { 
      variant: "destructive", 
      text: "Reddedildi",
      icon: <XCircle className="h-4 w-4 mr-1" />,
      badgeClass: "bg-red-100 text-red-800 border-red-300"
    },
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge 
        variant="outline" 
        className={`${config.badgeClass} flex items-center`}
      >
        {config.icon}
        {config.text}
      </Badge>
    );
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
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          Yorum Yönetimi
        </h1>
        <p className="text-gray-500 mt-2">
          Ürün yorumlarını yönetin ve moderasyon yapın
        </p>
      </div>

      {/* Filtre Butonları */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant={currentFilter === "all" ? "default" : "outline"}
          onClick={() => handleFilterChange("all")}
          className="flex items-center gap-1"
          aria-label="Tümü"
        >
          <Filter className="h-4 w-4" />
          Tümü
        </Button>
        <Button
          variant={currentFilter === "pending" ? "default" : "outline"}
          onClick={() => handleFilterChange("pending")}
          className="flex items-center gap-1"
          aria-label="Onay Bekliyor"
        >
          {statusConfig.pending.icon}
          Onay Bekleyenler
        </Button>
        <Button
          variant={currentFilter === "approved" ? "default" : "outline"}
          onClick={() => handleFilterChange("approved")}
          className="flex items-center gap-1"
          aria-label="Onaylandı"
        >
          {statusConfig.approved.icon}
          Onaylananlar
        </Button>
        <Button
          variant={currentFilter === "rejected" ? "default" : "outline"}
          onClick={() => handleFilterChange("rejected")}
          className="flex items-center gap-1"
          aria-label="Reddedildi"
        >
          {statusConfig.rejected.icon}
          Reddedilenler
        </Button>
      </div>

      {/* Yorumlar Tablosu */}
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> 
              Yorumlar
            </CardTitle>
            <CardDescription>
              {reviews.length} yorum listeleniyor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 font-medium">Henüz yorum bulunmuyor</p>
                <p className="text-gray-400 text-sm mt-1">Seçilen filtreye uygun yorum yok</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
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
                    <div className="font-medium text-gray-900">{review.productId?.title || "Ürün bulunamadı"}</div>
                    <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString("tr-TR")}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{review.userId?.userName || review.userName || "Kullanıcı bulunamadı"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {renderStars(review.reviewValue)}
                      <span className="text-xs text-gray-500">{review.reviewValue}/5</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div title={review.reviewMessage} className="text-sm text-gray-700">
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
                              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:border-green-300 transition-colors"
                              title="Onayla"
                              onClick={() => handleStatusUpdate(review._id, "approved")}
                              aria-label="Onayla"
                            >
                              <Check size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                              title="Reddet"
                              onClick={() => handleStatusUpdate(review._id, "rejected")}
                              aria-label="Reddet"
                            >
                              <X size={14} />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                          title="Sil"
                          onClick={() => handleDeleteReview(review._id)}
                          aria-label="Sil"
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
              </div>
            )}
          </CardContent>
        </Card>
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