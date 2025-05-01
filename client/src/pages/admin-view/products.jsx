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
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AdminProductCarousel from "@/components/admin-view/AdminProductCarousel";
import AdminProductDetailsDialog from "@/components/admin-view/AdminProductDetailsDialog";
import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";

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
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [productImageFile, setProductImageFile] = useState(null);
  const [productImageLoadingState, setProductImageLoadingState] =
    useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const { productList, isLoading: listLoading } = useSelector(
    (state) => state.adminProducts
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const uploadImage = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("my_file", file);
    console.log("Ürün resmi yükleniyor..."); // Log
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image", // Endpoint doğru mu?
        data
      );
      if (response?.data?.success && response.data.result?.url) {
        console.log("Ürün resmi yüklendi, URL:", response.data.result.url); // Log
        return response.data.result.url;
      } else {
        throw new Error(
          response?.data?.message || "Resim API yanıtı başarısız."
        );
      }
    } catch (error) {
      console.error("Ürün resmi yükleme hatası:", error);
      toast({
        variant: "destructive",
        title: "Resim Yükleme Hatası",
        description:
          error?.response?.data?.message || error.message || "Bilinmeyen hata.",
      });
      return null;
    }
  };

  async function onSubmit(event) {
    event.preventDefault();
    let finalImageUrl = formData.image;
    setProductImageLoadingState(true);
    try {
      if (productImageFile) {
        console.log("Yeni ürün resmi yükleniyor...");
        const uploadedUrl = await uploadImage(productImageFile);
        if (!uploadedUrl) {
          setProductImageLoadingState(false);
          return;
        }
        finalImageUrl = uploadedUrl;
        console.log("Yeni resim URL'i alındı:", finalImageUrl);
      }
      if (!finalImageUrl && currentEditedId === null) {
        toast({
          variant: "warning",
          title: "Lütfen ürün için bir resim seçin.",
        });
        setProductImageLoadingState(false);
        return;
      }
      const dataToSend = {
        ...formData,
        image: finalImageUrl,
      };
      console.log("Redux'a gönderilecek veri:", dataToSend);
      if (currentEditedId !== null) {
        await dispatch(
          editProduct({ id: currentEditedId, formData: dataToSend })
        ).unwrap();
        dispatch(fetchAllProducts());
        setFormData(initialFormData);
        setProductImageFile(null);
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null);
        toast({ title: "Ürün başarıyla güncellendi.", variant: "success" });
      } else {
        await dispatch(addNewProduct(dataToSend)).unwrap();
        dispatch(fetchAllProducts());
        setOpenCreateProductsDialog(false);
        setProductImageFile(null);
        setFormData(initialFormData);
        toast({ title: "Ürün başarıyla eklendi.", variant: "success" });
      }
    } catch (error) {
      console.error("onSubmit sırasında hata:", error);
      toast({
        variant: "destructive",
        title: "İşlem Başarısız",
        description: error?.message || "Ürün kaydedilirken bir hata oluştu.",
      });
    } finally {
      setProductImageLoadingState(false);
    }
  }

  function openDeleteConfirmation(productId) {
    console.log("Silme onayı açılıyor, ID:", productId);
    setProductIdToDelete(productId);
    setShowConfirmModal(true);
  }

  function closeConfirmationModal() {
    setShowConfirmModal(false);
    setProductIdToDelete(null);
  }
  function confirmDeleteHandler() {
    if (productIdToDelete) {
      console.log("Silme işlemi onaylandı, ID:", productIdToDelete);
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
      });
    }
    closeConfirmationModal();
  }
  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }
  useEffect(() => {
    if (currentEditedId && openCreateProductsDialog) {
      const productToEdit = productList.find(
        (item) => item._id === currentEditedId
      );
      if (productToEdit) {
        console.log(
          "Düzenlenecek ürün verisi forma yükleniyor:",
          productToEdit
        );
        setFormData(productToEdit);
        setProductImageFile(null);
      }
    } else if (!openCreateProductsDialog) {
      setCurrentEditedId(null);
      setFormData(initialFormData);
      setProductImageFile(null);
    }
  }, [currentEditedId, productList, openCreateProductsDialog]);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // --- YENİ: Ürünleri kategoriye göre gruplama ---
  const groupedProducts = useMemo(() => {
    if (!productList || productList.length === 0) return {};
    return productList.reduce((acc, product) => {
      const category = product.category || "Uncategorized"; // Kategorisiz ürünler için
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [productList]);

  const categories = Object.keys(groupedProducts).sort();
  const handleEditClick = (product) => {
    if (!product) return;
    setCurrentEditedId(product._id);
    setFormData({
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      totalStock: product.totalStock || "",
      averageReview: product.averageReview || 0,
      image: product.image || "",
    });
    setProductImageFile(null);
    setOpenCreateProductsDialog(true);
  };

  const handleShowDetailsClick = (product) => {
    setSelectedProductDetails(product);
    setIsDetailsDialogOpen(true);
  };
  console.log(formData, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => handleEditClick(null)}>Yeni Ürün Ekle</Button>
      </div>

      {/* --- YENİ: Kategori Carousel Gösterimi --- */}
      <div className="space-y-8">
        {listLoading ? (
          Array.from({ length: 3 }).map((_, catIndex) => (
            <div key={`cat-skel-${catIndex}`} className="space-y-4">
              <Skeleton className="h-8 w-1/4" />
              <div className="flex space-x-4 overflow-hidden pb-4">
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
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <AdminProductCarousel
              key={category}
              title={category} // Kategori adını başlık olarak ver
              products={groupedProducts[category]} // O kategoriye ait ürünleri ver
              isLoading={listLoading} // Carousel içi yükleme (şu an genel state kullanılıyor)
              handleEditProduct={handleEditClick} // Düzenleme fonksiyonunu ilet
              handleDeleteProduct={openDeleteConfirmation} // Silme fonksiyonunu ilet
              handleShowAdminDetails={handleShowDetailsClick} // Detay gösterme fonksiyonunu ilet
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            Gösterilecek ürün bulunamadı.
          </p>
        )}
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
          className="w-[600px] sm:w-[700px] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            id="product-image-upload"
            imageFile={productImageFile}
            setImageFile={setProductImageFile}
            // Düzenleme modunda resim alanı disabled olmamalı, yeni resim yüklenebilmeli
            // isEditMode={currentEditedId !== null}
          />
          {currentEditedId !== null && formData.image && !productImageFile && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Mevcut Resim:</p>
              <img
                src={formData.image}
                alt="Mevcut Ürün Resmi"
                className="h-24 w-auto rounded border"
              />
            </div>
          )}
          {productImageLoadingState && (
            <p className="text-sm text-blue-600 mt-2">Resim yükleniyor...</p>
          )}
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Güncelle" : "Ekle"}
              formControls={addProductFormElements}
              isBtnDisabled={
                productImageLoadingState ||
                !isFormValid() ||
                (currentEditedId === null &&
                  !productImageFile &&
                  !formData.image)
              }
            />
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={closeConfirmationModal}
        onConfirm={confirmDeleteHandler}
        onCancel={closeConfirmationModal}
        message="Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
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
