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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Edit, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import useAdminPermission from "@/hooks/useAdminPermission";

const initialFormData = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minPurchase: "",
  maxUses: "",
  expiryDate: "",
  description: "",
};

function AdminCouponsPage() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { coupons, isLoading, error } = useSelector((state) => state.adminCoupons);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const canView = useAdminPermission('coupons');
  const canManage = useAdminPermission('coupons', 'manage');

  useEffect(() => {
    if (canView) {
      dispatch(fetchCoupons());
    }
  }, [dispatch, canView]);

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
    setFormData(prev => ({ ...prev, [field]: value }));
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

    const couponData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
      expiryDate: formData.expiryDate || null,
    };

    try {
      if (editingCoupon) {
        await dispatch(updateCoupon({ id: editingCoupon._id, couponData })).unwrap();
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
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : "",
      description: coupon.description || "",
    });
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
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Süresiz";
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  const formatDiscountValue = (type, value) => {
    return type === "percentage" ? `%${value}` : `${value}₺`;
  };

  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kupon Yönetimi</h1>
          <p className="text-muted-foreground">İndirim kuponlarını yönetin</p>
        </div>
        {canManage && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCoupon(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Kupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? "Kupon Düzenle" : "Yeni Kupon Oluştur"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="code">Kupon Kodu *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    placeholder="INDIRIM10"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discountType">İndirim Türü *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => handleInputChange("discountType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Yüzdelik (%)</SelectItem>
                      <SelectItem value="fixed">Sabit Tutar (₺)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountValue">
                    İndirim Değeri * {formData.discountType === "percentage" ? "(%)" : "(₺)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    max={formData.discountType === "percentage" ? "100" : undefined}
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange("discountValue", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="minPurchase">Minimum Alışveriş Tutarı (₺)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minPurchase}
                    onChange={(e) => handleInputChange("minPurchase", e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="maxUses">Maksimum Kullanım Sayısı</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    min="1"
                    value={formData.maxUses}
                    onChange={(e) => handleInputChange("maxUses", e.target.value)}
                    placeholder="Sınırsız"
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Son Kullanım Tarihi</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Kupon açıklaması..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {editingCoupon ? "Güncelle" : "Oluştur"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseModal}>
                    İptal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kuponlar</CardTitle>
          <CardDescription>
            Toplam {coupons.length} kupon bulunuyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Yükleniyor...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Henüz kupon oluşturulmamış
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod</TableHead>
                  <TableHead>İndirim</TableHead>
                  <TableHead>Min. Alışveriş</TableHead>
                  <TableHead>Kullanım</TableHead>
                  <TableHead>Son Tarih</TableHead>
                  <TableHead>Durum</TableHead>
                  {canManage && <TableHead>İşlemler</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell className="font-mono font-semibold">
                      {coupon.code}
                    </TableCell>
                    <TableCell>
                      {formatDiscountValue(coupon.discountType, coupon.discountValue)}
                    </TableCell>
                    <TableCell>
                      {coupon.minPurchase > 0 ? `${coupon.minPurchase}₺` : "Yok"}
                    </TableCell>
                    <TableCell>
                      {coupon.usesCount} / {coupon.maxUses || "∞"}
                    </TableCell>
                    <TableCell>{formatDate(coupon.expiryDate)}</TableCell>
                    <TableCell>
                      <Badge variant={coupon.isActive ? "default" : "secondary"}>
                        {coupon.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    {canManage && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(coupon._id)}
                          >
                            {coupon.isActive ? (
                              <ToggleRight className="w-4 h-4" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
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
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminCouponsPage; 