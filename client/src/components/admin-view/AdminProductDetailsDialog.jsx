import "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import PropTypes from "prop-types";
import StarRatingComponent from "../common/star-rating";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { Calendar, DollarSign, Package, Tag, Star, FileText } from "lucide-react";

function DetailItem({
  label,
  value,
  className = "",
  valueClassName = "",
  icon,
}) {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      {icon && <span className="text-primary/70 mt-0.5">{icon}</span>}
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("font-medium", valueClassName)}>{value}</div>
      </div>
    </div>
  );
}

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  className: PropTypes.string,
  valueClassName: PropTypes.string,
  icon: PropTypes.node,
};

function AdminProductDetailsDialog({ open, setOpen, productDetails }) {
  const { categoryList = [] } = useSelector(
    (state) => state.categories || { categoryList: [] }
  );
  const { brandList = [] } = useSelector(
    (state) => state.brands || { brandList: [] }
  );
  if (!productDetails) {
    return null;
  }
  const getCategoryName = () => {
    if (productDetails.category?.name) {
      return productDetails.category.name;
    }
    if (typeof productDetails.category === 'string') {
      const found = categoryList.find((cat) => cat._id === productDetails.category);
      return found?.name || productDetails.category;
    }
    return "N/A";
  };

  const getBrandName = () => {
    if (productDetails.brand?.name) {
      return productDetails.brand.name;
    }
    if (typeof productDetails.brand === 'string') {
      const found = brandList.find((brand) => brand._id === productDetails.brand);
      return found?.name || productDetails.brand;
    }
    return "N/A";
  };

  const categoryName = getCategoryName();
  const brandName = getBrandName();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd.MM.yyyy HH:mm");
    } catch {
      return "Geçersiz Tarih";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-5xl max-h-[85vh] flex flex-col p-0 overflow-hidden border-none shadow-xl z-[9999999999]">
        <DialogHeader className="px-4 py-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
          <DialogTitle className="text-lg font-semibold text-primary flex items-center gap-2">
            <Package size={20} />
            {productDetails.title || "Ürün Detayı"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Admin Paneli - Ürün Detayları
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            {/* Ürün Resmi */}
            <div className="lg:col-span-1">
              <div className="relative overflow-hidden rounded-lg flex items-center justify-center bg-gradient-to-br from-secondary/20 to-secondary/10 dark:from-gray-700/30 dark:to-gray-600/20 border border-border aspect-square shadow-sm">
                <img
                  src={productDetails.image || "/placeholder.png"}
                  alt={productDetails.title || "Ürün Resmi"}
                  className="object-contain max-h-full max-w-full p-3"
                  loading="lazy"
                />
                {productDetails.salePriceUSD && productDetails.salePriceUSD < productDetails.priceUSD && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    İndirim
                  </div>
                )}
              </div>
            </div>

            {/* Ürün Bilgileri */}
            <div className="lg:col-span-2 space-y-4">
              {/* Temel Bilgiler Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border">
                  <h3 className="text-xs font-semibold mb-2 text-primary flex items-center gap-1">
                    <Tag size={14} />
                    Kategori & Marka
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16">Kategori:</span>
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {categoryName || "N/A"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16">Marka:</span>
                      <Badge variant="outline" className="text-xs px-2 py-1">
                        {brandName || "N/A"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border">
                  <h3 className="text-xs font-semibold mb-2 text-primary flex items-center gap-1">
                    <DollarSign size={14} />
                    Fiyatlandırma (USD)
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Normal:</span>
                      <span className="text-sm font-medium">${productDetails.priceUSD?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">İndirimli:</span>
                      <span className={`text-sm font-medium ${productDetails.salePriceUSD && productDetails.salePriceUSD < productDetails.priceUSD ? "text-green-600 dark:text-green-400" : ""}`}>
                        {productDetails.salePriceUSD ? `$${productDetails.salePriceUSD.toFixed(2)}` : "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Maliyet:</span>
                      <span className="text-sm font-medium">{productDetails.costPrice ? `$${productDetails.costPrice.toFixed(2)}` : "-"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border">
                  <h3 className="text-xs font-semibold mb-2 text-primary flex items-center gap-1">
                    <Package size={14} />
                    Stok & Satış
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Stok:</span>
                      <span className={`text-sm font-medium ${productDetails.totalStock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                        {productDetails.totalStock > 0 ? productDetails.totalStock : "Stok Yok"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Satış:</span>
                      <span className="text-sm font-medium">{productDetails.salesCount || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border">
                  <h3 className="text-xs font-semibold mb-2 text-primary flex items-center gap-1">
                    <Calendar size={14} />
                    Tarih Bilgileri
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Oluşturulma:</span>
                      <span className="text-xs font-medium">{formatDate(productDetails.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Güncelleme:</span>
                      <span className="text-xs font-medium">{formatDate(productDetails.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Değerlendirme ve Açıklama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border">
                  <h3 className="text-xs font-semibold mb-2 text-primary flex items-center gap-1">
                    <Star size={14} />
                    Değerlendirme
                  </h3>
                  <div className="flex items-center gap-2">
                    {productDetails.averageReview !== undefined &&
                    productDetails.averageReview !== null ? (
                      <>
                        <StarRatingComponent
                          rating={productDetails.averageReview}
                        />
                        <span className="text-sm font-medium">
                          {productDetails.averageReview.toFixed(1)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Henüz puanlanmamış
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-border">
                  <h3 className="text-xs font-semibold mb-2 text-primary flex items-center gap-1">
                    <FileText size={14} />
                    Açıklama
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
                    {productDetails.description ||
                      "Bu ürün için açıklama bulunmamaktadır."}
                  </p>
                </div>
              </div>

              {/* Ürün ID */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Ürün ID: <span className="font-mono text-xs">{productDetails._id}</span>
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-secondary/30 dark:bg-gray-700/30">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="gap-2" aria-label="Kapat">
              Kapat
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

AdminProductDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  productDetails: PropTypes.object,
};

export default AdminProductDetailsDialog;
