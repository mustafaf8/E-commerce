import { FileImage, UploadCloud, X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "../ui/button";

function ProductImageUpload({ imageFile, setImageFile, isEditMode, id }) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    if (!isEditMode) {
      event.currentTarget.classList.add("border-primary", "bg-primary/5");
    }
  }

  function handleDragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("border-primary", "bg-primary/5");
  }

  function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove("border-primary", "bg-primary/5");
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && !isEditMode) {
      setImageFile(droppedFile);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="w-full">
      <Label htmlFor={id} className="text-sm font-medium mb-1.5 block">
        Resim Seç
      </Label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-4 transition-colors duration-200
          ${
            isEditMode
              ? "opacity-60 cursor-not-allowed border-gray-300 bg-gray-50"
              : "border-gray-300 hover:border-primary/70 hover:bg-primary/5"
          }
        `}
      >
        <Input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor={id}
            className={`
              flex flex-col items-center justify-center h-32
              ${isEditMode ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <UploadCloud className="w-10 h-10 text-primary/60 mb-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Sürükleyin veya tıklayarak resim seçin
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              PNG, JPG veya GIF (max. 5MB)
            </span>
          </Label>
        ) : (
          <div className="flex items-center justify-between bg-secondary/60 p-3 rounded-md">
            <div className="flex items-center overflow-hidden gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileImage className="w-5 h-5 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p
                  className="text-sm font-medium truncate"
                  title={imageFile.name}
                >
                  {imageFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(imageFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
              onClick={handleRemoveImage}
              disabled={isEditMode}
              aria-label="Dosyayı Kaldır"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Dosyayı Kaldır</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

ProductImageUpload.propTypes = {
  imageFile: PropTypes.instanceOf(File),
  setImageFile: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  isCustomStyling: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

export default ProductImageUpload;
