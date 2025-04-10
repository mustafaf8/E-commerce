import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-xs mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-contain rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through-red" : ""
              } text-lg font-semibold  text-muted-foreground`}
            >
              {product?.price} TL
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-bold">{product?.salePrice} TL</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Düzenle
          </Button>
          <Button onClick={() => handleDelete(product?._id)}>Sil</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
