import CommonForm from "@/components/common/form";
import AuthLayout from "@/components/auth/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
          variant: "success",
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const footerContent = (
    <span>
      Zaten hesabınız var mı?{" "}
      <Link
        className="font-medium text-primary hover:underline transition-colors"
        to="/auth/login"
      >
        Giriş Yap
      </Link>
    </span>
  );

  return (
    <AuthLayout
      title="Hesap Oluştur"
      description="Hemen ücretsiz hesabınızı oluşturun"
      footerContent={footerContent}
    >
      <CommonForm
        formControls={registerFormControls}
        buttonText={
          isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Kayıt Yapılıyor...
            </div>
          ) : (
            <div className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Kayıt Ol
            </div>
          )
        }
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isLoading}
      />
    </AuthLayout>
  );
}

export default AuthRegister;
