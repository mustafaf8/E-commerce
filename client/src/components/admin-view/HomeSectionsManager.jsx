import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllHomeSections,
  addHomeSection,
  updateHomeSection,
  deleteHomeSection,
  updateHomeSectionsOrder, 
} from "@/store/common-slice/home-sections-slice";
import { fetchAllCategories } from "@/store/common-slice/categories-slice";
import { fetchAllBrands } from "@/store/common-slice/brands-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Edit, Trash2, PlusCircle, ArrowUpDown, BadgeCheck, BadgeX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import { Skeleton } from "@/components/ui/skeleton";
import { CardTitle } from "../ui/card";
import useAdminPermission from "@/hooks/useAdminPermission";
import PropTypes from 'prop-types';


const initialSectionData = {
  title: "",
  displayOrder: 0,
  contentType: "CATEGORY",
  contentValue: "",
  itemLimit: 10,
  isActive: true,
};

const contentTypeOptions = [
  { value: "BEST_SELLING", label: "En Çok Satanlar" },
  { value: "CATEGORY", label: "Kategori" },
  { value: "BRAND", label: "Marka" },
  // { value: 'TAG', label: 'Etiket' }, // İleride eklenebilir
  // { value: 'CUSTOM_FILTER', label: 'Özel Filtre' }, // İleride eklenebilir
];

