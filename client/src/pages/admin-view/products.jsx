import { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { addProductFormElements as initialFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { hasManagePermission } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import AdminProductCarousel from "@/components/admin-view/AdminProductCarousel";
import AdminProductDetailsDialog from "@/components/admin-view/AdminProductDetailsDialog";
import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";
import { fetchAllBrands } from "@/store/common-slice/brands-slice";
import { fetchAllCategories } from "@/store/common-slice/categories-slice";
import api from "@/api/axiosInstance";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  image: "",
  images: [], // Ek resimler için array
  costPrice: "",
  technicalSpecs: [], // Yeni alan
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImageLoadingState, setProductImageLoadingState] =
    useState(false);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImageLoadingState, setAdditionalImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const { productList, isLoading: listLoading } = useSelector(
    (state) => state.adminProducts
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const canManage = hasManagePermission(user, "products");
  const { toast } = useToast();
  const { categoryList = [], isLoading: categoriesLoading } = useSelector(
    (state) => state.categories || { categoryList: [], isLoading: false }
  );
  const { brandList = [] } = useSelector((state) => state.brands || {});
  const [dynamicFormControls, setDynamicFormControls] =
    useState(initialFormElements);

  // Teknik özellikler için state yönetimi
  const handleTechSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.technicalSpecs];
    updatedSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, technicalSpecs: updatedSpecs }));
  };

  const addTechSpec = () => {
    setFormData(prev => ({
      ...prev,
      technicalSpecs: [...prev.technicalSpecs, { key: "", value: "" }],
    }));
  };

  const removeTechSpec = (index) => {
    const updatedSpecs = formData.technicalSpecs.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, technicalSpecs: updatedSpecs }));
  };

  // Ek resim yükleme fonksiyonu
  const handleAdditionalImageUpload = async (files) => {
    if (!files || files.length === 0) {
      toast({ variant: "destructive", title: "Lütfen en az bir resim seçin" });
      return;
    }

    setAdditionalImageLoadingState(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const formDataUpload = new FormData();
        formDataUpload.append('my_file', file);
        
        const response = await api.post("/admin/products/upload-image", formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data.success) {
          return response.data.result.secure_url;
        }
        throw new Error(`Resim ${index + 1} yüklenemedi: ${response.data.message || 'Bilinmeyen hata'}`);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      
      toast({ title: `${uploadedUrls.length} resim başarıyla yüklendi`, variant: "success" });
      
      // File input'u temizle
      const fileInput = document.getElementById('additional-images');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Resim yükleme hatası",
        description: error?.response?.data?.message || error.message || "Bilinmeyen hata oluştu"
      });
    } finally {
      setAdditionalImageLoadingState(false);
    }
  };

  // Ek resim silme fonksiyonu
  const removeAdditionalImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };


  useEffect(() => {
    const updatedControls = initialFormElements.map((control) => {
      if (control.name === "category" && categoryList.length > 0) {
        return {
          ...control,
          options: categoryList
            .filter((cat) => cat.isActive)
            .map((cat) => ({ id: cat._id, label: cat.name })),
        };
      }
      if (control.name === "brand" && brandList.length > 0) {
        return {
          ...control,
          options: brandList
            .filter((brand) => brand.isActive)
            .map((brand) => ({ id: brand._id, label: brand.name })),
        };
      }
      return control;
    });
    setDynamicFormControls(updatedControls);
  }, [categoryList, brandList]);

  const uploadImage = useCallback(
    async (file) => {
      if (!file) return null;
      const data = new FormData();
      data.append("my_file", file);
      setProductImageLoadingState(true);
      try {
        const response = await api.post("/admin/products/upload-image", data);
        if (response?.data?.success && response.data.result?.url) {
          return response.data.result.url;
        } else {
          throw new Error(
            response?.data?.message || "Resim API yanıtı başarısız."
          );
        }
      } catch (error) {
       // console.error("Ürün resmi yükleme hatası:", error);
        toast({
          variant: "destructive",
          title: "Resim Yükleme Hatası",
          description:
            error?.response?.data?.message ||
            error.message ||
            "Bilinmeyen hata.",
        });
        return null;
      } finally {
        setProductImageLoadingState(false);
      }
    },
    [toast]
  );

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!canManage) {
        toast({ variant: "destructive", title: "Bu işlem için yetkiniz yok." });
        return;
      }

      let finalImageUrl = formData.image;
      try {
        if (productImageFile) {
          const uploadedUrl = await uploadImage(productImageFile);
          if (!uploadedUrl) return;
          finalImageUrl = uploadedUrl;
        }

        if (!finalImageUrl && currentEditedId === null) {
          toast({
            variant: "warning",
            title: "Lütfen ürün için bir resim seçin.",
          });
          return;
        }

        const priceNum = parseFloat(formData.price);
        const stockNum = parseInt(formData.totalStock, 10);
        const salePriceNum = formData.salePrice
          ? parseFloat(formData.salePrice)
          : null;

        if (isNaN(priceNum) || priceNum <= 0) {
          toast({ variant: "destructive", title: "Geçerli bir fiyat girin." });
          return;
        }
        if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
          toast({
            variant: "destructive",
            title: "Geçerli bir stok sayısı girin.",
          });
          return;
        }
        if (
          salePriceNum !== null &&
          (isNaN(salePriceNum) || salePriceNum < 0)
        ) {
          toast({
            variant: "destructive",
            title: "Geçerli bir indirimli fiyat girin veya boş bırakın.",
          });
          return;
        }
        if (salePriceNum !== null && salePriceNum >= priceNum) {
          toast({
            variant: "warning",
            title: "İndirimli fiyat, normal fiyattan düşük olmalıdır.",
          });
        }

        const dataToSend = {
          ...formData,
          category: formData.category,
          brand: formData.brand || null,
          image: finalImageUrl,
          images: formData.images || [], // Ek resimler
        };
       // console.log("Gönderilen Veri (Brand Kontrol):", dataToSend);

      // technicalSpecs'i boş ve geçersiz satırlardan temizle
      const filteredSpecs = dataToSend.technicalSpecs.filter(
        (spec) => spec.key.trim() !== "" && spec.value.trim() !== ""
      );

      const finalDataToSend = {
        ...dataToSend,
        technicalSpecs: filteredSpecs,
      };

      const action =
        currentEditedId !== null
          ? editProduct({ id: currentEditedId, formData: finalDataToSend })
          : addNewProduct(finalDataToSend);

      await dispatch(action).unwrap();

        toast({
          title: `Ürün başarıyla ${
            currentEditedId !== null ? "güncellendi" : "eklendi"
          }.`,
          variant: "success",
        });
        setOpenCreateProductsDialog(false);
      } catch (error) {
       // console.error("onSubmit sırasında hata:", error);
        toast({
          variant: "destructive",
          title: "İşlem Başarısız",
          description:
            error?.message ||
            error?.payload?.message ||
            "Ürün kaydedilirken bir hata oluştu.",
        });
      }
    },
    [dispatch, formData, productImageFile, currentEditedId, toast, uploadImage, canManage]
  );

  const openDeleteConfirmation = useCallback((productId) => {
    setProductIdToDelete(productId);
    setShowConfirmModal(true);
  }, []);

  const closeConfirmationModal = useCallback(() => {
    setShowConfirmModal(false);
    setProductIdToDelete(null);
  }, []);

  const confirmDeleteHandler = useCallback(() => {
    if (productIdToDelete) {
      dispatch(deleteProduct(productIdToDelete)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          toast({ title: "Ürün başarıyla silindi.", variant: "success" });
        } else {
          toast({
            variant: "destructive",
            title: data.payload?.message || "Ürün silinemedi.",
          });
        }
        closeConfirmationModal();
      });
    }
  }, [dispatch, productIdToDelete, toast, closeConfirmationModal]);

  const isFormValid = useCallback(() => {
    const requiredFields = ["title", "category", "price", "totalStock"];
    const allFieldsFilled = requiredFields.every(
      (key) => formData[key] !== "" && formData[key] !== null
    );
    const imageAvailable = !!formData.image || !!productImageFile;
    const imageRequired = currentEditedId === null;

    return allFieldsFilled && (!imageRequired || imageAvailable);
  }, [formData, productImageFile, currentEditedId]);
  useEffect(() => {
    if (currentEditedId && openCreateProductsDialog) {
      const productToEdit = productList.find(
        (item) => item._id === currentEditedId
      );
      if (productToEdit) {
        setFormData({
          ...initialFormData,
          ...productToEdit,
          category: productToEdit.category?._id || productToEdit.category || "",
          brand: productToEdit.brand?._id || productToEdit.brand || "",
          price: productToEdit.price?.toString() ?? "",
          salePrice: productToEdit.salePrice?.toString() ?? "",
          totalStock: productToEdit.totalStock?.toString() ?? "",
          technicalSpecs: productToEdit.technicalSpecs || [], // Düzenleme için yükle
        });
        setProductImageFile(null);
        setAdditionalImageFiles([]);
      } else {
        setCurrentEditedId(null);
        setFormData(initialFormData);
        setProductImageFile(null);
        setAdditionalImageFiles([]);
      }
    }
  }, [currentEditedId, productList, openCreateProductsDialog]);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllBrands());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const groupedProducts = useMemo(() => {
    if (!productList || productList.length === 0) return {};
    return productList.reduce((acc, product) => {
      const categoryKey =
        product.category?.name || product.category || "Uncategorized";
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(product);
      return acc;
    }, {});
  }, [productList]);

  const categoriesToDisplay = useMemo(() => {
    return Object.keys(groupedProducts)
      .map((categoryId) => {
        const category = categoryList.find((cat) => cat._id === categoryId);
        return {
          id: categoryId,
          name: category
            ? category.name
            : categoryId === "Uncategorized"
            ? "Kategorisiz"
            : categoryId,
          products: groupedProducts[categoryId],
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [groupedProducts, categoryList]);

  const handleEditClick = useCallback(
    (product) => {
      if (!canManage) {
        toast({ variant: "destructive", title: "Bu işlem için yetkiniz yok." });
        return;
      }
      if (product && product._id) {
        setCurrentEditedId(product._id);
        setFormData({
          title: product.title,
          description: product.description,
          category: product.category,
          brand: product.brand,
          price: product.price,
          salePrice: product.salePrice,
          totalStock: product.totalStock,
          image: product.image,
          images: product.images || [], // Ek resimler
          costPrice: product.costPrice,
          technicalSpecs: product.technicalSpecs || [], // Düzenleme için yükle
        });
        setOpenCreateProductsDialog(true);
      } else {
        setCurrentEditedId(null);
        setFormData(initialFormData);
        setProductImageFile(null);
        setAdditionalImageFiles([]);
        setOpenCreateProductsDialog(true);
      }
    },
    [canManage, toast]
  );

  const handleShowDetailsClick = useCallback((product) => {
    setSelectedProductDetails(product);
    setIsDetailsDialogOpen(true);
  }, []);

  const handleDeleteAction = (id) => {
    if (!canManage) {
      toast({ variant: "destructive", title: "Bu işlem için yetkiniz yok." });
      return;
    }
    setProductIdToDelete(id);
    setShowConfirmModal(true);
  };

  const floatingActionButton = canManage ? (
    <div className="mb-4 w-full flex justify-end">
      <Button onClick={() => handleEditClick(null)}>Yeni Ürün Ekle</Button>
    </div>
  ) : null;

  return (
    <Fragment>
      {floatingActionButton}

      <div className="w-full overflow-hidden">
        <div className="space-y-6">
          {listLoading || categoriesLoading ? (
            Array.from({ length: 3 }).map((_, catIndex) => (
              <div
                key={`cat-skel-${catIndex}`}
                className="border rounded-lg shadow-sm bg-white p-4"
              >
                <Skeleton className="h-6 w-1/4 mb-4" />
                <div className="flex space-x-4 overflow-hidden pb-2">
                  {Array.from({ length: 4 }).map((_, prodIndex) => (
                    <div
                      key={`prod-skel-${catIndex}-${prodIndex}`}
                      className="flex-shrink-0 w-60"
                    >
                      <ProductTileSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : categoriesToDisplay.length > 0 ? (
            categoriesToDisplay.map((categoryGroup) => (
              <AdminProductCarousel
                key={categoryGroup.id}
                title={categoryGroup.name}
                products={categoryGroup.products}
                isLoading={false}
                handleEditProduct={handleEditClick}
                handleDeleteProduct={handleDeleteAction}
                handleShowAdminDetails={handleShowDetailsClick}
                canManage={canManage}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              Gösterilecek ürün bulunamadı.
            </p>
          )}
        </div>
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setProductImageFile(null);
          }
          setOpenCreateProductsDialog(isOpen);
        }}
      >
        <SheetContent
          side="right"
          className="w-[90vw] max-w-[700px] sm:w-[700px] flex flex-col"
        >
          <SheetHeader className="p-6 border-b">
            <SheetTitle>
              {currentEditedId !== null ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {/* Resim Yükleme */}
            <ProductImageUpload
              id="product-image-upload"
              imageFile={productImageFile}
              setImageFile={setProductImageFile}
            />
            {/* Mevcut Resim Gösterimi */}
            {currentEditedId !== null &&
              formData.image &&
              !productImageFile && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Mevcut Resim:</p>
                  <img
                    src={formData.image}
                    alt="Mevcut Ürün Resmi"
                    className="h-24 w-auto rounded border"
                  />
                </div>
              )}
            {/* Yüklenme Göstergesi */}
            {productImageLoadingState && (
              <div className="flex items-center text-sm text-blue-600 mt-2">
                <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                <span>Resim yükleniyor...</span>
              </div>
            )}

            {/* Ek Resimler Bölümü */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Ek Resimler</h3>
              
              {/* Ek Resim Yükleme */}
              <div>
                <Label htmlFor="additional-images">Ek Resimler Seç (Çoklu)</Label>
                <Input
                  id="additional-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleAdditionalImageUpload(e.target.files)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Birden fazla resim seçebilirsiniz. JPG, PNG, GIF desteklenir.
                </p>
              </div>

              {/* Ek Resim Yükleme Göstergesi */}
              {additionalImageLoadingState && (
                <div className="flex items-center text-sm text-blue-600">
                  <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                  <span>Ek resimler yükleniyor...</span>
                </div>
              )}

              {/* Yüklenen Ek Resimler */}
              {formData.images && formData.images.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Yüklenen Ek Resimler:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Ek Resim ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Form Alanları */}
              {dynamicFormControls.map((control) => (
                 <div key={control.name} className="space-y-1">
                   <Label htmlFor={control.name}>{control.label}</Label>
                   {control.componentType === 'input' && (
                     <Input
                       type={control.type}
                       id={control.name}
                       name={control.name}
                       placeholder={control.placeholder}
                       value={formData[control.name]}
                       onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
                     />
                   )}
                   {control.componentType === 'textarea' && (
                     <Textarea
                       id={control.name}
                       name={control.name}
                       placeholder={control.placeholder}
                       value={formData[control.name]}
                       onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
                       rows={4}
                     />
                   )}
                   {control.componentType === 'select' && (
                      <select
                        id={control.name}
                        name={control.name}
                        value={formData[control.name]}
                        onChange={(e) => setFormData({ ...formData, [control.name]: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">{control.placeholder}</option>
                        {control.options.map(option => (
                          <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                      </select>
                   )}
                 </div>
              ))}

              {/* Teknik Özellikler Bölümü */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Teknik Özellikler</h3>
                {formData.technicalSpecs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Özellik Adı (örn. Renk)"
                      value={spec.key}
                      onChange={(e) => handleTechSpecChange(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Değer (örn. Kırmızı)"
                      value={spec.value}
                      onChange={(e) => handleTechSpecChange(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeTechSpec(index)}>
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTechSpec} className="w-full">
                  Yeni Özellik Ekle
                </Button>
              </div>

              <Button
                className="mt-4 w-full"
                type="submit"
                disabled={!isFormValid() || productImageLoadingState}
              >
                {productImageLoadingState
                  ? "Resim Yükleniyor..."
                  : currentEditedId
                  ? "Ürünü Güncelle"
                  : "Yeni Ürün Ekle"}
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      <ConfirmationModal
        isOpen={showConfirmModal}
        message="Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDeleteHandler}
        onCancel={closeConfirmationModal}
      />
      <AdminProductDetailsDialog
        open={isDetailsDialogOpen}
        setOpen={setIsDetailsDialogOpen}
        productDetails={selectedProductDetails}
      />
    </Fragment>
  );
}

export default AdminProducts;
