// import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
// import ProductImageUpload from "@/components/admin-view/image-upload";
// import CommonForm from "@/components/common/form";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { useToast } from "@/components/ui/use-toast";
// import { Skeleton } from "@/components/ui/skeleton";
// import { addProductFormElements } from "@/config";
// import {
//   addNewProduct,
//   deleteProduct,
//   editProduct,
//   fetchAllProducts,
// } from "@/store/admin/products-slice";
// import { Fragment, useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import AdminProductCarousel from "@/components/admin-view/AdminProductCarousel";
// import AdminProductDetailsDialog from "@/components/admin-view/AdminProductDetailsDialog";
// import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";

// const initialFormData = {
//   title: "",
//   description: "",
//   category: "",
//   brand: "",
//   price: "",
//   salePrice: "",
//   totalStock: "",
//   averageReview: 0,
//   image: "",
// };

// function AdminProducts() {
//   const [openCreateProductsDialog, setOpenCreateProductsDialog] =
//     useState(false);
//   const [formData, setFormData] = useState(initialFormData);

//   const [productImageFile, setProductImageFile] = useState(null);
//   const [productImageLoadingState, setProductImageLoadingState] =
//     useState(false);
//   const [currentEditedId, setCurrentEditedId] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [productIdToDelete, setProductIdToDelete] = useState(null);
//   const { productList, isLoading: listLoading } = useSelector(
//     (state) => state.adminProducts
//   );
//   const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
//   const [selectedProductDetails, setSelectedProductDetails] = useState(null);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   const uploadImage = async (file) => {
//     if (!file) return null;
//     const data = new FormData();
//     data.append("my_file", file);
//     console.log("Ürün resmi yükleniyor..."); // Log
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/products/upload-image", // Endpoint doğru mu?
//         data
//       );
//       if (response?.data?.success && response.data.result?.url) {
//         console.log("Ürün resmi yüklendi, URL:", response.data.result.url); // Log
//         return response.data.result.url;
//       } else {
//         throw new Error(
//           response?.data?.message || "Resim API yanıtı başarısız."
//         );
//       }
//     } catch (error) {
//       console.error("Ürün resmi yükleme hatası:", error);
//       toast({
//         variant: "destructive",
//         title: "Resim Yükleme Hatası",
//         description:
//           error?.response?.data?.message || error.message || "Bilinmeyen hata.",
//       });
//       return null;
//     }
//   };

//   async function onSubmit(event) {
//     event.preventDefault();
//     let finalImageUrl = formData.image;
//     setProductImageLoadingState(true);
//     try {
//       if (productImageFile) {
//         console.log("Yeni ürün resmi yükleniyor...");
//         const uploadedUrl = await uploadImage(productImageFile);
//         if (!uploadedUrl) {
//           setProductImageLoadingState(false);
//           return;
//         }
//         finalImageUrl = uploadedUrl;
//         console.log("Yeni resim URL'i alındı:", finalImageUrl);
//       }
//       if (!finalImageUrl && currentEditedId === null) {
//         toast({
//           variant: "warning",
//           title: "Lütfen ürün için bir resim seçin.",
//         });
//         setProductImageLoadingState(false);
//         return;
//       }
//       const dataToSend = {
//         ...formData,
//         image: finalImageUrl,
//       };
//       console.log("Redux'a gönderilecek veri:", dataToSend);
//       if (currentEditedId !== null) {
//         await dispatch(
//           editProduct({ id: currentEditedId, formData: dataToSend })
//         ).unwrap();
//         dispatch(fetchAllProducts());
//         setFormData(initialFormData);
//         setProductImageFile(null);
//         setOpenCreateProductsDialog(false);
//         setCurrentEditedId(null);
//         toast({ title: "Ürün başarıyla güncellendi.", variant: "success" });
//       } else {
//         await dispatch(addNewProduct(dataToSend)).unwrap();
//         dispatch(fetchAllProducts());
//         setOpenCreateProductsDialog(false);
//         setProductImageFile(null);
//         setFormData(initialFormData);
//         toast({ title: "Ürün başarıyla eklendi.", variant: "success" });
//       }
//     } catch (error) {
//       console.error("onSubmit sırasında hata:", error);
//       toast({
//         variant: "destructive",
//         title: "İşlem Başarısız",
//         description: error?.message || "Ürün kaydedilirken bir hata oluştu.",
//       });
//     } finally {
//       setProductImageLoadingState(false);
//     }
//   }

//   function openDeleteConfirmation(productId) {
//     console.log("Silme onayı açılıyor, ID:", productId);
//     setProductIdToDelete(productId);
//     setShowConfirmModal(true);
//   }

