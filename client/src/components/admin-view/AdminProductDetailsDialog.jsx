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
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import PropTypes from "prop-types";
import StarRatingComponent from "../common/star-rating";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { Calendar, DollarSign, Package, ShoppingCart, Tag } from "lucide-react";

function DetailItem({ label, value, className = "", valueClassName = "", icon }) {
  return (
    <div
      className={cn("flex items-start gap-2", className)}
    >
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
  const categoryName =
    categoryList.find((cat) => cat._id === productDetails.category)?.name ||
    productDetails.category ||
    "N/A";

  const brandName =
    brandList.find((brand) => brand._id === productDetails.brand)?.name ||
    productDetails.brand ||
    "N/A";

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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-lg">
        <DialogHeader className="px-6 py-4 border-b bg-white dark:bg-gray-900">
          <DialogTitle className="text-xl font-bold text-primary">
            {productDetails.title || "Ürün Detayı"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Admin Paneli - Ürün Detayları
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
            <div className="md:col-span-2 relative overflow-hidden rounded-lg flex items-center justify-center bg-secondary/30 border aspect-square">
              <img
                src={productDetails.image || "/placeholder.png"}
                alt={productDetails.title || "Ürün Resmi"}
                className="object-contain max-h-full max-w-full p-4"
                loading="lazy"
              />
            </div>

            <div className="md:col-span-3 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border">
                <h3 className="text-base font-semibold mb-2 text-primary flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full"></span>
                  Açıklama
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {productDetails.description || "Bu ürün için açıklama bulunmamaktadır."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border">
                  <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                    <Tag size={16} />
                    Kategori ve Marka
                  </h3>
                  <div className="space-y-3">
                    <DetailItem
                      label="Kategori"
                      value={
                        <Badge variant="secondary" className="mt-1 font-normal">
                          {categoryName || "N/A"}
                        </Badge>
                      }
                    />
                    <DetailItem
                      label="Marka"
                      value={
                        <Badge variant="secondary" className="mt-1 font-normal">
                          {brandName || "N/A"}
                        </Badge>
                      }
                    />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border">
                  <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                    <DollarSign size={16} />
                    Fiyatlandırma
                  </h3>
                  <div className="space-y-3">
                    <DetailItem
                      label="Normal Fiyat"
                      value={`${productDetails.price?.toFixed(2) || "0.00"} TL`}
                    />
                    <DetailItem
                      label="İndirimli Fiyat"
                      value={
                        productDetails.salePrice
                          ? `${productDetails.salePrice.toFixed(2)} TL`
                          : "-"
                      }
                      valueClassName={
                        productDetails.salePrice &&
                        productDetails.salePrice < productDetails.price
                          ? "text-green-600 dark:text-green-400 font-semibold"
                          : ""
                      }
                    />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border">
                  <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                    <Package size={16} />
                    Stok Bilgisi
                  </h3>
                  <div className="space-y-3">
                    <DetailItem
                      label="Stok Miktarı"
                      value={productDetails.totalStock ?? "N/A"}
                      valueClassName={productDetails.totalStock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}
                    />
                    <DetailItem
                      label="Satış Sayısı"
                      value={productDetails.salesCount ?? 0}
                      icon={<ShoppingCart size={16} />}
                    />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border">
                  <h3 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                    <Calendar size={16} />
                    Tarih Bilgileri
                  </h3>
                  <div className="space-y-3">
                    <DetailItem
                      label="Oluşturulma Tarihi"
                      value={formatDate(productDetails.createdAt)}
                    />
                    <DetailItem
                      label="Son Güncelleme"
                      value={formatDate(productDetails.updatedAt)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-border">
                <h3 className="text-sm font-semibold mb-3 text-primary">Değerlendirme</h3>
                <div className="flex items-center">
                  {productDetails.averageReview !== undefined &&
                  productDetails.averageReview !== null ? (
                    <>
                      <StarRatingComponent
                        rating={productDetails.averageReview}
                      />
                      <span className="ml-2 text-sm font-medium">
                        {productDetails.averageReview.toFixed(1)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Henüz puanlanmamış
                    </span>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">Ürün ID: <span className="font-mono">{productDetails._id}</span></p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-secondary/30">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="gap-2">
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
