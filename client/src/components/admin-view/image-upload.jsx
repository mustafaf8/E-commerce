import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "../ui/button";

function ProductImageUpload({
  imageFile,
  setImageFile,
  isEditMode,
  isCustomStyling = false,
  id,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
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
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Resim Seç</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60 cursor-not-allowed" : ""
        } border-2 border-dashed rounded-lg p-4`}
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
            className={`${
              isEditMode ? "cursor-not-allowed" : "cursor-pointer"
            } flex flex-col items-center justify-center h-32`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Sürükleyin veya tıklayarak resim seçin</span>
          </Label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden mr-2">
              <FileIcon className="w-8 h-8 text-primary mr-2 flex-shrink-0" />
              <p
                className="text-sm font-medium truncate"
                title={imageFile.name}
              >
                {imageFile.name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8 flex-shrink-0" // Boyut ve flex-shrink
              onClick={handleRemoveImage}
              disabled={isEditMode}
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

ProductImageUpload.propTypes = {
  imageFile: PropTypes.instanceOf(File),
  setImageFile: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  isCustomStyling: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

export default ProductImageUpload;
