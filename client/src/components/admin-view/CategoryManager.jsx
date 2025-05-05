// // client/src/components/admin-view/CategoryManager.jsx

// import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
// import { Button } from "@/components/ui/button";
// import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useToast } from "@/components/ui/use-toast";
// import {
//   addCategory,
//   deleteCategory,
//   fetchAllCategories,
//   updateCategory,
// } from "@/store/common-slice/categories-slice";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogTitle,
// } from "@radix-ui/react-dialog";
// import { Label } from "@radix-ui/react-dropdown-menu";
// import { Edit, PlusCircle, Table, Trash2 } from "lucide-react";

// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const initialCategoryData = { name: "", slug: "", isActive: true };

// function CategoryManager() {
//   const dispatch = useDispatch();
//   const {
//     categoryList = [],
//     isLoading,
//     error,
//   } = useSelector(
//     (state) => state.categories || { categoryList: [], isLoading: false }
//   );
//   const { toast } = useToast();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState(initialCategoryData);
//   const [categoryToDelete, setCategoryToDelete] = useState(null);
//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllCategories());
//   }, [dispatch]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setCurrentCategory((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//     // Slug'ı otomatik doldur (isteğe bağlı)
//     if (name === "name") {
//       const slug = value
//         .toString()
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^\w-]+/g, "")
//         .replace(/--+/g, "-")
//         .replace(/^-+/, "")
//         .replace(/-+$/, "");
//       setCurrentCategory((prev) => ({ ...prev, slug: slug }));
//     }
//   };

//   const handleSwitchChange = (checked) => {
//     setCurrentCategory((prev) => ({ ...prev, isActive: checked }));
//   };

//   const openModalForEdit = (category) => {
//     setIsEditing(true);
//     setCurrentCategory({ ...category }); // Düzenlenecek kategoriyi state'e al
//     setIsModalOpen(true);
//   };

//   const openModalForAdd = () => {
//     setIsEditing(false);
//     setCurrentCategory(initialCategoryData);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setIsEditing(false);
//     setCurrentCategory(initialCategoryData);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!currentCategory.name || !currentCategory.slug) {
//       toast({
//         variant: "destructive",
//         title: "Kategori adı ve slug zorunludur.",
//       });
//       return;
//     }

//     const action = isEditing
//       ? updateCategory({
//           id: currentCategory._id,
//           categoryData: currentCategory,
//         })
//       : addCategory(currentCategory);

//     dispatch(action)
//       .unwrap()
//       .then((payload) => {
//         if (payload.success) {
//           toast({
//             variant: "success",
//             title: `Kategori başarıyla ${
//               isEditing ? "güncellendi" : "eklendi"
//             }.`,
//           });
//           closeModal();
//           // Liste otomatik güncellenir (Redux sayesinde)
//         } else {
//           toast({
//             variant: "destructive",
//             title:
//               payload.message ||
//               `Kategori ${isEditing ? "güncellenemedi" : "eklenemedi"}.`,
//           });
//         }
//       })
//       .catch((err) => {
//         console.error("Kategori işlemi hatası:", err);
//         toast({
//           variant: "destructive",
//           title: err.message || `Bir hata oluştu.`,
//         });
//       });
//   };

//   const handleDeleteClick = (category) => {
//     setCategoryToDelete(category);
//     setIsConfirmModalOpen(true);
//   };

//   const confirmDelete = () => {
//     if (categoryToDelete) {
//       dispatch(deleteCategory(categoryToDelete._id))
//         .unwrap()
//         .then((payload) => {
//           if (payload.success) {
//             toast({ variant: "success", title: "Kategori silindi." });
//           } else {
//             toast({
//               variant: "destructive",
//               title: payload.message || "Kategori silinemedi.",
//             });
//           }
//         })
//         .catch((err) => {
//           console.error("Kategori silme hatası:", err);
//           toast({
//             variant: "destructive",
//             title: err.message || "Bir hata oluştu.",
//           });
//         })
//         .finally(() => {
//           setCategoryToDelete(null);
//           setIsConfirmModalOpen(false);
//         });
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <Button onClick={openModalForAdd}>
//           <PlusCircle className="mr-2 h-4 w-4" /> Yeni Kategori Ekle
//         </Button>
//       </div>

