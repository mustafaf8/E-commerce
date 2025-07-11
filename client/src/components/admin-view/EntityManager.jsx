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
import { Edit, Trash2, PlusCircle, BadgeCheck, BadgeX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardTitle } from "../ui/card";
import PropTypes from "prop-types";

function EntityManager({
  entityName,
  entityNamePlural,
  selector,
  actions,
  canManage,
  listKey = "list", // entityList veya brandList gibi farklı key'ler için
}) {
  const dispatch = useDispatch();
  const stateData = useSelector(selector);
  const {
    [listKey]: entityList = [],
    isLoading = false,
    error = null,
  } = stateData || {};
  
  const { toast } = useToast();

  const initialEntityData = { name: "", slug: "", isActive: true };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(initialEntityData);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    dispatch(actions.fetchAll());
  }, [dispatch, actions]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentEntity((prev) => ({
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
      setCurrentEntity((prev) => ({ ...prev, slug: slug }));
    }
  };

  const handleSwitchChange = (checked) => {
    setCurrentEntity((prev) => ({ ...prev, isActive: checked }));
  };

  const openModalForEdit = (entity) => {
    setIsEditing(true);
    setCurrentEntity({ ...entity });
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setIsEditing(false);
    setCurrentEntity(initialEntityData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentEntity(initialEntityData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentEntity.name || !currentEntity.slug) {
      toast({
        variant: "destructive",
        title: `${entityName} adı ve slug zorunludur.`,
      });
      return;
    }
    const action = isEditing
      ? actions.update({
          id: currentEntity._id,
          [entityName.toLowerCase() === "kategori" ? "categoryData" : "brandData"]: currentEntity,
        })
      : actions.add(currentEntity);
    
    dispatch(action)
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          toast({
            variant: "success",
            title: `${entityName} başarıyla ${
              isEditing ? "güncellendi" : "eklendi"
            }.`,
          });
          closeModal();
        } else {
          toast({
            variant: "destructive",
            title:
              payload.message ||
              `${entityName} ${isEditing ? "güncellenemedi" : "eklenemedi"}.`,
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

  const handleDeleteClick = (entity) => {
    setEntityToDelete(entity);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (!entityToDelete) return;

    dispatch(actions.delete(entityToDelete._id))
      .unwrap()
      .then(() => {
        toast({ variant: "success", title: `${entityName} silindi.` });
      })
      .catch((error) => {
        const isUsedError = error?.isUsedError;
        const errorMessage = error?.message || "Bir hata oluştu.";

        toast({
          variant: isUsedError ? "warning" : "destructive",
          title: isUsedError ? `${entityName} Kullanımda` : "Silme Başarısız",
          description: errorMessage,
        });
      })
      .finally(() => {
        setEntityToDelete(null);
        setIsConfirmModalOpen(false);
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {canManage && (
          <Button onClick={openModalForAdd} className="ml-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Yeni {entityName} Ekle
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {isLoading && !entityList.length ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">Hata: {error}</p>
        ) : entityList.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Henüz {entityName.toLowerCase()} eklenmemiş.
          </p>
        ) : (
          entityList.map((entity) => (
            <div
              key={entity._id}
              className="flex items-center justify-between p-3 border rounded-md bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 flex-grow min-w-0 mr-4">
                <div className="min-w-0">
                  <p
                    className="font-semibold text-base truncate"
                    title={entity.name}
                  >
                    {entity.name}
                  </p>
                  <p
                    className="text-xs text-muted-foreground truncate"
                    title={entity.slug}
                  >
                    /{entity.slug}
                  </p>
                </div>
                <Badge
                  variant={entity.isActive ? "default" : "secondary"}
                  className={`px-2 py-0.5 text-xs ${
                    entity.isActive
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {entity.isActive ? (
                    <BadgeCheck className="mr-1 h-3 w-3" />
                  ) : (
                    <BadgeX className="mr-1 h-3 w-3" />
                  )}
                  {entity.isActive ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              {canManage && (
                <div className="flex-shrink-0 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openModalForEdit(entity)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Düzenle</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(entity)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Sil</span>
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? `${entityName} Düzenle` : `Yeni ${entityName} Ekle`}
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
                value={currentEntity.name}
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
                value={currentEntity.slug}
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
                  checked={currentEntity.isActive}
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
        message={`'${entityToDelete?.name}' ${entityName.toLowerCase()}ini silmek istediğinizden emin misiniz? Bu ${entityName.toLowerCase()} bir veya daha fazla üründe kullanılıyorsa silinemez.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}

EntityManager.propTypes = {
  entityName: PropTypes.string.isRequired,
  entityNamePlural: PropTypes.string.isRequired,
  selector: PropTypes.func.isRequired,
  actions: PropTypes.shape({
    fetchAll: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
  }).isRequired,
  canManage: PropTypes.bool.isRequired,
  listKey: PropTypes.string,
};

export default EntityManager; 