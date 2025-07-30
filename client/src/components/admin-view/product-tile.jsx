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
    
    // Eğer categoryId bir obje ise, name property'sini al
    if (typeof categoryId === 'object' && categoryId !== null) {
      return categoryId.name || "Bilinmeyen Kategori";
    }
    
    // Eğer categoryId bir string ise, kategori listesinde ara
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
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          {canManage && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-1" />
                Düzenle
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

AdminProductTile.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    priceUSD: PropTypes.number,
    salePriceUSD: PropTypes.number,
    totalStock: PropTypes.number,
    salesCount: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleShowDetails: PropTypes.func.isRequired,
  canManage: PropTypes.bool.isRequired,
};

export default AdminProductTile;