//   function closeConfirmationModal() {
//     setShowConfirmModal(false);
//     setProductIdToDelete(null);
//   }
//   function confirmDeleteHandler() {
//     if (productIdToDelete) {
//       console.log("Silme işlemi onaylandı, ID:", productIdToDelete);
//       dispatch(deleteProduct(productIdToDelete)).then((data) => {
//         if (data?.payload?.success) {
//           dispatch(fetchAllProducts());
//           toast({ title: "Ürün başarıyla silindi.", variant: "success" });
//         } else {
//           toast({
//             variant: "destructive",
//             title: data.payload?.message || "Ürün silinemedi.",
//           });
//         }
//       });
//     }
//     closeConfirmationModal();
//   }
//   function isFormValid() {
//     return Object.keys(formData)
//       .filter((currentKey) => currentKey !== "averageReview")
//       .map((key) => formData[key] !== "")
//       .every((item) => item);
//   }
//   useEffect(() => {
//     if (currentEditedId && openCreateProductsDialog) {
//       const productToEdit = productList.find(
//         (item) => item._id === currentEditedId
//       );
//       if (productToEdit) {
//         console.log(
//           "Düzenlenecek ürün verisi forma yükleniyor:",
//           productToEdit
//         );
//         setFormData(productToEdit);
//         setProductImageFile(null);
//       }
//     } else if (!openCreateProductsDialog) {
//       setCurrentEditedId(null);
//       setFormData(initialFormData);
//       setProductImageFile(null);
//     }
//   }, [currentEditedId, productList, openCreateProductsDialog]);

//   useEffect(() => {
//     dispatch(fetchAllProducts());
//   }, [dispatch]);

//   // --- YENİ: Ürünleri kategoriye göre gruplama ---
//   const groupedProducts = useMemo(() => {
//     if (!productList || productList.length === 0) return {};
//     return productList.reduce((acc, product) => {
//       const category = product.category || "Uncategorized"; // Kategorisiz ürünler için
//       if (!acc[category]) {
//         acc[category] = [];
//       }
//       acc[category].push(product);
//       return acc;
//     }, {});
//   }, [productList]);

//   const categories = Object.keys(groupedProducts).sort();
//   const handleEditClick = (product) => {
//     if (!product) return;
//     setCurrentEditedId(product._id);
//     setFormData({
//       title: product.title || "",
//       description: product.description || "",
//       category: product.category || "",
//       brand: product.brand || "",
//       price: product.price || "",
//       salePrice: product.salePrice || "",
//       totalStock: product.totalStock || "",
//       averageReview: product.averageReview || 0,
//       image: product.image || "",
//     });
//     setProductImageFile(null);
//     setOpenCreateProductsDialog(true);
//   };

//   const handleShowDetailsClick = (product) => {
//     setSelectedProductDetails(product);
//     setIsDetailsDialogOpen(true);
//   };
//   console.log(formData, "productList");

//   return (
//     <Fragment>
//       <div className="mb-4 w-full flex justify-end">
//         <Button onClick={() => handleEditClick(null)}>Yeni Ürün Ekle</Button>
//       </div>
//       <div className="space-y-0">
//         {listLoading ? (
//           Array.from({ length: 3 }).map((_, catIndex) => (
//             <div key={`cat-skel-${catIndex}`} className="space-y-4">
//               <Skeleton className="h-8 w-1/4" />
//               <div className="flex space-x-4 overflow-hidden pb-4">
//                 {Array.from({ length: 4 }).map((_, prodIndex) => (
//                   <div
//                     key={`prod-skel-${catIndex}-${prodIndex}`}
//                     className="flex-shrink-0 w-60"
//                   >
//                     <ProductTileSkeleton />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         ) : categories.length > 0 ? (
//           categories.map((category) => (
//             <AdminProductCarousel
//               key={category}
//               title={category} // Kategori adını başlık olarak ver
//               products={groupedProducts[category]} // O kategoriye ait ürünleri ver
//               isLoading={listLoading} // Carousel içi yükleme (şu an genel state kullanılıyor)
//               handleEditProduct={handleEditClick} // Düzenleme fonksiyonunu ilet
//               handleDeleteProduct={openDeleteConfirmation} // Silme fonksiyonunu ilet
//               handleShowAdminDetails={handleShowDetailsClick} // Detay gösterme fonksiyonunu
//             />
//           ))
//         ) : (
//           <p className="text-center text-gray-500 py-10">
//             Gösterilecek ürün bulunamadı.
//           </p>
//         )}
//       </div>

