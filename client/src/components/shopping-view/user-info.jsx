import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CommonForm from "@/components/common/form";
import { userInfoFormControls } from "@/config";
import { updateUserDetails } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

function UserInfo() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    tcKimlikNo: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        tcKimlikNo: user.tcKimlikNo || "",
      });
    }
  }, [user]);

  function handleUpdateUserInfo(event) {
    event.preventDefault();

    if (formData.tcKimlikNo && !/^[0-9]{11}$/.test(formData.tcKimlikNo)) {
      toast({
        title: "TC Kimlik Numarası 11 haneli ve sadece rakam olmalıdır",
        variant: "destructive",
      });
      return;
    }

    if (
      formData.phoneNumber === (user?.phoneNumber || "") &&
      formData.tcKimlikNo === (user?.tcKimlikNo || "")
    ) {
      toast({ title: "Değişiklik yapılmadı.", variant: "info" });
      return;
    }

    const dataToSend = { 
      phoneNumber: formData.phoneNumber,
      tcKimlikNo: formData.tcKimlikNo,
    };

    dispatch(updateUserDetails(dataToSend))
      .unwrap()
      .then((result) => {
        if (result?.success) {
          toast({ title: "Bilgiler güncellendi", variant: "success" });
        } else {
          toast({
            title: result?.message || "Hata oluştu",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        toast({
          title: error?.message || "Bilgiler güncellenemedi",
          variant: "destructive",
        });
      });
  }

  if (isLoading && !user) {
    return (
      <div className="p-10 max-[1024px]:p-1 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Kullanıcı Bilgileri</h2>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-1/2 mt-4" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-[1024px]:p-4">
      <h2 className="text-xl font-semibold mb-6">Kullanıcı Bilgileri</h2>{" "}
      <CommonForm
        formControls={userInfoFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateUserInfo}
        buttonText="Bilgileri Güncelle"
        formClassName="space-y-5"
        labelClassName="text-base font-medium"
        buttonSize="lg"
        buttonClassName="w-full mt-6"
      />
    </div>
  );
}

export default UserInfo;
