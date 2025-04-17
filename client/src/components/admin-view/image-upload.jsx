// import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { useEffect, useRef } from "react";
// import { Button } from "../ui/button";
// import axios from "axios";
// import { Skeleton } from "../ui/skeleton";

// function ProductImageUpload({
//   imageFile,
//   setImageFile,
//   imageLoadingState,
//   uploadedImageUrl,
//   setUploadedImageUrl,
//   setImageLoadingState,
//   isEditMode,
//   isCustomStyling = false,
// }) {
//   const inputRef = useRef(null);

//   console.log(isEditMode, "isEditMode");

//   function handleImageFileChange(event) {
//     console.log(event.target.files, "event.target.files");
//     const selectedFile = event.target.files?.[0];
//     console.log(selectedFile);

//     if (selectedFile) setImageFile(selectedFile);
//   }

//   function handleDragOver(event) {
//     event.preventDefault();
//   }

//   function handleDrop(event) {
//     event.preventDefault();
//     const droppedFile = event.dataTransfer.files?.[0];
//     if (droppedFile) setImageFile(droppedFile);
//   }

//   function handleRemoveImage() {
//     setImageFile(null);
//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   }

//   async function uploadImageToCloudinary() {
//     setImageLoadingState(true);
//     const data = new FormData();
//     data.append("my_file", imageFile);
//     const response = await axios.post(
//       "http://localhost:5000/api/admin/products/upload-image",
//       data
//     );
//     console.log(response, "response");

//     if (response?.data?.success) {
//       setUploadedImageUrl(response.data.result.url);
//       setImageLoadingState(false);
//     }
//   }

//   useEffect(() => {
//     if (imageFile !== null) uploadImageToCloudinary();
//   }, [imageFile]);

//   return (
//     <div
//       className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
//     >
//       <Label className="text-lg font-semibold mb-2 block">Resim Yükle</Label>
//       <div
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         className={`${
//           isEditMode ? "opacity-60" : ""
//         } border-2 border-dashed rounded-lg p-4`}
//       >
//         <Input
//           id="image-upload"
//           type="file"
//           className="hidden"
//           ref={inputRef}
//           onChange={handleImageFileChange}
//           disabled={isEditMode}
//         />
//         {!imageFile ? (
//           <Label
//             htmlFor="image-upload"
//             className={`${
//               isEditMode ? "cursor-not-allowed" : ""
//             } flex flex-col items-center justify-center h-32 cursor-pointer`}
//           >
//             <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
//             <span>Sürükleyin veya tıklayarak resim yükleyin</span>
//           </Label>
//         ) : imageLoadingState ? (
//           <Skeleton className="h-10 bg-gray-100" />
//         ) : (
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <FileIcon className="w-8 text-primary mr-2 h-8" />
//             </div>
//             <p className="text-sm font-medium">{imageFile.name}</p>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-muted-foreground hover:text-foreground"
//               onClick={handleRemoveImage}
//             >
//               <XIcon className="w-4 h-4" />
//               <span className="sr-only">Dosyayı Kaldır</span>
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductImageUpload;

// import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { useEffect, useRef } from "react";
// import { Button } from "../ui/button";

// import { Skeleton } from "../ui/skeleton";

// function ProductImageUpload({
//   imageFile,
//   setImageFile,
//   isEditMode,
//   isCustomStyling = false,
// }) {
//   const inputRef = useRef(null);

//   console.log(isEditMode, "isEditMode");

//   function handleImageFileChange(event) {
//     console.log(event.target.files, "event.target.files");
//     const selectedFile = event.target.files?.[0];
//     console.log(selectedFile);

//     if (selectedFile) setImageFile(selectedFile);
//   }

//   function handleDragOver(event) {
//     event.preventDefault();
//   }

//   function handleDrop(event) {
//     event.preventDefault();
//     const droppedFile = event.dataTransfer.files?.[0];
//     if (droppedFile) {
//       setImageFile(droppedFile); // Sadece File nesnesini parent'a bildir
//     }
//   }

//   function handleRemoveImage() {
//     setImageFile(null);
//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   }

