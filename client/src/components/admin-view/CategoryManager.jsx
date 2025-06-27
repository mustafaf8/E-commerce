import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  addCategory,
  deleteCategory,
  fetchAllCategories,
  updateCategory,
} from "@/store/common-slice/categories-slice";
import { Edit, Trash2, PlusCircle, BadgeCheck, BadgeX } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardTitle } from "../ui/card";

const initialCategoryData = { name: "", slug: "", isActive: true };

function CategoryManager() {
  const dispatch = useDispatch();
  const {
    categoryList = [],
    isLoading,
    error,
  } = useSelector(
    (state) => state.categories || { categoryList: [], isLoading: false }
  );
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(initialCategoryData);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCategory((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "name" && !isEditing) {
      const slug = value
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^-\w]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      setCurrentCategory((prev) => ({ ...prev, slug: slug }));
    }
  };

  const handleSwitchChange = (checked) => {
    setCurrentCategory((prev) => ({ ...prev, isActive: checked }));
  };

  const openModalForEdit = (category) => {
    setIsEditing(true);
    setCurrentCategory({ ...category });
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setIsEditing(false);
    setCurrentCategory(initialCategoryData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentCategory(initialCategoryData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentCategory.name || !currentCategory.slug) {
      toast({
        variant: "destructive",
        title: "Kategori adı ve slug zorunludur.",
      });
      return;
    }
    const action = isEditing
      ? updateCategory({
          id: currentCategory._id,
          categoryData: currentCategory,
        })
      : addCategory(currentCategory);
    dispatch(action)
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          toast({
            variant: "success",
            title: `Kategori başarıyla ${
              isEditing ? "güncellendi" : "eklendi"
            }.`,
          });
          closeModal();
        } else {
          toast({
            variant: "destructive",
            title:
              payload.message ||
              `Kategori ${isEditing ? "güncellenemedi" : "eklenemedi"}.`,
          });
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: err.message || `Bir hata oluştu.`,
        });
      });
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;

    dispatch(deleteCategory(categoryToDelete._id))
      .unwrap()
      .then(() => {
        toast({ variant: "success", title: "Kategori silindi." });
      })
      .catch((error) => {
        const isUsedError = error?.isUsedError;
        const errorMessage = error?.message || "Bir hata oluştu.";

        toast({
          variant: isUsedError ? "warning" : "destructive",
          title: isUsedError ? "Kategori Kullanımda" : "Silme Başarısız",
          description: errorMessage,
        });
      })
      .finally(() => {
        setCategoryToDelete(null);
        setIsConfirmModalOpen(false);
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <CardTitle>Kategori Yönetimi</CardTitle>
        <Button onClick={openModalForAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Kategori Ekle
        </Button>
      </div>
      <div className="space-y-3">
        {isLoading && !categoryList.length ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">Hata: {error}</p>
        ) : categoryList.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Henüz kategori eklenmemiş.
          </p>
        ) : (
          categoryList.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between p-3 border rounded-md bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 flex-grow min-w-0 mr-4">
                <div className="min-w-0">
                  <p
                    className="font-semibold text-base truncate"
                    title={category.name}
                  >
                    {category.name}
                  </p>
                  <p
                    className="text-xs text-muted-foreground truncate"
                    title={category.slug}
                  >
                    /{category.slug}
                  </p>
                </div>
                <Badge
                  variant={category.isActive ? "default" : "secondary"}
                  className={`px-2 py-0.5 text-xs ${
                    category.isActive
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {category.isActive ? (
                    <BadgeCheck className="mr-1 h-3 w-3" />
                  ) : (
                    <BadgeX className="mr-1 h-3 w-3" />
                  )}
                  {category.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <div className="flex-shrink-0 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openModalForEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Düzenle</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteClick(category)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Sil</span>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
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
                value={currentCategory.name}
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
                value={currentCategory.slug}
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
                  checked={currentCategory.isActive}
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

      {/* Silme Onay Modalı (Aynı kalabilir) */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message={`'${categoryToDelete?.name}' kategorisini silmek istediğinizden emin misiniz? Bu kategori bir veya daha fazla üründe kullanılıyorsa silinemez.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}

export default CategoryManager;
