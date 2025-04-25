import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CommonForm from "@/components/common/form";
import { userInfoFormControls } from "@/config";
import { updateUserDetails } from "@/store/auth-slice"; // Henüz oluşturmadık
import { useToast } from "@/components/ui/use-toast"; // Bildirimler için
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function UserInfo() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
  });

  useEffect(() => {
    // Kullanıcı bilgileri değiştiğinde formu güncelle
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  function handleUpdateUserInfo(event) {
    event.preventDefault();
    dispatch(updateUserDetails(formData)).then((result) => {
      if (result?.payload?.success) {
        toast({ title: "Bilgiler güncellendi", variant: "success" });
      } else {
        toast({
          title: result?.payload?.message || "Hata oluştu",
          variant: "destructive",
        });
      }
    });
  }

  if (isLoading || !user) {
    return (
      <div>
        <h2>Kullanıcı Bilgileri</h2>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    );
  }

  return (
    <div className="p-10 max-[1024px]:p-1">
      <CommonForm
        formControls={userInfoFormControls}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateUserInfo}
        buttonText="Bilgileri Güncelle"
      />
    </div>
  );
}

export default UserInfo;
