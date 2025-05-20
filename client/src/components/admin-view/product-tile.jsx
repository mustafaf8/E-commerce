import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import PropTypes from "prop-types";

function AdminProductTile({
  product,
  handleEdit,
  handleDelete,
  handleShowDetails,
}) {
  return (
    <Card className="w-full max-w-xs mx-auto flex flex-col h-full">
      <div
        onClick={handleShowDetails}
        className="cursor-pointer flex-grow flex flex-col"
      >
        <div className="relative flex-shrink-0">
          <img
            src={product?.image || "/placeholder.png"}
            alt={product?.title}
            className="w-full h-[250px] object-contain rounded-t-lg p-2"
          />
        </div>
        <CardContent className="flex-grow p-3">
          <h2
            className="text-base font-semibold mb-1 truncate"
            title={product?.title}
          >
            {product?.title}
          </h2>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span
              className={`${
                product?.salePrice &&
                product.salePrice > 0 &&
                product.salePrice < product.price
                  ? "line-through text-gray-500"
                  : "text-muted-foreground"
              } font-semibold`}
            >
              {product?.price ? `${product.price.toFixed(2)} TL` : "N/A"}
            </span>
            {product?.salePrice &&
            product.salePrice > 0 &&
            product.salePrice < product.price ? (
              <span className="font-bold text-green-600">{`${product.salePrice.toFixed(
                2
              )} TL`}</span>
            ) : null}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Stok: {product?.totalStock ?? "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              Satılan: {product?.salesCount ?? 0}
            </p>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex justify-between items-center p-3 border-t">
        <Button onClick={handleEdit} size="sm">
          Düzenle
        </Button>
        <Button
          onClick={() => handleDelete(product?._id)}
          size="sm"
          variant="destructive"
        >
          Sil
        </Button>
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
