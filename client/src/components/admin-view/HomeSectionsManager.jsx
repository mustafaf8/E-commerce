import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllHomeSections,
  addHomeSection,
  updateHomeSection,
  deleteHomeSection,
} from "@/store/common-slice/home-sections-slice";
import { fetchAllCategories } from "@/store/common-slice/categories-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Edit, Trash2, PlusCircle, ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import { Skeleton } from "@/components/ui/skeleton";
import { updateHomeSectionsOrder } from "@/store/common-slice/home-sections-slice";

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

function HomeSectionsManager() {
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

  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState(initialSectionData);
  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [sortedSections, setSortedSections] = useState([]);

  useEffect(() => {
    dispatch(fetchAllHomeSections());
    dispatch(fetchAllCategories());
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
      // Eğer içerik türü değişiyorsa, contentValue'yu sıfırla
      ...(name === "contentType" && { contentValue: "" }),
    }));
  };

  const handleSwitchChange = (checked) => {
    setCurrentSection((prev) => ({ ...prev, isActive: checked }));
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
            toast({ variant: "success", title: "Bölüm silindi." });
            dispatch(fetchAllHomeSections());
          } else {
            toast({
              variant: "destructive",
              title: payload.message || "Bölüm silinemedi.",
            });
          }
        })
        .catch((err) => {
          console.error("Bölüm silme hatası:", err);
          toast({
            variant: "destructive",
            title: err.message || "Bir hata oluştu.",
          });
        })
        .finally(() => {
          setSectionToDelete(null);
          setIsConfirmModalOpen(false);
        });
    }
  };

  const moveSection = async (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === sortedSections.length - 1)
    ) {
      return;
    }

    const newSortedSections = [...sortedSections];
    const [movedSection] = newSortedSections.splice(index, 1);
    newSortedSections.splice(index + direction, 0, movedSection);
    const updatedSectionsWithOrder = newSortedSections.map((section, i) => ({
      ...section,
      displayOrder: i,
    }));

    setSortedSections(updatedSectionsWithOrder);
    const orderedIds = updatedSectionsWithOrder.map((s) => s._id);
    try {
      await dispatch(updateHomeSectionsOrder(orderedIds)).unwrap();
      toast({ variant: "success", title: "Sıralama güncellendi." });
      // Backend başarılı yanıt dönerse Redux state'i zaten güncellenecek (thunk'ın fulfilled case'i)
      // Eğer backend sadece success dönerse, listeyi tekrar çekmek gerekebilir:
      // dispatch(fetchAllHomeSections());
    } catch {
      toast({ variant: "destructive", title: "Sıralama güncellenemedi." });
      setSortedSections(
        [...homeSections].sort((a, b) => a.displayOrder - b.displayOrder)
      );
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openModalForAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Bölüm Ekle
        </Button>
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
              <TableHead>Sıra</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Değer</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSections.map((section, index) => (
              <TableRow key={section._id}>
                <TableCell className="flex items-center gap-1">
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
                </TableCell>
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
                  {section.contentType === "CATEGORY"
                    ? categoryList.find((c) => c.slug === section.contentValue)
                        ?.name || section.contentValue
                    : section.contentValue || "-"}
                </TableCell>
                <TableCell>{section.itemLimit}</TableCell>
                <TableCell>{section.isActive ? "Aktif" : "Pasif"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() => openModalForEdit(section)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteClick(section)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Ekleme/Düzenleme Modalı */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Bölümü Düzenle" : "Yeni Bölüm Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
                        categoryList.map((cat) => (
                          <SelectItem key={cat._id} value={cat.slug}>
                            {" "}
                            {/* Slug'ı değer olarak kullan */}
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                ) : currentSection.contentType === "BRAND" ? (
                  <Input
                    id="contentValue"
                    name="contentValue"
                    value={currentSection.contentValue}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Marka slug girin (örn: nike)"
                    required
                  />
                ) : (
                  /* Eğer marka listesi varsa Select kullan:
                                    <Select name="contentValue" ...>...</Select>
                                 */
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

            {/* Is Active */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Aktif
              </Label>
              <div className="col-span-3">
                <Switch
                  id="isActive"
                  name="isActive"
                  checked={currentSection.isActive}
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
        message={`'${sectionToDelete?.title}' bölümünü silmek istediğinizden emin misiniz?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}

export default HomeSectionsManager;
