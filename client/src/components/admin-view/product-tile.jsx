import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import PropTypes from "prop-types";

function AdminProductTile({
  product,
  handleEdit, // Yeni: Düzenleme handler'ı
  handleDelete, // Mevcut: Silme handler'ı
  handleShowDetails, // Yeni: Detay gösterme handler'ı
}) {
  return (
    <Card className="w-full max-w-xs mx-auto flex flex-col h-full">
      <div
        onClick={handleShowDetails}
        className="cursor-pointer flex-grow flex flex-col"
      >
        <div className="relative flex-shrink-0">
          <img
            src={product?.image || "/placeholder.png"} // Varsayılan resim
            alt={product?.title}
            className="w-full h-[250px] object-contain rounded-t-lg p-2" // Padding eklendi
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
                  ? "line-through text-gray-500" // Üstü çizili ve gri
                  : "text-muted-foreground"
              } font-semibold`}
            >
              {product?.price ? `${product.price.toFixed(2)} TL` : "N/A"}
            </span>
            {product?.salePrice &&
            product.salePrice > 0 &&
            product.salePrice < product.price ? ( // İndirimli fiyat sadece daha düşükse göster
              <span className="font-bold text-green-600">{`${product.salePrice.toFixed(
                2
              )} TL`}</span>
            ) : null}
          </div>
          {/* Stok Bilgisi (Admin için önemli olabilir) */}
          <p className="text-xs text-gray-500">
            Stok: {product?.totalStock ?? "N/A"}
          </p>
        </CardContent>
      </div>
      {/* --- Tıklanabilir Alan Sonu --- */}
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
  }).isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleShowDetails: PropTypes.func.isRequired,
};

export default AdminProductTile;

// AdminProductTile.jsx - The individual product card component
// import { Button } from "../ui/button";
// import { PencilIcon, TrashIcon, InfoIcon } from "lucide-react";
// import PropTypes from "prop-types";

// function AdminProductTile({
//   product,
//   handleEdit,
//   handleDelete,
//   handleShowDetails,
// }) {
//   // Format price to Turkish Lira
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("tr-TR", {
//       style: "currency",
//       currency: "TRY",
//       minimumFractionDigits: 2,
//     }).format(price);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-all hover:shadow-lg">
//       {/* Product Image */}
//       <div className="relative aspect-square bg-gray-100">
//         <img
//           src={product.imageUrl || "/placeholder.jpg"}
//           alt={product.title}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             e.target.onerror = null;
//             e.target.src = "/placeholder.jpg";
//           }}
//         />

//         {/* Admin action buttons overlay */}
//         <div className="absolute top-2 right-2 flex flex-col gap-2">
//           <Button
//             size="icon"
//             variant="secondary"
//             className="w-8 h-8 rounded-full bg-white/80 hover:bg-white"
//             onClick={handleEdit}
//           >
//             <PencilIcon className="h-4 w-4" />
//           </Button>

//           <Button
//             size="icon"
//             variant="destructive"
//             className="w-8 h-8 rounded-full bg-white/80 hover:bg-red-500 hover:text-white"
//             onClick={handleDelete}
//           >
//             <TrashIcon className="h-4 w-4" />
//           </Button>

//           <Button
//             size="icon"
//             variant="secondary"
//             className="w-8 h-8 rounded-full bg-white/80 hover:bg-blue-500 hover:text-white"
//             onClick={handleShowDetails}
//           >
//             <InfoIcon className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="p-3 flex flex-col flex-grow">
//         <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
//           {product.title}
//         </h3>

//         <div className="flex items-center justify-between mt-auto">
//           <span className="text-lg font-bold text-gray-900">
//             {formatPrice(product.price)}
//           </span>
//           <span className="text-xs text-gray-500">
//             {product.stockStatus || "Stokta"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// AdminProductTile.propTypes = {
//   product: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     imageUrl: PropTypes.string,
//     stockStatus: PropTypes.string,
//   }).isRequired,
//   handleEdit: PropTypes.func.isRequired,
//   handleDelete: PropTypes.func.isRequired,
//   handleShowDetails: PropTypes.func.isRequired,
// };

// export default AdminProductTile;
