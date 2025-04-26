// import CommonForm from "@/components/common/form";
// import { useToast } from "@/components/ui/use-toast";
// import { loginFormControls } from "@/config";
// import { loginUser } from "@/store/auth-slice";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";

// const initialState = {
//   email: "",
//   password: "",
// };

// function AuthLogin() {
//   const [formData, setFormData] = useState(initialState);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   function onSubmit(event) {
//     event.preventDefault();

//     dispatch(loginUser(formData)).then((data) => {
//       if (data?.payload?.success) {
//         toast({
//           title: data?.payload?.message,
//           variant: "success",
//         });
//       } else {
//         toast({
//           title: data?.payload?.message,
//           variant: "destructive",
//         });
//       }
//     });
//   }

//   return (
//     <div className="mx-auto w-full max-w-md space-y-6">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold tracking-tight text-foreground">
//           Hesabınıza giriş yapın
//         </h1>
//         <p className="mt-2">
//           Hesabınız yok mu
//           <Link
//             className="font-medium ml-2 text-primary hover:underline"
//             to="/auth/register"
//           >
//             Kayıt Ol
//           </Link>
//         </p>
//       </div>
//       <CommonForm
//         formControls={loginFormControls}
//         buttonText={"Giriş Yap"}
//         formData={formData}
//         setFormData={setFormData}
//         onSubmit={onSubmit}
//       />
//     </div>
//   );
// }

// export default AuthLogin;

// client/src/pages/auth/login.jsx
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Button import edildi
import { ChromeIcon } from "lucide-react"; // Google ikonu için (veya başka bir ikon)

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    // Normal giriş işlemi (mevcut kod)
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
          variant: "success",
        });
        // Yönlendirme CheckAuth içinde yapılıyor olmalı
      } else {
        toast({
          title: data?.payload?.message || "Giriş başarısız", // Hata mesajını göster
          variant: "destructive",
        });
      }
    });
  }

  // --- YENİ: Google ile Giriş Fonksiyonu ---
  const handleGoogleLogin = () => {
    // Kullanıcıyı backend'deki Google giriş rotasına yönlendir
    // Geliştirme ortamında doğrudan URL kullanılabilir. Production'da backend URL'sini dinamik almak daha iyidir.
    window.location.href = "http://localhost:5000/api/auth/google";
  };
  // --- ---

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Hesabınıza giriş yapın
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {" "}
          {/* text-sm ve renk eklendi */}
          Hesabınız yok mu? {/* Boşluk eklendi */}
          <Link
            className="font-medium text-primary hover:underline"
            to="/auth/register"
          >
            Kayıt Ol
          </Link>
        </p>
      </div>
      {/* Normal Giriş Formu */}
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Giriş Yap"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      {/* --- YENİ: "veya" Ayırıcı --- */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Veya şununla devam et
          </span>
        </div>
      </div>
      {/* --- --- */}

      {/* --- YENİ: Google ile Giriş Butonu --- */}
      <Button
        variant="outline"
        className="w-full inline-flex items-center justify-center gap-2" // gap eklendi
        onClick={handleGoogleLogin}
      >
        <ChromeIcon className="h-5 w-5" /> {/* Google ikonu */}
        Google ile Giriş Yap
      </Button>
      {/* --- --- */}
    </div>
  );
}

export default AuthLogin;
