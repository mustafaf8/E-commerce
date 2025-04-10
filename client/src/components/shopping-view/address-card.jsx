import { Key } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>İl: {addressInfo?.city}</Label>
        <Label>Adres: {addressInfo?.address}</Label>
        <Label>Posta kodu: {addressInfo?.pincode}</Label>
        <Label>Telefon: {addressInfo?.phone}</Label>
        <Label>Not: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Düzenle</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Sil</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
