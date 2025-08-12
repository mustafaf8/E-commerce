import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { ArrowUpDown, ArrowUp, ArrowDown, CheckCircle, AlertCircle, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api/axiosInstance";
import useAdminPermission from "@/hooks/useAdminPermission";

const HeaderManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const canView = useAdminPermission('header-management');
  const canManage = useAdminPermission('header-management', 'manage');

  useEffect(() => {
    if (canView) {
      fetchHeaderCategories();
    }
  }, [canView]);

  const fetchHeaderCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/categories/header");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Header kategorileri getirme hatası:", error);
      toast({
        title: "Hata",
        description: "Kategoriler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const moveCategory = (index, direction) => {
    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index + direction];
    newCategories[index + direction] = temp;

    const updatedCategories = newCategories.map((category, idx) => ({
      ...category,
      headerOrder: idx + 1,
    }));

    setCategories(updatedCategories);
  };

  const saveOrder = async () => {
    try {
      setSaving(true);
      const categoryOrders = categories.map((category, index) => ({
        id: category._id,
        order: index + 1,
      }));

      const response = await api.put("/admin/categories/header/order", {
        categoryOrders,
      });

      if (response.data.success) {
        toast({
          title: "Başarılı",
          description: `${categories.length} kategori sıralaması başarıyla güncellendi.`,
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Sıralama kaydetme hatası:", error);
      toast({
        title: "Hata",
        description: "Sıralama kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetOrder = () => {
    fetchHeaderCategories();
    toast({
      title: "Bilgi",
      description: "Kategori sıralaması orijinal haline sıfırlandı.",
      variant: "info",
    });
  };

  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Kategoriler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2">
        <p className="text-muted-foreground mb-2">
          Header'da görünecek kategorilerin sıralamasını düzenleyin.
        </p>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Header Sıralaması
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Henüz kategori bulunamadı.</p>
              <Button onClick={fetchHeaderCategories} className="mt-2">
                Tekrar Dene
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sıra</TableHead>
                  <TableHead>Kategori Adı</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category._id}>
                    <TableCell className="flex items-center gap-1">
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveCategory(index, -1)}
                          disabled={index === 0}
                          aria-label="Yukarı taşı"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      )}
                      <span className="font-mono min-w-[2rem] text-center">
                        {index + 1}
                      </span>
                      {canManage && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveCategory(index, 1)}
                          disabled={index === categories.length - 1}
                          aria-label="Aşağı taşı"
                        >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                        className={`px-2 py-0.5 text-xs ${
                          category.isActive
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        }`}
                      >
                        {category.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex gap-3 mt-6">
            {canManage && (
              <>
                <Button onClick={saveOrder} disabled={saving} aria-label="Sıralamayı Kaydet">
                  {saving ? "Kaydediliyor..." : "Sıralamayı Kaydet"}
                </Button>
                <Button variant="outline" onClick={resetOrder} aria-label="Sıfırla">
                  Sıfırla
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderManagement; 

