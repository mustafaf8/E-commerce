import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator"; // Görsel ayırıcı için
import ConfirmationModal from "../admin-view/ConfirmationModal";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, seciliAdresProp }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addressIdToDelete, setAddressIdToDelete] = useState(null);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "En fazla 3 adres ekleyebilirsiniz",
        variant: "destructive",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast({
              title: "Adres başarıyla güncellendi",
              variant: "success",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast({
              title: "Adres başarıyla eklendi",
              variant: "success",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    if (getCurrentAddress?._id) {
      setAddressIdToDelete(getCurrentAddress._id); // Silinecek ID'yi state'e ata
      setShowConfirmModal(true); // Modalı göster
    } else {
      console.error("Silinecek adres ID'si bulunamadı.");
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Silinecek adres bulunamadı.",
      });
    }
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      ...formData,
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  function isFormValid() {
    // Yalnızca zorunlu alanları tanımla
    const requiredFields = ["address", "city", "phone", "pincode"];

    // Bu zorunlu alanların HER BİRİNİN formData içinde olup olmadığını
    // ve değerlerinin boşlukları temizlendikten sonra boş olmadığını kontrol et
    return requiredFields.every(
      (field) =>
        Object.prototype.hasOwnProperty.call(formData, field) && // Alan formData'da var mı?
        typeof formData[field] === "string" && // Değer string mi? (trim hatasını önler)
        formData[field].trim() !== "" // Değer boş değil mi?
    );
  }
  function confirmDeleteHandler() {
    if (addressIdToDelete) {
      dispatch(
        deleteAddress({ userId: user?.id, addressId: addressIdToDelete })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          if (seciliAdresProp?._id === addressIdToDelete) {
            setCurrentSelectedAddress(null);
          }
          toast({ title: "Adres başarıyla silindi", variant: "success" });
        } else {
          toast({
            variant: "destructive",
            title: "Silme Başarısız",
            description: data.payload?.message || "Bir hata oluştu.",
          });
        }
        closeConfirmationModal(); // İşlem sonrası modalı kapat
      });
    }
  }

  function closeConfirmationModal() {
    setShowConfirmModal(false);
    setAddressIdToDelete(null);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch, user?.id]);

  console.log(
    "Address Component Render - Received selectedId:",
    seciliAdresProp
  );

  console.log(addressList, "addressList prop in Address component");

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id} // Add a unique key prop
                selectedId={seciliAdresProp}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Adresi Düzenle" : "Yeni Adres Ekle"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Düzenle" : "Ekle"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={closeConfirmationModal} // Dialog onClose ile de kapanabilir
        title="Adresi Silme Onayı"
        message="Bu adresi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDeleteHandler}
        onCancel={closeConfirmationModal}
        confirmText="Sil"
        cancelText="İptal"
      />
    </Card>
  );
}

export default Address;