//       <Sheet
//         open={openCreateProductsDialog}
//         onOpenChange={(isOpen) => {
//           if (!isOpen) {
//             setCurrentEditedId(null);
//             setFormData(initialFormData);
//             setProductImageFile(null);
//           }
//           setOpenCreateProductsDialog(isOpen);
//         }}
//       >
//         <SheetContent
//           side="right"
//           className="w-[600px] sm:w-[700px] overflow-y-auto"
//         >
//           <SheetHeader>
//             <SheetTitle>
//               {currentEditedId !== null ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
//             </SheetTitle>
//           </SheetHeader>
//           <ProductImageUpload
//             id="product-image-upload"
//             imageFile={productImageFile}
//             setImageFile={setProductImageFile}
//             // Düzenleme modunda resim alanı disabled olmamalı, yeni resim yüklenebilmeli
//             // isEditMode={currentEditedId !== null}
//           />
//           {currentEditedId !== null && formData.image && !productImageFile && (
//             <div className="mt-2">
//               <p className="text-sm font-medium mb-1">Mevcut Resim:</p>
//               <img
//                 src={formData.image}
//                 alt="Mevcut Ürün Resmi"
//                 className="h-24 w-auto rounded border"
//               />
//             </div>
//           )}
//           {productImageLoadingState && (
//             <p className="text-sm text-blue-600 mt-2">Resim yükleniyor...</p>
//           )}
//           <div className="py-6">
//             <CommonForm
//               onSubmit={onSubmit}
//               formData={formData}
//               setFormData={setFormData}
//               buttonText={currentEditedId !== null ? "Güncelle" : "Ekle"}
//               formControls={addProductFormElements}
//               isBtnDisabled={
//                 productImageLoadingState ||
//                 !isFormValid() ||
//                 (currentEditedId === null &&
//                   !productImageFile &&
//                   !formData.image)
//               }
//             />
//           </div>
//         </SheetContent>
//       </Sheet>

//       <ConfirmationModal
//         isOpen={showConfirmModal}
//         onClose={closeConfirmationModal}
//         onConfirm={confirmDeleteHandler}
//         onCancel={closeConfirmationModal}
//         message="Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
//       />

//       <AdminProductDetailsDialog
//         open={isDetailsDialogOpen}
//         setOpen={setIsDetailsDialogOpen}
//         productDetails={selectedProductDetails}
//       />
//     </Fragment>
//   );
// }

// export default AdminProducts;

// src/pages/admin-view/products.jsx

// import ConfirmationModal from "@/components/admin-view/ConfirmationModal";
// import ProductImageUpload from "@/components/admin-view/image-upload";
// import CommonForm from "@/components/common/form";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { useToast } from "@/components/ui/use-toast";
// import { Skeleton } from "@/components/ui/skeleton";
// import { addProductFormElements } from "@/config";
// import {
//   addNewProduct,
//   deleteProduct,
//   editProduct,
//   fetchAllProducts,
// } from "@/store/admin/products-slice";
// import { Fragment, useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import AdminProductCarousel from "@/components/admin-view/AdminProductCarousel"; // Güncellenmiş Carousel'ı import et
// import AdminProductDetailsDialog from "@/components/admin-view/AdminProductDetailsDialog";
// import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";

// const initialFormData = {
//   title: "",
//   description: "",
//   category: "",
//   brand: "",
//   price: "",
//   salePrice: "",
//   totalStock: "",
//   averageReview: 0,
//   image: "",
// };

// function AdminProducts() {
//   // ... (Mevcut state ve fonksiyonlarınız aynı kalacak) ...
//   const [openCreateProductsDialog, setOpenCreateProductsDialog] =
//     useState(false);
//   const [formData, setFormData] = useState(initialFormData);
//   const [productImageFile, setProductImageFile] = useState(null);
//   const [productImageLoadingState, setProductImageLoadingState] =
//     useState(false);
//   const [currentEditedId, setCurrentEditedId] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [productIdToDelete, setProductIdToDelete] = useState(null);
//   const { productList, isLoading: listLoading } = useSelector(
//     (state) => state.adminProducts
//   );
//   const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
//   const [selectedProductDetails, setSelectedProductDetails] = useState(null);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   // --- onSubmit, uploadImage, openDeleteConfirmation vb. fonksiyonlar aynı ---
//   const uploadImage = async (file) => {
//     if (!file) return null;
//     const data = new FormData();
//     data.append("my_file", file);
//     console.log("Ürün resmi yükleniyor..."); // Log
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/admin/products/upload-image", // Endpoint doğru mu?
//         data
//       );
//       if (response?.data?.success && response.data.result?.url) {
//         console.log("Ürün resmi yüklendi, URL:", response.data.result.url); // Log
//         return response.data.result.url;
//       } else {
//         throw new Error(
//           response?.data?.message || "Resim API yanıtı başarısız."
//         );
//       }
//     } catch (error) {
//       console.error("Ürün resmi yükleme hatası:", error);
//       toast({
//         variant: "destructive",
//         title: "Resim Yükleme Hatası",
//         description:
//           error?.response?.data?.message || error.message || "Bilinmeyen hata.",
//       });
//       return null;
//     }
//   };

