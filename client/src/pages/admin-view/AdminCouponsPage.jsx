import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  clearError,
} from "@/store/admin/coupon-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Trash2,
  Edit,
  Plus,
  ToggleLeft,
  ToggleRight,
  Percent,
  TrendingUp,
  Calendar,
  Users,
  Eye,
  EyeOff,
  Image,
} from "lucide-react";
import useAdminPermission from "@/hooks/useAdminPermission";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Switch } from "@/components/ui/switch";
import EntityManager from "@/components/admin-view/EntityManager";

const initialFormData = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minPurchase: "",
  maxUses: "",
  expiryDate: "",
  description: "",
  imageUrl: "",
  showOnCampaignsPage: false,
};

function AdminCouponsPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { coupons, isLoading, error } = useSelector(
    (state) => state.adminCoupons
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);

  const canViewCoupons = useAdminPermission("coupons", "view");
  const canManage = useAdminPermission("coupons", "manage");

  useEffect(() => {
    if (canViewCoupons) {
      dispatch(fetchCoupons());
    }
  }, [dispatch, canViewCoupons]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Hata",
        description: error,
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canManage) {
      toast({
        title: "Yetki Hatası",
        description: "Bu işlem için yetkiniz yok.",
        variant: "destructive",
      });
      return;
    }

    let imageUrlToSend = formData.imageUrl;
    if (imageFile) {
      // Görseli yükle - mevcut product upload endpoint'ini kullan
      const uploadData = new FormData();
      uploadData.append("my_file", imageFile);
      try {
        const uploadRes = await fetch("/api/admin/products/upload-image", {
          method: "POST",
          body: uploadData,
          credentials: "include",
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.success) {
          imageUrlToSend = uploadJson.result.url;
        } else {
          throw new Error(uploadJson.message || "Resim yükleme başarısız");
        }
      } catch (uploadError) {
        toast({
          title: "Hata",
          description: "Resim yüklenirken hata oluştu: " + uploadError.message,
          variant: "destructive",
        });
        return;
      }
    }
    const couponData = {
      ...formData,
      imageUrl: imageUrlToSend,
      showOnCampaignsPage: !!formData.showOnCampaignsPage,
      discountValue: parseFloat(formData.discountValue),
      minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
      expiryDate: formData.expiryDate || null,
    };

    try {
      if (editingCoupon) {
        await dispatch(
          updateCoupon({ id: editingCoupon._id, couponData })
        ).unwrap();
        toast({ title: "Başarılı", description: "Kupon güncellendi." });
      } else {
        await dispatch(createCoupon(couponData)).unwrap();
        toast({ title: "Başarılı", description: "Kupon oluşturuldu." });
      }
      handleCloseModal();
    } catch (err) {
      // Error is handled by useEffect
    }
  };

  const handleEdit = (coupon) => {
    if (!canManage) {
      toast({
        title: "Yetki Hatası",
        description: "Bu işlem için yetkiniz yok.",
        variant: "destructive",
      });
      return;
    }

    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minPurchase: coupon.minPurchase?.toString() || "",
      maxUses: coupon.maxUses?.toString() || "",
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
      description: coupon.description || "",
      imageUrl: coupon.imageUrl || "",
      showOnCampaignsPage: coupon.showOnCampaignsPage || false,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!canManage) {
      toast({
        title: "Yetki Hatası",
        description: "Bu işlem için yetkiniz yok.",
        variant: "destructive",
      });
      return;
    }

    if (confirm("Bu kuponu silmek istediğinizden emin misiniz?")) {
      try {
        await dispatch(deleteCoupon(id)).unwrap();
        toast({ title: "Başarılı", description: "Kupon silindi." });
      } catch (err) {
        // Error is handled by useEffect
      }
    }
  };

  const handleToggleStatus = async (id) => {
    if (!canManage) {
      toast({
        title: "Yetki Hatası",
        description: "Bu işlem için yetkiniz yok.",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(toggleCouponStatus(id)).unwrap();
      toast({ title: "Başarılı", description: "Kupon durumu güncellendi." });
    } catch (err) {
      // Error is handled by useEffect
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
    setFormData(initialFormData);
    setImageFile(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Süresiz";
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  const formatDiscountValue = (type, value) => {
    return type === "percentage" ? `%${value}` : `${value}₺`;
  };

  if (!canViewCoupons) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kupon Yönetimi
          </h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <Percent className="w-4 h-4" />
            İndirim kuponlarınızı oluşturun ve yönetin
          </p>
        </div>
        {canManage && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEditingCoupon(null)}
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Yeni Kupon Oluştur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? "Kupon Düzenle" : "Yeni Kupon Oluştur"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Temel Bilgiler */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Temel Bilgiler
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="code"
                        className="text-sm font-medium text-gray-700"
                      >
                        Kupon Kodu *
                      </Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) =>
                          handleInputChange(
                            "code",
                            e.target.value.toUpperCase()
                          )
                        }
                        placeholder="INDIRIM10"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="discountType"
                        className="text-sm font-medium text-gray-700"
                      >
                        İndirim Türü *
                      </Label>
                      <Select
                        value={formData.discountType}
                        onValueChange={(value) =>
                          handleInputChange("discountType", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            <div className="flex items-center gap-2">
                              <Percent className="w-4 h-4" />
                              Yüzdelik (%)
                            </div>
                          </SelectItem>
                          <SelectItem value="fixed">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Sabit Tutar (₺)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="discountValue"
                        className="text-sm font-medium text-gray-700"
                      >
                        İndirim Değeri *{" "}
                        {formData.discountType === "percentage" ? "(%)" : "(₺)"}
                      </Label>
                      <Input
                        id="discountValue"
                        type="number"
                        min="0"
                        max={
                          formData.discountType === "percentage"
                            ? "100"
                            : undefined
                        }
                        step="0.01"
                        value={formData.discountValue}
                        onChange={(e) =>
                          handleInputChange("discountValue", e.target.value)
                        }
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="minPurchase"
                        className="text-sm font-medium text-gray-700"
                      >
                        Minimum Alışveriş Tutarı (₺)
                      </Label>
                      <Input
                        id="minPurchase"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.minPurchase}
                        onChange={(e) =>
                          handleInputChange("minPurchase", e.target.value)
                        }
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Kullanım Koşulları */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Kullanım Koşulları
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="maxUses"
                        className="text-sm font-medium text-gray-700"
                      >
                        Maksimum Kullanım Sayısı
                      </Label>
                      <Input
                        id="maxUses"
                        type="number"
                        min="1"
                        value={formData.maxUses}
                        onChange={(e) =>
                          handleInputChange("maxUses", e.target.value)
                        }
                        placeholder="Sınırsız"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="expiryDate"
                        className="text-sm font-medium text-gray-700"
                      >
                        Son Kullanım Tarihi
                      </Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Açıklama ve Görsel */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Açıklama ve Görsel
                  </h3>
                  <div>
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Açıklama
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Kupon açıklaması..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      <Image className="w-4 h-4 inline mr-2" />
                      Kupon Görseli
                    </Label>
                    <ProductImageUpload
                      imageFile={imageFile}
                      setImageFile={setImageFile}
                      isEditMode={false}
                      id="coupon-image-upload"
                    />
                    {formData.imageUrl && !imageFile && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">
                          Mevcut Görsel:
                        </p>
                        <img
                          src={formData.imageUrl}
                          alt="Mevcut Görsel"
                          className="h-20 w-auto rounded-lg border shadow-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch
                        id="showOnCampaignsPage"
                        checked={formData.showOnCampaignsPage}
                        onCheckedChange={(checked) =>
                          handleInputChange("showOnCampaignsPage", checked)
                        }
                      />
                      <div>
                        <Label
                          htmlFor="showOnCampaignsPage"
                          className="text-sm font-medium text-gray-700"
                        >
                          Kampanyalar Sayfasında Göster
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">
                          Bu kupon müşterilerin görebileceği kampanyalar
                          sayfasında görüntülenecek
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="px-6"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-6"
                  >
                    {isLoading ? (
                      <>
                        {editingCoupon
                          ? "Güncelleniyor..."
                          : "Oluşturuluyor..."}
                      </>
                    ) : (
                      <>{editingCoupon ? "Güncelle" : "Oluştur"}</>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Percent className="w-4 h-4 text-white" />
                </div>
                Kuponlarınız
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                {coupons.length > 0 ? (
                  <>
                    Toplam{" "}
                    <span className="font-semibold text-blue-600">
                      {coupons.length}
                    </span>{" "}
                    kupon bulunuyor
                    {coupons.filter((c) => c.isActive).length > 0 && (
                      <>
                        {" "}
                        •{" "}
                        <span className="font-semibold text-green-600">
                          {coupons.filter((c) => c.isActive).length}
                        </span>{" "}
                        aktif
                      </>
                    )}
                  </>
                ) : (
                  "Henüz kupon bulunmuyor"
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border shadow-sm p-6"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Percent className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz kupon yok
              </h3>
              <p className="text-gray-500 mb-6">
                İlk kuponunuzu oluşturarak başlayın
              </p>
              {canManage && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Kuponunuzu Oluşturun
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className={`bg-white rounded-xl border-2 ${
                    coupon.isActive
                      ? "border-green-200"
                      : "border-gray-200"
                  }`}
                >
                  {/* Kupon Header */}
                  <div
                    className={`p-4 rounded-t-xl ${
                      coupon.isActive
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100"
                        : "bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {coupon.imageUrl && (
                          <img
                            src={coupon.imageUrl}
                            alt={coupon.code}
                            className="w-8 h-8 rounded-lg object-cover border"
                          />
                        )}
                        <span className="font-bold text-xl font-mono tracking-wider text-gray-800">
                          {coupon.code}
                        </span>
                      </div>
                      <Badge
                        variant={coupon.isActive ? "default" : "secondary"}
                        className={`${
                          coupon.isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {coupon.isActive ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Pasif
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* İndirim Değeri */}
                    <div className="text-center py-3">
                      <div
                        className={`text-3xl font-bold ${
                          coupon.isActive ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {formatDiscountValue(
                          coupon.discountType,
                          coupon.discountValue
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {coupon.discountType === "percentage"
                          ? "İndirim"
                          : "TL İndirim"}
                      </div>
                    </div>
                  </div>

                  {/* Kupon Body */}
                  <div className="p-4 space-y-3">
                    {/* Açıklama */}
                    {coupon.description && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {coupon.description}
                      </p>
                    )}

                    {/* Detaylar */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Min. Alışveriş:
                        </span>
                        <span className="font-medium">
                          {coupon.minPurchase > 0
                            ? `${coupon.minPurchase}₺`
                            : "Yok"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Kullanım:
                        </span>
                        <span className="font-medium">
                          {coupon.usesCount} / {coupon.maxUses || "∞"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Son Tarih:
                        </span>
                        <span
                          className={`font-medium ${
                            coupon.expiryDate &&
                            new Date(coupon.expiryDate) < new Date()
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {formatDate(coupon.expiryDate)}
                        </span>
                      </div>

                      {coupon.showOnCampaignsPage && (
                        <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-center">
                          <span className="text-xs font-medium flex items-center justify-center gap-1">
                            <Eye className="w-3 h-3" />
                            Kampanyalar sayfasında görünür
                          </span>
                        </div>
                      )}
                    </div>

                    {/* İşlemler */}
                    {canManage && (
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(coupon._id)}
                          className="flex-1"
                        >
                          {coupon.isActive ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-1" />
                              Gizle
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-1" />
                              Aktif Et
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(coupon)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(coupon._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminCouponsPage;
