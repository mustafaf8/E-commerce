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

function DetailItem({ label, value, className = "", valueClassName = "" }) {
  return (
    <div
      className={cn("grid grid-cols-[auto_1fr] gap-x-2 items-start", className)}
    >
      <p className="text-muted-foreground font-medium text-right">{label}:</p>
      <div className={cn("font-semibold", valueClassName)}>{value}</div>
    </div>
  );
}

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  className: PropTypes.string,
  valueClassName: PropTypes.string,
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">
            {productDetails.title || "Ürün Detayı"}
          </DialogTitle>
          <DialogDescription>Admin Paneli - Ürün Detayları</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
            <div className="md:col-span-2 relative overflow-hidden rounded-lg flex items-center justify-center bg-gray-100 border aspect-square">
              <img
                src={productDetails.image || "/placeholder.png"}
                alt={productDetails.title || "Ürün Resmi"}
                className="object-contain max-h-full max-w-full"
                loading="lazy"
              />
            </div>

            <div className="md:col-span-3 space-y-5">
              <div>
                <h3 className="text-base font-semibold mb-2 text-gray-800">
                  Açıklama
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {productDetails.description || "-"}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <DetailItem
                  label="Kategori"
                  value={
                    <Badge variant="outline">{categoryName || "N/A"}</Badge>
                  }
                />
                <DetailItem
                  label="Marka"
                  value={<Badge variant="outline">{brandName || "N/A"}</Badge>}
                />
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
                      ? "text-green-600"
                      : ""
                  }
                />
                <DetailItem
                  label="Stok"
                  value={productDetails.totalStock ?? "N/A"}
                />
                <DetailItem
                  label="Satış Sayısı"
                  value={productDetails.salesCount ?? 0}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-3 text-sm">
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground font-medium mb-1">
                    Ortalama Puan:
                  </p>
                  <div className="flex items-center pointer-events-none">
                    {productDetails.averageReview !== undefined &&
                    productDetails.averageReview !== null ? (
                      <>
                        <StarRatingComponent
                          rating={productDetails.averageReview}
                        />
                        <span className="ml-2 text-xs text-muted-foreground ">
                          ({productDetails.averageReview.toFixed(1)})
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Henüz puanlanmamış
                      </span>
                    )}
                  </div>
                </div>
                <DetailItem
                  label="Ürün ID"
                  value={productDetails._id}
                  valueClassName="font-mono text-md"
                />
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <DetailItem
                  label="Oluşturulma"
                  value={formatDate(productDetails.createdAt)}
                  valueClassName="text-md"
                />
                <DetailItem
                  label="Güncellenme"
                  value={formatDate(productDetails.updatedAt)}
                  valueClassName="text-md"
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-6 pt-4 border-t bg-gray-50">
          <DialogClose asChild>
            <Button type="button" variant="outline">
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