//       {isLoading && !categoryList.length ? (
//         <div className="space-y-2">
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-10 w-full" />
//         </div>
//       ) : error ? (
//         <p className="text-red-500">Hata: {error}</p>
//       ) : categoryList.length === 0 ? (
//         <p className="text-center text-muted-foreground">
//           Henüz kategori eklenmemiş.
//         </p>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Adı</TableHead>
//               <TableHead>Slug</TableHead>
//               <TableHead>Durum</TableHead>
//               <TableHead className="text-right">İşlemler</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {categoryList.map((category) => (
//               <TableRow key={category._id}>
//                 <TableCell className="font-medium">{category.name}</TableCell>
//                 <TableCell>{category.slug}</TableCell>
//                 <TableCell>{category.isActive ? "Aktif" : "Pasif"}</TableCell>
//                 <TableCell className="text-right">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="mr-2"
//                     onClick={() => openModalForEdit(category)}
//                   >
//                     <Edit className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-destructive hover:text-destructive"
//                     onClick={() => handleDeleteClick(category)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}

//       {/* Ekleme/Düzenleme Modalı */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>
//               {isEditing ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
//             </DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Adı
//               </Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={currentCategory.name}
//                 onChange={handleInputChange}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="slug" className="text-right">
//                 Slug
//               </Label>
//               <Input
//                 id="slug"
//                 name="slug"
//                 value={currentCategory.slug}
//                 onChange={handleInputChange}
//                 className="col-span-3"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="isActive" className="text-right">
//                 Aktif
//               </Label>
//               <div className="col-span-3">
//                 <Switch
//                   id="isActive"
//                   name="isActive"
//                   checked={currentCategory.isActive}
//                   onCheckedChange={handleSwitchChange}
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <DialogClose asChild>
//                 <Button type="button" variant="secondary">
//                   İptal
//                 </Button>
//               </DialogClose>
//               <Button type="submit">{isEditing ? "Güncelle" : "Ekle"}</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Silme Onay Modalı */}
//       <ConfirmationModal
//         isOpen={isConfirmModalOpen}
//         message={`'${categoryToDelete?.name}' kategorisini silmek istediğinizden emin misiniz?`}
//         onConfirm={confirmDelete}
//         onCancel={() => setIsConfirmModalOpen(false)}
//       />
//     </div>
//   );
// }

// export default CategoryManager;

import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  addCategory,
  deleteCategory,
  fetchAllCategories,
  updateCategory,
} from "@/store/common-slice/categories-slice";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Badge,
  BadgeCheck,
  BadgeX,
  Edit,
  PlusCircle,
  Table,
  Trash2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
      // Sadece yeni eklerken veya isim değişirse slug'ı otomatik doldur
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
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete._id))
        .unwrap()
        .then((payload) => {
          if (payload.success) {
            toast({ variant: "success", title: "Kategori silindi." });
          } else {
            toast({
              variant: "destructive",
              title: payload.message || "Kategori silinemedi.",
            });
          }
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: err.message || "Bir hata oluştu.",
          });
        })
        .finally(() => {
          setCategoryToDelete(null);
          setIsConfirmModalOpen(false);
        });
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openModalForAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Kategori Ekle
        </Button>
      </div>

      {/* -------- DEĞİŞEN KISIM BAŞLANGIÇ -------- */}
      <div className="space-y-3">
        {" "}
        {/* Kategoriler arası boşluk */}
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
                {" "}
                {/* Esnek genişlik ve sağ boşluk */}
                {/* Kategori Adı ve Slug */}
                <div className="min-w-0">
                  {" "}
                  {/* Taşmayı önlemek için */}
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
                {/* Durum Badge */}
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
              {/* İşlem Butonları */}
              <div className="flex-shrink-0 flex items-center gap-1">
                {" "}
                {/* Butonların küçülmesini engelle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openModalForEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Düzenle</span>{" "}
                  {/* Ekran okuyucular için */}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteClick(category)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Sil</span>{" "}
                  {/* Ekran okuyucular için */}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* -------- DEĞİŞEN KISIM SON -------- */}

      {/* Ekleme/Düzenleme Modalı (Aynı kalabilir) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/* ... Modal içeriği aynı ... */}
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
        message={`'${categoryToDelete?.name}' kategorisini silmek istediğinizden emin misiniz?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}

export default CategoryManager;