//   async function onSubmit(event) {
//     event.preventDefault();
//     let finalImageUrl = formData.image;
//     setProductImageLoadingState(true);
//     try {
//       if (productImageFile) {
//         console.log("Yeni ürün resmi yükleniyor...");
//         const uploadedUrl = await uploadImage(productImageFile);
//         if (!uploadedUrl) {
//           setProductImageLoadingState(false);
//           return;
//         }
//         finalImageUrl = uploadedUrl;
//         console.log("Yeni resim URL'i alındı:", finalImageUrl);
//       }
//       if (!finalImageUrl && currentEditedId === null) {
//         toast({
//           variant: "warning",
//           title: "Lütfen ürün için bir resim seçin.",
//         });
//         setProductImageLoadingState(false);
//         return;
//       }
//       const dataToSend = {
//         ...formData,
//         image: finalImageUrl,
//       };
//       console.log("Redux'a gönderilecek veri:", dataToSend);
//       if (currentEditedId !== null) {
//         await dispatch(
//           editProduct({ id: currentEditedId, formData: dataToSend })
//         ).unwrap();
//         dispatch(fetchAllProducts());
//         setFormData(initialFormData);
//         setProductImageFile(null);
//         setOpenCreateProductsDialog(false);
//         setCurrentEditedId(null);
//         toast({ title: "Ürün başarıyla güncellendi.", variant: "success" });
//       } else {
//         await dispatch(addNewProduct(dataToSend)).unwrap();
//         dispatch(fetchAllProducts());
//         setOpenCreateProductsDialog(false);
//         setProductImageFile(null);
//         setFormData(initialFormData);
//         toast({ title: "Ürün başarıyla eklendi.", variant: "success" });
//       }
//     } catch (error) {
//       console.error("onSubmit sırasında hata:", error);
//       toast({
//         variant: "destructive",
//         title: "İşlem Başarısız",
//         description: error?.message || "Ürün kaydedilirken bir hata oluştu.",
//       });
//     } finally {
//       setProductImageLoadingState(false);
//     }
//   }

//   function openDeleteConfirmation(productId) {
//     console.log("Silme onayı açılıyor, ID:", productId);
//     setProductIdToDelete(productId);
//     setShowConfirmModal(true);
//   }

//   function closeConfirmationModal() {
//     setShowConfirmModal(false);
//     setProductIdToDelete(null);
//   }
//   function confirmDeleteHandler() {
//     if (productIdToDelete) {
//       console.log("Silme işlemi onaylandı, ID:", productIdToDelete);
//       dispatch(deleteProduct(productIdToDelete)).then((data) => {
//         if (data?.payload?.success) {
//           dispatch(fetchAllProducts());
//           toast({ title: "Ürün başarıyla silindi.", variant: "success" });
//         } else {
//           toast({
//             variant: "destructive",
//             title: data.payload?.message || "Ürün silinemedi.",
//           });
//         }
//       });
//     }
//     closeConfirmationModal();
//   }
//   function isFormValid() {
//     // Price ve totalStock'u sayıya çevirerek kontrol et
//     const priceAsNumber = parseFloat(formData.price);
//     const stockAsNumber = parseInt(formData.totalStock, 10);

//     // salePrice opsiyonel olduğu için kontrol dışı bırakılabilir veya
//     // varsa sayı olup olmadığı kontrol edilebilir.
//     const isSalePriceValid =
//       formData.salePrice === "" || !isNaN(parseFloat(formData.salePrice));

//     const otherFieldsValid = Object.keys(formData)
//       // Kontrol edilecek zorunlu alanlar (averageReview, image, salePrice hariç)
//       .filter((key) => !["averageReview", "image", "salePrice"].includes(key))
//       .every((key) => formData[key] !== "" && formData[key] !== null); // null kontrolü de ekle

//     // Price ve totalStock'un geçerli sayılar olup olmadığını kontrol et
//     const numbersValid =
//       !isNaN(priceAsNumber) &&
//       priceAsNumber > 0 &&
//       !isNaN(stockAsNumber) &&
//       Number.isInteger(stockAsNumber) &&
//       stockAsNumber >= 0;

//     return otherFieldsValid && numbersValid && isSalePriceValid;
//   }

