import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { CheckCircle2, MapPin, Phone, Edit, Trash2 } from "lucide-react";
import PropTypes from "prop-types";

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

  const cardClasses = `
    cursor-pointer
    transition-all duration-300 ease-in-out
    border rounded-md overflow-hidden
    relative
    ${
      isSelected && setCurrentSelectedAddress
        ? "border-green-600 border-2 shadow-lg bg-green-50 ring-1 ring-green-600 ring-offset-1"
        : "border-gray-200 hover:border-gray-400 hover:shadow-md"
    }
  `;

  return (
    <Card
      onClick={() => {
        if (setCurrentSelectedAddress) {
          setCurrentSelectedAddress(addressInfo);
        }
      }}
      className={cardClasses}
    >
      {isSelected && setCurrentSelectedAddress && (
        <div className="absolute top-2 right-2 bg-green-600 rounded-full text-white animate-pulse">
          <CheckCircle2 size={20} />
        </div>
      )}

      <CardContent className="p-4 space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
          <p className="font-medium text-gray-800">{addressInfo?.address}</p>
        </div>
        <div className="pl-6 text-gray-600">
          <p>
            {addressInfo?.city}, {addressInfo?.pincode}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <p className="text-gray-600">{addressInfo?.phone}</p>
        </div>
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
            aria-label="Adresi Düzenle"
          >
            <Edit size={14} className="mr-1" /> Düzenle
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-red-600 hover:bg-red-100"
            onClick={handleDeleteClick}
            aria-label="Adresi Sil"
          >
            <Trash2 size={14} className="mr-1" /> Sil
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
AddressCard.propTypes = {
  addressInfo: PropTypes.shape({
    _id: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    pincode: PropTypes.string,
    phone: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  handleDeleteAddress: PropTypes.func,
  handleEditAddress: PropTypes.func,
  setCurrentSelectedAddress: PropTypes.func,
  selectedId: PropTypes.shape({
    _id: PropTypes.string,
  }),
};

export default AddressCard;
