import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBrands,
  addBrand,
  updateBrand,
  deleteBrand,
} from "@/store/common-slice/brands-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Edit, Trash2, PlusCircle, BadgeCheck, BadgeX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ConfirmationModal from "./ConfirmationModal";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

const initialBrandData = { name: "", slug: "", isActive: true };

function BrandManager() {
  const dispatch = useDispatch();
  const {
    brandList = [],
    isLoading,
    error,
  } = useSelector(
    (state) => state.brands || { brandList: [], isLoading: false }
  );
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(initialBrandData);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentBrand((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "name" && !isEditing) {
      const slug = value
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      setCurrentBrand((prev) => ({ ...prev, slug: slug }));
    }
  };

  const handleSwitchChange = (checked) => {
    setCurrentBrand((prev) => ({ ...prev, isActive: checked }));
  };

  const openModalForEdit = (brand) => {
    setIsEditing(true);
    setCurrentBrand({ ...brand });
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setIsEditing(false);
    setCurrentBrand(initialBrandData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentBrand(initialBrandData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentBrand.name || !currentBrand.slug) {
      toast({ variant: "destructive", title: "Marka adı ve slug zorunludur." });
      return;
    }

    const action = isEditing
      ? updateBrand({ id: currentBrand._id, brandData: currentBrand })
      : addBrand(currentBrand);

    dispatch(action)
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          toast({
            variant: "success",
            title: `Marka başarıyla ${isEditing ? "güncellendi" : "eklendi"}.`,
          });
          closeModal();
        } else {
          toast({
            variant: "destructive",
            title:
              payload.message ||
              `Marka ${isEditing ? "güncellenemedi" : "eklenemedi"}.`,
          });
        }
      })
      .catch((err) => {
        console.error("Marka işlemi hatası:", err);
        toast({
          variant: "destructive",
          title: err.message || err?.payload?.message || `Bir hata oluştu.`,
        });
      });
  };

  const handleDeleteClick = (brand) => {
    setBrandToDelete(brand);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (brandToDelete) {
      dispatch(deleteBrand(brandToDelete._id))
        .unwrap()
        .then((payload) => {
          if (payload.success) {
            toast({ variant: "success", title: "Marka silindi." });
            dispatch(fetchAllBrands());
          } else {
            toast({
              variant: "destructive",
              title: payload.message || "Marka silinemedi.",
            });
          }
        })
        .catch((err) => {
          console.error("Marka silme hatası:", err);
          toast({
            variant: "destructive",
            title: err.message || err?.payload?.message || "Bir hata oluştu.",
          });
        })
        .finally(() => {
          setBrandToDelete(null);
          setIsConfirmModalOpen(false);
        });
    }
  };

  return (
    <div>
      
      <div className="flex justify-end mb-4">
        <Button onClick={openModalForAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Marka Ekle
        </Button>
      </div>
      <div className="space-y-3">
        {isLoading && !brandList.length ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">Hata: {error}</p>
        ) : brandList.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Henüz marka eklenmemiş.
          </p>
        ) : (
          brandList.map((brand) => (
            <div
              key={brand._id}
              className="flex items-center justify-between p-3 border rounded-md bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 flex-grow min-w-0 mr-4">
                <div className="min-w-0">
                  <p
                    className="font-semibold text-base truncate"
                    title={brand.name}
                  >
                    {brand.name}
                  </p>
                  <p
                    className="text-xs text-muted-foreground truncate"
                    title={brand.slug}
                  >
                    /{brand.slug}
                  </p>
                </div>
                <Badge
                  variant={brand.isActive ? "default" : "secondary"}
                  className={`px-2 py-0.5 text-xs ${
                    brand.isActive
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {brand.isActive ? (
                    <BadgeCheck className="mr-1 h-3 w-3" />
                  ) : (
                    <BadgeX className="mr-1 h-3 w-3" />
                  )}
                  {brand.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openModalForEdit(brand)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Düzenle</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteClick(brand)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Sil</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ekleme/Düzenleme Modalı */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Marka Düzenle" : "Yeni Marka Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Adı
              </Label>
              <Input
                id="name"
                name="name"
                value={currentBrand.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                value={currentBrand.slug}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Aktif
              </Label>
              <div className="col-span-3">
                <Switch
                  id="isActive"
                  name="isActive"
                  checked={currentBrand.isActive}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  İptal
                </Button>
              </DialogClose>
              <Button type="submit">{isEditing ? "Güncelle" : "Ekle"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Silme Onay Modalı */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message={`'${brandToDelete?.name}' markasını silmek istediğinizden emin misiniz? Bu markayı kullanan ürünler varsa silemezsiniz.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}

export default BrandManager;