//   useEffect(() => {
//     if (currentEditedId && openCreateProductsDialog) {
//       const productToEdit = productList.find(
//         (item) => item._id === currentEditedId
//       );
//       if (productToEdit) {
//         console.log(
//           "Düzenlenecek ürün verisi forma yükleniyor:",
//           productToEdit
//         );
//         // Form state'ini güncellerken sayısal alanları string'e çevir
//         setFormData({
//           ...initialFormData, // Önce varsayılan değerleri al
//           ...productToEdit, // Sonra mevcut ürün verilerini üzerine yaz
//           price: productToEdit.price?.toString() ?? "", // Sayıyı string'e çevir veya boş string
//           salePrice: productToEdit.salePrice?.toString() ?? "",
//           totalStock: productToEdit.totalStock?.toString() ?? "",
//         });
//         setProductImageFile(null); // Resim dosyasını temizle
//       } else {
//         // Eğer ürün bulunamazsa formu sıfırla (güvenlik önlemi)
//         setCurrentEditedId(null);
//         setFormData(initialFormData);
//         setProductImageFile(null);
//       }
//     } else if (!openCreateProductsDialog && currentEditedId !== null) {
//       // Dialog kapandığında ve düzenleme modundaysa sıfırla
//       setCurrentEditedId(null);
//       setFormData(initialFormData);
//       setProductImageFile(null);
//     }
//   }, [currentEditedId, productList, openCreateProductsDialog]);

//   useEffect(() => {
//     dispatch(fetchAllProducts());
//   }, [dispatch]);

//   const groupedProducts = useMemo(() => {
//     if (!productList || productList.length === 0) return {};
//     return productList.reduce((acc, product) => {
//       const category = product.category || "Uncategorized"; // Kategorisiz ürünler için
//       if (!acc[category]) {
//         acc[category] = [];
//       }
//       acc[category].push(product);
//       return acc;
//     }, {});
//   }, [productList]);

//   const categories = Object.keys(groupedProducts).sort();

//   // handleEditClick fonksiyonu product objesini veya null almalı
//   const handleEditClick = (product = null) => {
//     // Varsayılan değeri null yap
//     if (product && product._id) {
//       // Düzenleme modu
//       setCurrentEditedId(product._id); // State'i ayarla (useEffect tetiklenecek)
//       setOpenCreateProductsDialog(true); // Dialog'u aç
//     } else {
//       // Ekleme modu
//       setCurrentEditedId(null);
//       setFormData(initialFormData); // Formu sıfırla
//       setProductImageFile(null);
//       setOpenCreateProductsDialog(true); // Dialog'u aç
//     }
//   };

//   const handleShowDetailsClick = (product) => {
//     setSelectedProductDetails(product);
//     setIsDetailsDialogOpen(true);
//   };
//   console.log(formData, "productList");
//   return (
//     <Fragment>
//       <div className="mb-4 w-full flex justify-end">
//         {/* handleEditClick'e null göndererek ekleme modunu başlat */}
//         <Button onClick={() => handleEditClick(null)}>Yeni Ürün Ekle</Button>
//       </div>

//       {/* Carousel'ları içeren ana alan */}
//       {/* Bu div'in genişliğini sınırlamak ve taşmayı önlemek önemli */}
//       <div className="w-full overflow-hidden">
//         {" "}
//         {/* Ebeveyn div'e overflow-hidden ekle */}
//         <div className="space-y-6">
//           {" "}
//           {/* Carousel'lar arası boşluk */}
//           {listLoading ? (
//             // --- Skeleton Yükleme Gösterimi ---
//             Array.from({ length: 3 }).map((_, catIndex) => (
//               <div
//                 key={`cat-skel-${catIndex}`}
//                 className="border rounded-lg shadow-sm bg-white p-4"
//               >
//                 <Skeleton className="h-6 w-1/4 mb-4" />
//                 <div className="flex space-x-4 overflow-hidden pb-2">
//                   {Array.from({ length: 4 }).map((_, prodIndex) => (
//                     <div
//                       key={`prod-skel-${catIndex}-${prodIndex}`}
//                       className="flex-shrink-0 w-60"
//                     >
//                       <ProductTileSkeleton />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))
//           ) : categories.length > 0 ? (
//             // --- Ürün Carousel'ları ---
//             categories.map((category) => (
//               <AdminProductCarousel
//                 key={category}
//                 title={category}
//                 products={groupedProducts[category]}
//                 isLoading={false} // Artık genel loading bitti
//                 handleEditProduct={handleEditClick} // handleEditClick'i doğru şekilde ilet
//                 handleDeleteProduct={openDeleteConfirmation}
//                 handleShowAdminDetails={handleShowDetailsClick}
//               />
//             ))
//           ) : (
//             // --- Ürün Yok Mesajı ---
//             <p className="text-center text-gray-500 py-10">
//               Gösterilecek ürün bulunamadı.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* --- Sheet (Ürün Ekleme/Düzenleme Formu) --- */}
//       <Sheet
//         open={openCreateProductsDialog}
//         onOpenChange={(isOpen) => {
//           if (!isOpen) {
//             setCurrentEditedId(null); // Dialog kapanınca ID'yi sıfırla
//             setFormData(initialFormData); // Formu temizle
//             setProductImageFile(null); // Resmi temizle
//           }
//           setOpenCreateProductsDialog(isOpen);
//         }}
//       >
//         <SheetContent
//           side="right"
//           // Daha geniş ve kaydırılabilir yap
//           className="w-[90vw] max-w-[700px] sm:w-[700px] flex flex-col"
//         >
//           <SheetHeader className="p-6 border-b">
//             <SheetTitle>
//               {currentEditedId !== null ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
//             </SheetTitle>
//           </SheetHeader>