//   return (
//     <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
//       <Label className="text-lg font-semibold mb-2 block">Resim Seç</Label>{" "}
//       {/* Başlık değişti */}
//       <div
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         className={`${
//           isEditMode ? "opacity-60 cursor-not-allowed" : "" // Disable stili eklendi
//         } border-2 border-dashed rounded-lg p-4`}
//       >
//         <Input
//           id="image-upload" // ID unique olmalı, gerekirse prop olarak alınabilir
//           type="file"
//           accept="image/*" // Sadece resim dosyaları
//           className="hidden"
//           ref={inputRef}
//           onChange={handleImageFileChange}
//           disabled={isEditMode}
//         />
//         {/* Dosya seçiliyken veya seçilmemişken gösterilecekler */}
//         {!imageFile ? (
//           <Label
//             htmlFor="image-upload" // ID ile eşleşmeli
//             className={`${
//               isEditMode ? "cursor-not-allowed" : "cursor-pointer"
//             } flex flex-col items-center justify-center h-32`}
//           >
//             <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
//             <span>Sürükleyin veya tıklayarak resim seçin</span>
//           </Label>
//         ) : (
//           // Dosya seçilmişse göster (Yüklenme durumu artık parent'ta yönetilecek)
//           <div className="flex items-center justify-between">
//             <div className="flex items-center overflow-hidden mr-2">
//               {" "}
//               {/* Taşan ismi kısaltmak için */}
//               <FileIcon className="w-8 h-8 text-primary mr-2 flex-shrink-0" />
//               <p
//                 className="text-sm font-medium truncate"
//                 title={imageFile.name}
//               >
//                 {" "}
//                 {/* truncate ve title */}
//                 {imageFile.name}
//               </p>
//             </div>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-muted-foreground hover:text-foreground h-8 w-8 flex-shrink-0" // Boyut ve flex-shrink
//               onClick={handleRemoveImage}
//               disabled={isEditMode} // Düzenleme modunda kaldırma
//             >
//               <XIcon className="w-4 h-4" />
//               <span className="sr-only">Dosyayı Kaldır</span>
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductImageUpload;

// client/src/components/admin-view/image-upload.jsx (Güncellenmiş Hali)
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react"; // useEffect kaldırıldı (upload için)
import { Button } from "../ui/button";
// import axios from "axios"; // axios'a burada gerek yok
import { Skeleton } from "../ui/skeleton"; // Skeleton kalabilir (dosya seçimi sonrası için)

function ProductImageUpload({
  imageFile, // Seçilen dosya (File nesnesi)
  setImageFile, // Dosyayı parent'a bildiren fonksiyon
  isEditMode, // Düzenleme modunda mı?
  isCustomStyling = false,
  id,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // setUploadedImageUrl(""); // URL state'i kaldırıldı
      setImageFile(selectedFile); // Sadece File nesnesini parent'a bildir
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      // setUploadedImageUrl(""); // URL state'i kaldırıldı
      setImageFile(droppedFile); // Sadece File nesnesini parent'a bildir
    }
  }

  function handleRemoveImage() {
    setImageFile(null); // Parent'taki File state'ini sıfırla
    // setUploadedImageUrl(""); // URL state'i kaldırıldı
    if (inputRef.current) {
      inputRef.current.value = ""; // Input'u temizle
    }
  }

  // --- uploadImageToCloudinary fonksiyonu ve useEffect kaldırıldı ---

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Resim Seç</Label>{" "}
      {/* Başlık değişti */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60 cursor-not-allowed" : "" // Disable stili eklendi
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id={id} // ID unique olmalı, gerekirse prop olarak alınabilir
          type="file"
          accept="image/*" // Sadece resim dosyaları
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {/* Dosya seçiliyken veya seçilmemişken gösterilecekler */}
        {!imageFile ? (
          <Label
            htmlFor={id} // ID ile eşleşmeli
            className={`${
              isEditMode ? "cursor-not-allowed" : "cursor-pointer"
            } flex flex-col items-center justify-center h-32`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Sürükleyin veya tıklayarak resim seçin</span>
          </Label>
        ) : (
          // Dosya seçilmişse göster (Yüklenme durumu artık parent'ta yönetilecek)
          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden mr-2">
              {" "}
              {/* Taşan ismi kısaltmak için */}
              <FileIcon className="w-8 h-8 text-primary mr-2 flex-shrink-0" />
              <p
                className="text-sm font-medium truncate"
                title={imageFile.name}
              >
                {" "}
                {/* truncate ve title */}
                {imageFile.name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8 flex-shrink-0" // Boyut ve flex-shrink
              onClick={handleRemoveImage}
              disabled={isEditMode} // Düzenleme modunda kaldırma
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Dosyayı Kaldır</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
