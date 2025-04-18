import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
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
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
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

  // --- Güncellenmiş onSubmit Fonksiyonu ---
  async function onSubmit(event) {
    event.preventDefault();
    let finalImageUrl = formData.image; // Düzenleme için mevcut URL ile başla

    setProductImageLoadingState(true); // Yükleme başladı

    try {
      // 1. Yeni bir dosya seçildiyse, onu yükle
      if (productImageFile) {
        console.log("Yeni ürün resmi yükleniyor...");
        const uploadedUrl = await uploadImage(productImageFile);
        if (!uploadedUrl) {
          // Yükleme başarısız oldu (toast uploadImage içinde gösterildi)
          setProductImageLoadingState(false);
          return; // İşlemi durdur
        }
        finalImageUrl = uploadedUrl; // Başarılıysa yeni URL'i kullan
        console.log("Yeni resim URL'i alındı:", finalImageUrl);
      }

      // 2. Yeni ürün eklerken resim URL'si zorunlu mu kontrol et
      if (!finalImageUrl && currentEditedId === null) {
        toast({
          variant: "warning",
          title: "Lütfen ürün için bir resim seçin.",
        });
        setProductImageLoadingState(false);
        return;
      }

      // 3. Gönderilecek son veriyi hazırla
      const dataToSend = {
        ...formData,
        image: finalImageUrl, // Nihai URL'i kullan
      };

      console.log("Redux'a gönderilecek veri:", dataToSend);

      // 4. Redux action'ını dispatch et (Ekleme veya Güncelleme)
      if (currentEditedId !== null) {
        // Güncelleme
        await dispatch(
          editProduct({ id: currentEditedId, formData: dataToSend })
        ).unwrap(); // unwrap ile sonucu yakala
        // Başarılı olursa formu temizle ve kapat
        dispatch(fetchAllProducts());
        setFormData(initialFormData);
        setProductImageFile(null);
        setOpenCreateProductsDialog(false);
        setCurrentEditedId(null);
        toast({ title: "Ürün başarıyla güncellendi.", variant: "success" });
      } else {
        // Ekleme
        await dispatch(addNewProduct(dataToSend)).unwrap(); // unwrap ile sonucu yakala
        // Başarılı olursa formu temizle ve kapat
        dispatch(fetchAllProducts());
        setOpenCreateProductsDialog(false);
        setProductImageFile(null);
        setFormData(initialFormData);
        toast({ title: "Ürün başarıyla eklendi.", variant: "success" });
      }
    } catch (error) {
      // Dispatch işlemi veya yükleme sonrası hata olursa
      console.error("onSubmit sırasında hata:", error);
      // Redux thunk'ları rejectWithValue ile hata döndürdüğünde error.message anlamlı olabilir
      toast({
        variant: "destructive",
        title: "İşlem Başarısız",
        description: error?.message || "Ürün kaydedilirken bir hata oluştu.",
      });
    } finally {
      setProductImageLoadingState(false); // Yüklemeyi her durumda bitir
    }
  }

  // Silme Fonksiyonu
  function openDeleteConfirmation(productId) {
    console.log("Silme onayı açılıyor, ID:", productId); // Debug
    setProductIdToDelete(productId); // Silinecek ID'yi state'e kaydet
    setShowConfirmModal(true); // Modalı aç
  }
  // 2. Modal kapatma fonksiyonu
  function closeConfirmationModal() {
    setShowConfirmModal(false); // Modalı kapat
    setProductIdToDelete(null); // ID'yi sıfırla
  }
  // 3. Modal onaylandığında çalışacak fonksiyon
  function confirmDeleteHandler() {
    if (productIdToDelete) {
      console.log("Silme işlemi onaylandı, ID:", productIdToDelete); // Debug
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
    closeConfirmationModal(); // İşlem sonrası modalı kapat
  }
  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  // Düzenleme modu için formu doldurma
  useEffect(() => {
    if (currentEditedId && openCreateProductsDialog) {
      // Dialog açıkken ve ID varsa
      const productToEdit = productList.find(
        (item) => item._id === currentEditedId
      );
      if (productToEdit) {
        console.log(
          "Düzenlenecek ürün verisi forma yükleniyor:",
          productToEdit
        );
        setFormData(productToEdit);
        // Düzenleme başlarken seçili dosyayı temizle, sadece mevcut URL (formData.image) kullanılır
        setProductImageFile(null);
      }
    } else if (!openCreateProductsDialog) {
      // Dialog kapandığında temizle
      setCurrentEditedId(null);
      setFormData(initialFormData);
      setProductImageFile(null);
    }
  }, [currentEditedId, productList, openCreateProductsDialog]); // openCreateProductsDialog bağımlılığı eklendi

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(formData, "productList");

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button
          onClick={() => {
            setCurrentEditedId(null); // Düzenleme modunu
            setFormData(initialFormData); // Formu sıfırla
            setProductImageFile(null); // Seçili dosyayı
            setOpenCreateProductsDialog(true); // Dialog'u aç
          }}
        >
          Yeni Ürün Ekle
        </Button>
      </div>
      {/* Ürün Listesi */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {listLoading ? ( // Liste yüklenirken Skeleton göster
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="w-full max-w-xs mx-auto space-y-2 border p-2 rounded-lg"
            >
              <Skeleton className="h-[300px] w-full rounded-t-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))
        ) : productList && productList.length > 0 ? (
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={openDeleteConfirmation}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Gösterilecek ürün bulunamadı.
          </p> // Boş liste mesajı
        )}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(isOpen) => {
          // Kapatıldığında state'leri temizle
          if (!isOpen) {
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setProductImageFile(null);
          }
          setOpenCreateProductsDialog(isOpen);
        }}
      >
        {/* Sheet içeriği genişletildi ve overflow eklendi */}
        <SheetContent
          side="right"
          className="w-[600px] sm:w-[700px] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </SheetTitle>
          </SheetHeader>

          {/* Güncellenmiş ProductImageUpload Kullanımı */}
          <ProductImageUpload
            id="product-image-upload" // Benzersiz ID
            imageFile={productImageFile} // Seçilen dosya state'i
            setImageFile={setProductImageFile} // Dosya state'ini güncelleyen fonksiyon
            isEditMode={currentEditedId !== null}
          />
          {/* Mevcut resmi (düzenleme modunda) gösterme */}
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
          {/* Yükleme göstergesi */}
          {productImageLoadingState && (
            <p className="text-sm text-blue-600 mt-2">Resim yükleniyor...</p>
          )}

          {/* Form */}
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Güncelle" : "Ekle"}
              formControls={addProductFormElements}
              // Buton disable koşulu güncellendi
              // isBtnDisabled={
              //   productImageLoadingState ||
              //   !isFormValid() ||
              //   (currentEditedId === null && !productImageFile)
              // } // Yeni ürün eklerken resim seçilmiş olmalı
            />
          </div>
        </SheetContent>
      </Sheet>
      <ConfirmationModal
        isOpen={showConfirmModal} // Modalı kontrol eden state
        onClose={closeConfirmationModal}
        onConfirm={confirmDeleteHandler}
        onCancel={closeConfirmationModal}
        title="Ürünü Silme Onayı"
        message="Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
      />
    </Fragment>
  );
}

export default AdminProducts;