//           {/* İçerik Alanı (Kaydırılabilir) */}
//           <div className="flex-grow overflow-y-auto p-6 space-y-4">
//             {/* Resim Yükleme */}
//             <ProductImageUpload
//               id="product-image-upload"
//               imageFile={productImageFile}
//               setImageFile={setProductImageFile}
//               // isEditMode artık gerekli değil, her zaman yüklenebilir olmalı
//             />
//             {/* Mevcut Resim Gösterimi (Düzenleme Modunda) */}
//             {currentEditedId !== null &&
//               formData.image &&
//               !productImageFile && (
//                 <div className="mt-2">
//                   <p className="text-sm font-medium mb-1">Mevcut Resim:</p>
//                   <img
//                     src={formData.image}
//                     alt="Mevcut Ürün Resmi"
//                     className="h-24 w-auto rounded border"
//                   />
//                 </div>
//               )}
//             {productImageLoadingState && (
//               <p className="text-sm text-blue-600 mt-2">Resim yükleniyor...</p>
//             )}

//             {/* Form */}
//             <CommonForm
//               onSubmit={onSubmit}
//               formData={formData}
//               setFormData={setFormData}
//               buttonText={currentEditedId !== null ? "Güncelle" : "Ekle"}
//               formControls={addProductFormElements}
//               isBtnDisabled={
//                 productImageLoadingState ||
//                 !isFormValid() ||
//                 // Yeni ürün eklerken resim zorunluluğu kontrolü
//                 (currentEditedId === null &&
//                   !productImageFile &&
//                   !formData.image)
//               }
//             />
//           </div>
//         </SheetContent>
//       </Sheet>

//       {/* --- Confirmation Modal --- */}
//       <ConfirmationModal
//         isOpen={showConfirmModal}
//         message="Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
//         onConfirm={confirmDeleteHandler}
//         onCancel={closeConfirmationModal}
//       />

//       {/* --- Product Details Dialog --- */}
//       <AdminProductDetailsDialog
//         open={isDetailsDialogOpen}
//         setOpen={setIsDetailsDialogOpen}
//         productDetails={selectedProductDetails}
//       />
//     </Fragment>
//   );
// }

// export default AdminProducts;

// client/src/pages/admin-view/products.jsx
import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react"; // useCallback ekle
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
import { addProductFormElements as initialFormElements } from "@/config"; // Başlangıç config'i al
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AdminProductCarousel from "@/components/admin-view/AdminProductCarousel";
import AdminProductDetailsDialog from "@/components/admin-view/AdminProductDetailsDialog";
import ProductTileSkeleton from "@/components/shopping-view/product-tile-skeleton.jsx";
import { fetchAllCategories } from "@/store/common-slice/categories-slice";

import { fetchAllBrands } from "@/store/common-slice/brands-slice";

const initialFormData = {
  title: "",
  description: "",
  category: "", // Artık ObjectId olacak
  brand: "", // Bu da ObjectId olabilir ileride
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  image: "",
};