function HomeSectionsManager({ canManage }) {
  const dispatch = useDispatch();
  const {
    homeSections = [],
    isLoading,
    error,
  } = useSelector(
    (state) => state.homeSections || { homeSections: [], isLoading: false }
  );
  const { categoryList = [], isLoading: categoriesLoading } = useSelector(
    (state) => state.categories || { categoryList: [], isLoading: false }
  );
  const { brandList = [], isLoading: brandsLoading } = useSelector(
    (state) => state.brands || { brandList: [], isLoading: false }
  );

  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState(initialSectionData);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [sortedSections, setSortedSections] = useState([]);

  // Hiyerarşik kategori listesini düz listeye çevir
  const flattenCategories = (categories, result = []) => {
    categories.forEach(category => {
      result.push(category);
      if (category.children && category.children.length > 0) {
        flattenCategories(category.children, result);
      }
    });
    return result;
  };

  // Tüm kategorileri (ana ve alt kategoriler) al
  const allCategories = flattenCategories(categoryList);

  useEffect(() => {
    dispatch(fetchAllHomeSections());
    dispatch(fetchAllCategories());
    dispatch(fetchAllBrands());
  }, [dispatch]);

  useEffect(() => {
    setSortedSections(
      [...homeSections].sort((a, b) => a.displayOrder - b.displayOrder)
    );
  }, [homeSections]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentSection((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setCurrentSection((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "contentType" && { contentValue: "" }),
    }));
  };

  const openModalForEdit = (section) => {
    setIsEditing(true);
    setCurrentSection({ ...section });
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setIsEditing(false);
    const nextOrder =
      homeSections.length > 0
        ? Math.max(...homeSections.map((s) => s.displayOrder)) + 1
        : 0;
    setCurrentSection({ ...initialSectionData, displayOrder: nextOrder });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentSection(initialSectionData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !currentSection.title ||
      !currentSection.contentType ||
      (currentSection.contentType !== "BEST_SELLING" &&
        !currentSection.contentValue)
    ) {
      toast({
        variant: "destructive",
        title:
          "Başlık, İçerik Türü ve Değer (En Çok Satanlar hariç) zorunludur.",
      });
      return;
    }

    const action = isEditing
      ? updateHomeSection({
          id: currentSection._id,
          sectionData: currentSection,
        })
      : addHomeSection(currentSection);

    dispatch(action)
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          toast({
            variant: "success",
            title: `Bölüm başarıyla ${isEditing ? "güncellendi" : "eklendi"}.`,
          });
          closeModal();
          dispatch(fetchAllHomeSections());
        } else {
          toast({
            variant: "destructive",
            title:
              payload.message ||
              `Bölüm ${isEditing ? "güncellenemedi" : "eklenemedi"}.`,
          });
        }
      })
      .catch((err) => {
        console.error("Bölüm işlemi hatası:", err);
        toast({
          variant: "destructive",
          title: err.message || `Bir hata oluştu.`,
        });
      });
  };

  const handleToggleActive = (section) => {
    // Sadece isActive alanını güncelle
    const updateData = {
      isActive: !section.isActive,
    };

    dispatch(updateHomeSection({ id: section._id, sectionData: updateData }))
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          toast({
            variant: "success",
            title: `Bölüm başarıyla ${!section.isActive ? "aktifleştirildi" : "pasifleştirildi"}.`,
          });
          dispatch(fetchAllHomeSections());
        } else {
          toast({
            variant: "destructive",
            title: payload.message || "Durum güncellenemedi.",
          });
        }
      })
      .catch((err) => {
        console.error("Durum güncelleme hatası:", err);
        toast({
          variant: "destructive",
          title: err.message || "Bir hata oluştu.",
        });
      });
  };

  const handleDeleteClick = (section) => {
    setSectionToDelete(section);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (sectionToDelete) {
      dispatch(deleteHomeSection(sectionToDelete._id))
        .unwrap()
        .then((payload) => {
          if (payload.success) {
            toast({
              variant: "success",
              title: "Bölüm başarıyla silindi.",
            });
            dispatch(fetchAllHomeSections());
          } else {
            toast({
              variant: "destructive",
              title: payload.message || "Bölüm silinemedi.",
            });
          }
        })
        .catch((err) => {
          console.error("Silme hatası:", err);
          toast({
            variant: "destructive",
            title: err.message || "Bir hata oluştu.",
          });
        });
    }
    setIsConfirmModalOpen(false);
    setSectionToDelete(null);
  };

  const moveSection = (index, direction) => {
    const newSections = [...sortedSections];
    const temp = newSections[index];
    newSections[index] = newSections[index + direction];
    newSections[index + direction] = temp;

    // Update display orders
    const updatedSectionsWithOrder = newSections.map((section, idx) => ({
      ...section,
      displayOrder: idx,
    }));

    setSortedSections(updatedSectionsWithOrder);

    const orderedIds = updatedSectionsWithOrder.map((s) => s._id);
    dispatch(updateHomeSectionsOrder(orderedIds))
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          dispatch(fetchAllHomeSections());
        } else {
          toast({
            variant: "destructive",
            title: payload.message || "Sıralama güncellenemedi.",
          });
          setSortedSections(
            [...homeSections].sort((a, b) => a.displayOrder - b.displayOrder)
          );
        }
      })
      .catch((err) => {
        console.error("Sıralama hatası:", err);
        toast({
          variant: "destructive",
          title: err.message || "Sıralama güncellenirken bir hata oluştu.",
        });
        setSortedSections(
          [...homeSections].sort((a, b) => a.displayOrder - b.displayOrder)
        );
      });
  };

  // Find the name of a brand or category based on its slug
  const getContentValueName = (section) => {
    if (section.contentType === "CATEGORY") {
      const category = allCategories.find(
        (c) => c.slug === section.contentValue
      );
      return category ? (category.parent ? `└─ ${category.name}` : category.name) : section.contentValue;
    } else if (section.contentType === "BRAND") {
      const brand = brandList.find((b) => b.slug === section.contentValue);
      return brand?.name || section.contentValue;
    }
    return section.contentValue || "-";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center my-4">
        <CardTitle>Ana Sayfa Bölüm Yönetimi</CardTitle>
        {canManage && (<Button onClick={openModalForAdd} className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-2" />
          Bölüm Ekle
        </Button>)}
      </div>

      {isLoading && !sortedSections.length ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : error ? (
        <p className="text-red-500">Hata: {error}</p>
      ) : sortedSections.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Henüz ana sayfa bölümü eklenmemiş.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {canManage && <TableHead>Sıra</TableHead>}
              <TableHead>Başlık</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Değer</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Durum</TableHead>
              {canManage && <TableHead className="text-right">İşlemler</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSections.map((section, index) => (
              <TableRow key={section._id}>
                {canManage && (<TableCell className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveSection(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUpDown className="h-4 w-4 transform rotate-[-45deg]" />
                  </Button>
                  <span className="font-mono">{section.displayOrder}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveSection(index, 1)}
                    disabled={index === sortedSections.length - 1}
                  >
                    <ArrowUpDown className="h-4 w-4 transform rotate-[135deg]" />
                  </Button>
                </TableCell>)}
                <TableCell className="font-medium">{section.title}</TableCell>
                <TableCell>
                  {contentTypeOptions.find(
                    (opt) => opt.value === section.contentType
                  )?.label || section.contentType}
                </TableCell>
                <TableCell
                  className="truncate max-w-[150px]"
                  title={section.contentValue}
                >
                  {getContentValueName(section)}
                </TableCell>
                <TableCell>{section.itemLimit}</TableCell>
                <TableCell>
                  <Badge
                    variant={section.isActive ? "default" : "secondary"}
                    className={`px-2 py-0.5 text-xs ${
                      section.isActive
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }`}
                  >
                    {section.isActive ? (
                      <BadgeCheck className="mr-1 h-3 w-3" />
                    ) : (
                      <BadgeX className="mr-1 h-3 w-3" />
                    )}
                    {section.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                {canManage && (<TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Switch
                      checked={section.isActive}
                      onCheckedChange={() => handleToggleActive(section)}
                      className="data-[state=checked]:bg-primary"
                    />
                    {/* Düzenle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModalForEdit(section)}
                      className="px-2 py-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Düzenle</span>
                    </Button>
                    
                    {/* Sil */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(section)}
                      className="px-2 py-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Sil</span>
                    </Button>
                  </div>
                </TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Ekleme/Düzenleme Modalı */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Bölüm Düzenle" : "Yeni Bölüm Ekle"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Başlık
              </Label>
              <Input
                id="title"
                name="title"
                value={currentSection.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Display Order */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayOrder" className="text-right">
                Sıra
              </Label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                value={currentSection.displayOrder}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            {/* Content Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contentType" className="text-right">
                İçerik Tipi
              </Label>
              <Select
                name="contentType"
                value={currentSection.contentType}
                onValueChange={(value) =>
                  handleSelectChange("contentType", value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="İçerik tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content Value (Conditional) */}
            {currentSection.contentType !== "BEST_SELLING" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contentValue" className="text-right">
                  {currentSection.contentType === "CATEGORY"
                    ? "Kategori"
                    : currentSection.contentType === "BRAND"
                    ? "Marka"
                    : "Değer"}
                </Label>
                {currentSection.contentType === "CATEGORY" ? (
                  <Select
                    name="contentValue"
                    value={currentSection.contentValue}
                    onValueChange={(value) =>
                      handleSelectChange("contentValue", value)
                    }
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="" disabled>
                          Yükleniyor...
                        </SelectItem>
                      ) : (
                        allCategories
                          .filter((cat) => cat.isActive)
                          .map((cat) => (
                            <SelectItem key={cat._id} value={cat.slug}>
                              {cat.parent ? `  └─ ${cat.name}` : cat.name}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                ) : currentSection.contentType === "BRAND" ? (
                  <Select
                    name="contentValue"
                    value={currentSection.contentValue}
                    onValueChange={(value) =>
                      handleSelectChange("contentValue", value)
                    }
                    required
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Marka seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandsLoading ? (
                        <SelectItem value="" disabled>
                          Yükleniyor...
                        </SelectItem>
                      ) : (
                        brandList.map((brand) => (
                          <SelectItem key={brand._id} value={brand.slug}>
                            {brand.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="contentValue"
                    name="contentValue"
                    value={currentSection.contentValue}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="İlgili değeri girin"
                    required
                  />
                )}
              </div>
            )}

            {/* Item Limit */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemLimit" className="text-right">
                Ürün Limiti
              </Label>
              <Input
                id="itemLimit"
                name="itemLimit"
                type="number"
                min="1"
                value={currentSection.itemLimit}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
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
        message={`'${sectionToDelete?.title}' bölümünü silmek istediğinizden emin misiniz?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}
HomeSectionsManager.propTypes = {
  canManage: PropTypes.bool.isRequired,
};

export default HomeSectionsManager;
