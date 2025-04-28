// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import CommonForm from "@/components/common/form";
// import { userInfoFormControls } from "@/config";
// import { updateUserDetails } from "@/store/auth-slice"; // Henüz oluşturmadık
// import { useToast } from "@/components/ui/use-toast"; // Bildirimler için
// import { Skeleton } from "@/components/ui/skeleton";

// function UserInfo() {
//   const { user, isLoading } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     userName: "",
//     email: "",
//     phoneNumber: "", // Başlangıçta boş
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         userName: user.userName || "",
//         email: user.email || "",
//         phoneNumber: user.phoneNumber || "",
//       });
//     }
//   }, [user]);

//   function handleUpdateUserInfo(event) {
//     event.preventDefault();
//     const dataToSend = {
//       userName: formData.userName,
//       email: formData.email,
//       phoneNumber: user.phoneNumber
//     };
//     dispatch(updateUserDetails(dataToSend)) // Sadece dataToSend gönderiliyor
//       .unwrap() // unwrap ile sonucu yakala
//       .then((result) => {
//         if (result?.success) {
//           toast({ title: "Bilgiler güncellendi", variant: "success" });
//           // Redux state güncellendiği için form otomatik olarak yeni user bilgisiyle dolacak
//         } else {
//           // rejectWithValue ile gelen hata mesajı
//           toast({
//             title: result?.message || "Hata oluştu",
//             variant: "destructive",
//           });
//         }
//       })
//       .catch((error) => {
//         // Eğer thunk tamamen reject olursa (ağ hatası vb.)
//         console.error("Update user details error:", error);
//         toast({
//           title: error?.message || "Bilgiler güncellenemedi",
//           variant: "destructive",
//         });
//       });
//   }

//   if (isLoading && !user) {
//     return (
//       <div className="p-10 max-[1024px]:p-1 space-y-4">
//         <h2 className="text-xl font-semibold mb-4">Kullanıcı Bilgileri</h2>{" "}
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-10 w-full" /> {/* Telefon için ek skeleton */}
//         <Skeleton className="h-10 w-1/2 mt-4" /> {/* Buton için */}
//       </div>
//     );
//   }

//   return (
//     // Padding ayarları gözden geçirildi
//     <div className="p-6 sm:p-10 max-[1024px]:p-4">
//       <h2 className="text-xl font-semibold mb-6">Kullanıcı Bilgileri</h2>{" "}
//       {/* Başlık */}
//       <CommonForm
//         formControls={userInfoFormControls} // Güncellenmiş kontroller kullanılıyor
//         formData={formData} // State'deki formData kullanılıyor (içinde phoneNumber var)
//         setFormData={setFormData} // State'i güncelleyen fonksiyon
//         onSubmit={handleUpdateUserInfo}
//         buttonText="Bilgileri Güncelle"
//         formClassName="space-y-5"
//         labelClassName="text-base font-medium"
//         buttonSize="lg"
//         buttonClassName="w-full mt-6"
//       />
//     </div>
//   );
// }

// export default UserInfo;

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CommonForm from "@/components/common/form";
import { userInfoFormControls } from "@/config";
import { updateUserDetails } from "@/store/auth-slice"; // Henüz oluşturmadık
import { useToast } from "@/components/ui/use-toast"; // Bildirimler için
import { Skeleton } from "@/components/ui/skeleton";

function UserInfo() {
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "", // Başlangıçta boş
  });

  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  function handleUpdateUserInfo(event) {
    event.preventDefault();
    const dataToSend = {};
    let hasChanges = false;
    if (formData.userName !== (user?.userName || "")) {
      dataToSend.userName = formData.userName;
      hasChanges = true;
    } else {
      dataToSend.userName = formData.userName;
    }
    if (
      isEmailEditable &&
      formData.email &&
      formData.email !== (user?.email || "")
    ) {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast({ variant: "destructive", title: "Geçersiz E-posta Formatı" });
        return;
      }
      dataToSend.email = formData.email;
      hasChanges = true;
    }
    // 3. Telefon numarasını kontrol et (düzenlenebilir ve değiştirilmişse)
    if (
      isPhoneEditable &&
      formData.phoneNumber &&
      formData.phoneNumber !== (user?.phoneNumber || "")
    ) {
      // İsteğe bağlı: Telefon format kontrolü
      if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
        toast({
          variant: "destructive",
          title: "Geçersiz Telefon Numarası Formatı",
        });
        return;
      }
      dataToSend.phoneNumber = formData.phoneNumber;
      hasChanges = true;
    }
    // 4. Eğer hiçbir düzenlenebilir alanda değişiklik yapılmadıysa
    if (!hasChanges) {
      toast({ title: "Değişiklik yapılmadı.", variant: "info" }); // Daha uygun bir mesaj
      return; // Backend'e istek gönderme
    }
    console.log("Gönderilecek veri:", dataToSend);
    dispatch(updateUserDetails(dataToSend)) // Sadece dataToSend gönderiliyor
      .unwrap() // unwrap ile sonucu yakala
      .then((result) => {
        if (result?.success) {
          toast({ title: "Bilgiler güncellendi", variant: "success" });
          // Redux state güncellendiği için form otomatik olarak yeni user bilgisiyle dolacak
        } else {
          // rejectWithValue ile gelen hata mesajı
          toast({
            title: result?.message || "Hata oluştu",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        // Eğer thunk tamamen reject olursa (ağ hatası vb.)
        console.error("Update user details error:", error);
        toast({
          title: error?.message || "Bilgiler güncellenemedi",
          variant: "destructive",
        });
      });
  }
  const dynamicallyDisabledFormControls = userInfoFormControls.map(
    (control) => {
      if (control.name === "email" && !isEmailEditable) {
        return { ...control, disabled: true };
      }
      if (control.name === "phoneNumber" && !isPhoneEditable) {
        return { ...control, disabled: true };
      }
      return control;
    }
  );

  if (isLoading && !user) {
    return (
      <div className="p-10 max-[1024px]:p-1 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Kullanıcı Bilgileri</h2>{" "}
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" /> {/* Telefon için ek skeleton */}
        <Skeleton className="h-10 w-1/2 mt-4" /> {/* Buton için */}
      </div>
    );
  }

  return (
    // Padding ayarları gözden geçirildi
    <div className="p-6 sm:p-10 max-[1024px]:p-4">
      <h2 className="text-xl font-semibold mb-6">Kullanıcı Bilgileri</h2>{" "}
      {/* Başlık */}
      <CommonForm
        formControls={dynamicallyDisabledFormControls} // Güncellenmiş kontroller kullanılıyor
        formData={formData} // State'deki formData kullanılıyor (içinde phoneNumber var)
        setFormData={setFormData} // State'i güncelleyen fonksiyon
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
