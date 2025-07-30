import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import PropTypes from "prop-types";
import { Edit, Trash2, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { formatPrice } from "../../lib/utils";

function AdminProductTile({
  product,
  handleEdit,
  handleDelete,
  handleShowDetails,
  canManage,
}) {
  const { categoryList = [] } = useSelector(
    (state) => state.categories || { categoryList: [] }
  );

  // Kategori adını bul
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "Kategori Yok";
    
    const findCategory = (categories, targetId) => {
      for (const category of categories) {
        if (category._id === targetId) {
          return category.name;
        }
        if (category.children && category.children.length > 0) {
          const result = findCategory(category.children, targetId);
          if (result) return result;
        }
      }
      return null;
    };
    
    return findCategory(categoryList, categoryId) || "Bilinmeyen Kategori";
  };

  const categoryName = getCategoryName(product?.category);
  
  return (
    <Card className="w-full overflow-hidden border border-border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col group">
      <div
        onClick={handleShowDetails}
        className="cursor-pointer flex-grow flex flex-col"
      >
        <div className="relative pt-3 px-3 pb-0 flex-shrink-0">
          <div className="bg-secondary/30 dark:bg-gray-700/30 rounded-md p-2 flex items-center justify-center h-[180px] group-hover:bg-secondary/50 dark:group-hover:bg-gray-700/50 transition-colors duration-200">
            <img
              src={product?.image || "/placeholder.png"}
              alt={product?.title}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          </div>
          {product?.salePrice && product.salePrice > 0 && product.salePrice < product.price && (
            <div className="absolute top-5 right-5 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              İndirim
            </div>
          )}
        </div>
        <CardContent className="flex-grow p-4">
          <h2
            className="text-base font-semibold mb-1 truncate"
            title={product?.title}
          >
            {product?.title}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate" title={categoryName}>
            📂 {categoryName}
          </p>
          <div className="flex justify-between items-center mb-3">
            <span
              className={`${
                product?.salePriceUSD &&
                product.salePriceUSD > 0 &&
                product.salePriceUSD < product.priceUSD
                  ? "line-through-red text-sm"
                  : "text-primary font-medium"
              }`}
            >
              {product?.priceUSD ? `$${formatPrice(product.priceUSD)}` : "Fiyat Yok"}
            </span>
            {product?.salePriceUSD &&
            product.salePriceUSD > 0 &&
            product.salePriceUSD < product.priceUSD ? (
              <span className="font-bold text-primary">{`$${formatPrice(product.salePriceUSD)}`}</span>
            ) : null}
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="font-medium">Stok:</span> 
              <span className={product?.totalStock > 0 ? "text-green-600 dark:text-green-400 font-medium" : "text-red-500 dark:text-red-400 font-medium"}>
                {product?.totalStock > 0 ? product.totalStock : "Stok Yok"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Satış:</span> 
              <span className="font-medium">{product?.salesCount || 0}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex justify-end items-center p-3 pt-2 border-t bg-secondary/20 dark:bg-gray-700/20 min-h-[52px]">
        {/* Yönetim butonları sadece canManage true ise render edilecek */}
        {canManage ? (
          <div className="flex w-full justify-between items-center">
             <Button 
              onClick={handleShowDetails} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1 h-8"
            >
              <Eye size={14} />
              <span>Detaylar</span>
            </Button>
            <div className="flex gap-1">
              <Button
                onClick={handleEdit}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-500 hover:text-primary"
                title="Düzenle"
              >
                <Edit size={16} />
              </Button>
              <Button
                onClick={() => handleDelete(product?._id)}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-500 hover:text-destructive"
                title="Sil"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ) : (
          // Yetkisi yoksa sadece "Detaylar" butonu görünür
          <Button 
            onClick={handleShowDetails} 
            size="sm" 
            variant="outline"
            className="flex items-center gap-1 h-8 w-full"
          >
            <Eye size={14} />
            <span>Detayları Görüntüle</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

AdminProductTile.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    totalStock: PropTypes.number,
    salesCount: PropTypes.number,
    category: PropTypes.string,
  }).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleShowDetails: PropTypes.func.isRequired,
  canManage: PropTypes.bool.isRequired,
};

export default AdminProductTile;
