import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import PropTypes from "prop-types";
import { Edit, Trash2, Eye } from "lucide-react";

function AdminProductTile({
  product,
  handleEdit,
  handleDelete,
  handleShowDetails,
}) {
  return (
    <Card className="w-full overflow-hidden border border-border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <div
        onClick={handleShowDetails}
        className="cursor-pointer flex-grow flex flex-col"
      >
        <div className="relative pt-3 px-3 pb-0 flex-shrink-0">
          <div className="bg-secondary/30 rounded-md p-2 flex items-center justify-center h-[180px]">
            <img
              src={product?.image || "/placeholder.png"}
              alt={product?.title}
              className="max-h-full max-w-full object-contain"
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
            className="text-base font-semibold mb-2 truncate"
            title={product?.title}
          >
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-3">
            <span
              className={`${
                product?.salePrice &&
                product.salePrice > 0 &&
                product.salePrice < product.price
                  ? "line-through-red text-sm"
                  : "text-primary font-medium"
              }`}
            >
              {product?.price ? `${product.price.toFixed(2)} TL` : "N/A"}
            </span>
            {product?.salePrice &&
            product.salePrice > 0 &&
            product.salePrice < product.price ? (
              <span className="font-bold text-primary">{`${product.salePrice.toFixed(
                2
              )} TL`}</span>
            ) : null}
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="font-medium">Stok:</span> 
              <span className={product?.totalStock > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                {product?.totalStock ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Satış:</span> 
              <span>{product?.salesCount ?? 0}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex justify-between items-center p-3 pt-2 border-t bg-secondary/20">
        <Button 
          onClick={handleEdit} 
          size="sm" 
          variant="outline"
          className="flex items-center gap-1 h-8"
        >
          <Edit size={14} />
          <span>Düzenle</span>
        </Button>
        <div className="flex gap-1">
          <Button
            onClick={handleShowDetails}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-gray-500 hover:text-primary"
          >
            <Eye size={16} />
          </Button>
          <Button
            onClick={() => handleDelete(product?._id)}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-gray-500 hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>
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
  }).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleShowDetails: PropTypes.func.isRequired,
};

export default AdminProductTile;
