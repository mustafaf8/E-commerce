// import { Key } from "lucide-react";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardFooter } from "../ui/card";
// import { Label } from "../ui/label";

// function AddressCard({
//   addressInfo,
//   handleDeleteAddress,
//   handleEditAddress,
//   setCurrentSelectedAddress,
//   selectedId,
// }) {
//   return (
//     <Card
//       onClick={
//         setCurrentSelectedAddress
//           ? () => setCurrentSelectedAddress(addressInfo)
//           : null
//       }
//       className={`cursor-pointer border-red-700 ${
//         selectedId?._id === addressInfo?._id
//           ? "border-red-900 border-[4px]"
//           : "border-black"
//       }`}
//     >
//       <CardContent className="grid p-4 gap-4">
//         <Label>İl: {addressInfo?.city}</Label>
//         <Label>Adres: {addressInfo?.address}</Label>
//         <Label>Posta kodu: {addressInfo?.pincode}</Label>
//         <Label>Telefon: {addressInfo?.phone}</Label>
//         <Label>Not: {addressInfo?.notes}</Label>
//       </CardContent>
//       <CardFooter className="p-3 flex justify-between">
//         <Button onClick={() => handleEditAddress(addressInfo)}>Düzenle</Button>
//         <Button onClick={() => handleDeleteAddress(addressInfo)}>Sil</Button>
//       </CardFooter>
//     </Card>
//   );
// }

// export default AddressCard;

// client/src/components/shopping-view/address-card.jsx
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { CheckCircle2, MapPin, Phone, Edit, Trash2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  const handleEditClick = (e) => {
    e.stopPropagation();
    handleEditAddress(addressInfo);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleDeleteAddress(addressInfo);
  };
  console.log(
    `AddressCard ID: ${addressInfo?._id}, Selected ID: ${selectedId?._id}, isSelected: ${isSelected}`
  );

  // Seçili duruma göre dinamik olarak atanacak CSS sınıfları (YEŞİL RENK)
  const cardClasses = `
    cursor-pointer
    transition-all duration-300 ease-in-out
    border rounded-md overflow-hidden
    relative
    ${
      isSelected
        ? "border-green-600 border-2 shadow-lg bg-green-50 ring-1 ring-green-600 ring-offset-1"
        : "border-gray-200 hover:border-gray-400 hover:shadow-md"
    }
  `;

  return (
    <Card
      onClick={() => setCurrentSelectedAddress(addressInfo)}
      className={cardClasses}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-600 rounded-full text-white animate-pulse">
          <CheckCircle2 size={20} />
        </div>
      )}

      <CardContent className="p-4 space-y-3 text-sm">
        {/* Adres Satırı 1 */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
          <p className="font-medium text-gray-800">{addressInfo?.address}</p>
        </div>
        {/* Şehir & Posta Kodu */}
        <div className="pl-6 text-gray-600">
          <p>
            {addressInfo?.city}, {addressInfo?.pincode}
          </p>
        </div>
        {/* Telefon */}
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <p className="text-gray-600">{addressInfo?.phone}</p>
        </div>
        {/* Notlar (varsa) */}
        {addressInfo?.notes && (
          <p className="pl-6 text-xs text-gray-500 italic pt-2 border-t border-gray-100 mt-2">
            Not: {addressInfo?.notes}
          </p>
        )}
      </CardContent>

      {handleEditAddress && handleDeleteAddress && (
        <CardFooter className="p-2 flex justify-end gap-1 border-t border-gray-100 bg-gray-50/50">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-blue-600 hover:bg-blue-100"
            onClick={handleEditClick}
          >
            <Edit size={14} className="mr-1" /> Düzenle
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-red-600 hover:bg-red-100"
            onClick={handleDeleteClick}
          >
            <Trash2 size={14} className="mr-1" /> Sil
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default AddressCard;