function AdminProducts() {
  // ... (mevcut state'ler: openCreateProductsDialog, formData, productImageFile vb.) ...
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

  // Kategori state'ini Redux'tan al
  const { categoryList = [], isLoading: categoriesLoading } = useSelector(
    (state) => state.categories || { categoryList: [], isLoading: false }
  );
  const { brandList = [], isLoading: brandsLoading } = useSelector(
    (state) => state.brands || {}
  );
  // Dinamik olarak güncellenecek form kontrolleri için state
  const [dynamicFormControls, setDynamicFormControls] =
    useState(initialFormElements);

  // --- Kategori listesi geldiğinde form kontrollerini güncelle ---
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
      // YENİ: Marka seçeneklerini doldur
      if (control.name === "brand" && brandList.length > 0) {
        return {
          ...control,
          options: brandList
            .filter((brand) => brand.isActive) // Aktif markalar
            .map((brand) => ({ id: brand._id, label: brand.name })),
        };
      }
      return control; // Diğer kontrolleri olduğu gibi döndür
    });
    setDynamicFormControls(updatedControls);
  }, [categoryList, brandList]); // categoryList değiştiğinde çalış

  // Mevcut useEffect'leri ve fonksiyonları (uploadImage, onSubmit, openDeleteConfirmation vb.) buraya taşı

  const uploadImage = useCallback(
    async (file) => {
      // useCallback ekle
      if (!file) return null;
      const data = new FormData();
      data.append("my_file", file);
      setProductImageLoadingState(true); // Yüklemeyi burada başlat
      try {
        const response = await axios.post(
          "http://localhost:5000/api/admin/products/upload-image",
          data
        );
        if (response?.data?.success && response.data.result?.url) {
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
            error?.response?.data?.message ||
            error.message ||
            "Bilinmeyen hata.",
        });
        return null;
      } finally {
        setProductImageLoadingState(false); // Yüklemeyi burada bitir
      }
    },
    [toast]
  ); // toast bağımlılık olarak eklendi

  const onSubmit = useCallback(
    async (event) => {
      // useCallback ekle
      event.preventDefault();
      let finalImageUrl = formData.image;

      // Resim yükleme state'i zaten uploadImage içinde yönetiliyor
      // setProductImageLoadingState(true); // Bu satırı kaldırabiliriz

      try {
        if (productImageFile) {
          const uploadedUrl = await uploadImage(productImageFile);
          if (!uploadedUrl) return; // Hata mesajı uploadImage içinde gösterildi
          finalImageUrl = uploadedUrl;
        }

        if (!finalImageUrl && currentEditedId === null) {
          toast({
            variant: "warning",
            title: "Lütfen ürün için bir resim seçin.",
          });
          return;
        }

        // Fiyat ve Stok kontrollerini yap
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
          // return; // İsteğe bağlı: İşlemi durdurabilir veya sadece uyarabiliriz
        }

        const dataToSend = {
          ...formData,
          category: formData.category, // Bu zaten select'ten ID olarak gelmeli
          brand: formData.brand || null, // Seçiliyse ID, değilse null gönder (eğer opsiyonel ise)
          image: finalImageUrl,
        };
        console.log("Gönderilen Veri (Brand Kontrol):", dataToSend);
        const action =
          currentEditedId !== null
            ? editProduct({ id: currentEditedId, formData: dataToSend })
            : addNewProduct(dataToSend);

        await dispatch(action).unwrap();

        toast({
          title: `Ürün başarıyla ${
            currentEditedId !== null ? "güncellendi" : "eklendi"
          }.`,
          variant: "success",
        });
        setOpenCreateProductsDialog(false); // Dialog'u kapat
        // State'i sıfırlama onOpenChange içinde yapılıyor, burada tekrar gerek yok
      } catch (error) {
        console.error("onSubmit sırasında hata:", error);
        toast({
          variant: "destructive",
          title: "İşlem Başarısız",
          description:
            error?.message ||
            error?.payload?.message ||
            "Ürün kaydedilirken bir hata oluştu.",
        });
      }
      // finally bloğu kaldırıldı, loading state'i uploadImage içinde yönetiliyor
    },
    [dispatch, formData, productImageFile, currentEditedId, toast, uploadImage]
  ); // Bağımlılıkları güncelle

  const openDeleteConfirmation = useCallback((productId) => {
    // useCallback ekle
    setProductIdToDelete(productId);
    setShowConfirmModal(true);
  }, []);

  const closeConfirmationModal = useCallback(() => {
    // useCallback ekle
    setShowConfirmModal(false);
    setProductIdToDelete(null);
  }, []);

  const confirmDeleteHandler = useCallback(() => {
    // useCallback ekle
    if (productIdToDelete) {
      dispatch(deleteProduct(productIdToDelete)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts()); // Liste otomatik güncellenmiyor, tekrar fetch edelim
          toast({ title: "Ürün başarıyla silindi.", variant: "success" });
        } else {
          toast({
            variant: "destructive",
            title: data.payload?.message || "Ürün silinemedi.",
          });
        }
        closeConfirmationModal(); // Modalı kapat
      });
    }
  }, [dispatch, productIdToDelete, toast, closeConfirmationModal]); // Bağımlılıkları ekle

  const isFormValid = useCallback(() => {
    // useCallback ekle
    // Fiyat ve Stok kontrolleri onSubmit içinde yapılıyor, burada temel doluluk kontrolü yeterli.
    const requiredFields = [
      "title",
      "category",
      "brand",
      "price",
      "totalStock",
    ]; // Açıklama opsiyonel olabilir
    const allFieldsFilled = requiredFields.every(
      (key) => formData[key] !== "" && formData[key] !== null
    );

    // Yeni ürün eklerken resim zorunluluğu
    const imageAvailable = !!formData.image || !!productImageFile;
    const imageRequired = currentEditedId === null;

    return allFieldsFilled && (!imageRequired || imageAvailable);
  }, [formData, productImageFile, currentEditedId]); // Bağımlılıkları ekle

  // Ürün düzenleme için formu doldurma (Mevcut useEffect)
  useEffect(() => {
    if (currentEditedId && openCreateProductsDialog) {
      const productToEdit = productList.find(
        (item) => item._id === currentEditedId
      );
      if (productToEdit) {
        setFormData({
          ...initialFormData,
          ...productToEdit,
          // Kategori ID'sini string olarak state'e ata (Select bileşeni bunu bekler)
          category: productToEdit.category?._id || productToEdit.category || "", // Eğer populate edilmediyse veya string ise
          brand: productToEdit.brand?._id || productToEdit.brand || "", // Marka için benzeri
          price: productToEdit.price?.toString() ?? "",
          salePrice: productToEdit.salePrice?.toString() ?? "",
          totalStock: productToEdit.totalStock?.toString() ?? "",
        });
        setProductImageFile(null);
      } else {
        setCurrentEditedId(null);
        setFormData(initialFormData);
        setProductImageFile(null);
      }
    }
    // Dialog kapandığında state sıfırlama onOpenChange içinde ele alınacak
  }, [currentEditedId, productList, openCreateProductsDialog]);

  // Bileşen yüklendiğinde ürünleri ve kategorileri çek
  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategories()); // Kategorileri de çek
    dispatch(fetchAllBrands());
  }, [dispatch]);

  const groupedProducts = useMemo(() => {
    if (!productList || productList.length === 0) return {};
    return productList.reduce((acc, product) => {
      // Kategori adını almak için populate edilmiş veriyi kullan (veya ID)
      // Eğer backend'den populate edilmiyorsa, categoryList'ten bulman gerekir
      const categoryKey =
        product.category?.name || product.category || "Uncategorized"; // Kategori objesi varsa adını, yoksa ID'yi veya varsayılanı kullan
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(product);
      return acc;
    }, {});
  }, [productList]); // categoryList bağımlılığına gerek yok, productList'te olmalı
  useEffect(() => {
    if (currentEditedId && openCreateProductsDialog) {
      const productToEdit = productList.find(
        (item) => item._id === currentEditedId
      );
      if (productToEdit) {
        setFormData({
          // ... diğer alanlar ...
          category: productToEdit.category?._id || productToEdit.category || "",
          brand: productToEdit.brand?._id || productToEdit.brand || "", // <-- Marka ID'sini de al
          // ... price, stock vb. string'e çevirme ...
        });
        // ...
      } else {
        /* ... */
      }
    }
    // ...
  }, [currentEditedId, productList, openCreateProductsDialog]);

  const categories = Object.keys(groupedProducts).sort();

  // handleEditClick ve handleShowDetailsClick (useCallback ile optimize edilebilir)
  const handleEditClick = useCallback((product = null) => {
    if (product && product._id) {
      setCurrentEditedId(product._id); // useEffect tetiklenir ve formu doldurur
      setOpenCreateProductsDialog(true);
    } else {
      setCurrentEditedId(null);
      setFormData(initialFormData);
      setProductImageFile(null);
      setOpenCreateProductsDialog(true);
    }
  }, []); // Bağımlılık yok

  const handleShowDetailsClick = useCallback((product) => {
    setSelectedProductDetails(product);
    setIsDetailsDialogOpen(true);
  }, []);

  return (
    <Fragment>
      <div className="mb-4 w-full flex justify-end">
        <Button onClick={() => handleEditClick(null)}>Yeni Ürün Ekle</Button>
      </div>

      <div className="w-full overflow-hidden">
        <div className="space-y-6">
          {listLoading ? (
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
          ) : categories.length > 0 ? (
            categories.map((categoryName) => (
              <AdminProductCarousel
                key={categoryName}
                title={categoryName} // Kategori adını başlık olarak kullan
                products={groupedProducts[categoryName]}
                isLoading={false}
                handleEditProduct={handleEditClick}
                handleDeleteProduct={openDeleteConfirmation}
                handleShowAdminDetails={handleShowDetailsClick}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              Gösterilecek ürün bulunamadı.
            </p>
          )}
        </div>
      </div>

      {/* --- Sheet (Ürün Ekleme/Düzenleme Formu) --- */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            // Dialog kapandığında state'leri temizle
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

            {/* Kategori yüklenirken Form'u gösterme (veya disabled yap) */}
            {categoriesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText={currentEditedId !== null ? "Güncelle" : "Ekle"}
                formControls={dynamicFormControls} // Dinamik kontrolleri kullan
                isBtnDisabled={productImageLoadingState || !isFormValid()}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* --- Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        message="Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDeleteHandler}
        onCancel={closeConfirmationModal}
      />

      {/* --- Product Details Dialog --- */}
      <AdminProductDetailsDialog
        open={isDetailsDialogOpen}
        setOpen={setIsDetailsDialogOpen}
        productDetails={selectedProductDetails}
      />
    </Fragment>
  );
}

export default AdminProducts;
