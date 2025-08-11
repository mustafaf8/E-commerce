import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import {
  Loader2,
  Phone,
  KeyRound,
  User as UserIcon,
  Mail,
  Chrome,
  LogIn,
  ArrowLeft,
} from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase-config";
import {
  verifyPhoneLogin,
  registerPhoneUser,
  loginUser,
} from "@/store/auth-slice";
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";

const initialEmailPasswordState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [step, setStep] = useState("select");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userName, setUserName] = useState("");
  const [emailPasswordFormData, setEmailPasswordFormData] = useState(
    initialEmailPasswordState
  );
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shop/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (step === "phone" && !window.recaptchaVerifier) {
      try {

        const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {
          },
          "expired-callback": () => {
            toast({
              variant: "warning",
              title: "Doğrulama süresi doldu, lütfen tekrar deneyin.",
            });
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
            }
          },
        });

        verifier
          .render()
          .then((widgetId) => {
            window.recaptchaWidgetId = widgetId;
          })
          .catch((err) => {
            toast({ variant: "destructive", title: "reCAPTCHA yüklenemedi." });
          });
        window.recaptchaVerifier = verifier;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Giriş sistemi başlatılamadı.",
          description: "Lütfen sayfayı yenileyip tekrar deneyin.",
        });
      }
    }
  }, [step, toast]);

  useEffect(() => {
    let interval = null;
    if (resendDisabled && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (resendTimer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendDisabled, resendTimer]);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (!isValidPhoneNumber(phoneNumber)) {
      toast({ variant: "destructive", title: "Geçersiz Telefon Numarası" });
      return;
    }
    if (!window.recaptchaVerifier) {
      toast({ variant: "destructive", title: "reCAPTCHA Hazır Değil" });
      return;
    }
    setOtpLoading(true);
    setLoading(true);
    setResendDisabled(true);
    setResendTimer(60);

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      setStep("otp");
      toast({ variant: "success", title: "OTP Gönderildi" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "SMS Gönderilemedi",
        description: error.message,
      });
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      setResendDisabled(false);
      setResendTimer(0);
    } finally {
      setOtpLoading(false);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!otp || otp.length !== 6 || !confirmationResult) {
      toast({ variant: "destructive", title: "Geçersiz Kod" });
      return;
    }
    setOtpLoading(true);
    setLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const firebaseToken = await user.getIdToken();

      const backendResponse = await dispatch(
        verifyPhoneLogin({ token: firebaseToken })
      ).unwrap();

      if (backendResponse.success && !backendResponse.isNewUser) {
        toast({ variant: "success", title: "Giriş Başarılı!" });
      } else if (backendResponse.success && backendResponse.isNewUser) {
        setStep("name");
        toast({ variant: "info", title: "Hesabınızı Tamamlayın" });
      } else {
        throw new Error(
          backendResponse.message || "Backend doğrulaması başarısız."
        );
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "SMS Doğrulama Hatası",
        description: error.message,
      });
      setStep("phone");
    } finally {
      setOtpLoading(false);
      setLoading(false);
    }
  };

  const handleRegisterNewUser = async (event) => {
    event.preventDefault();
    if (!userName.trim()) {
      toast({ variant: "destructive", title: "İsim Alanı Boş" });
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      toast({
        variant: "destructive",
        title: "Oturum Hatası",
        description: "Kullanıcı bilgisi alınamadı. Tekrar deneyin.",
      });
      setStep("phone");
      return;
    }

    setNameLoading(true);
    setLoading(true);

    try {
      const firebaseToken = await user.getIdToken(true);
      const backendResponse = await dispatch(
        registerPhoneUser({ token: firebaseToken, userName: userName.trim() })
      ).unwrap();

      if (backendResponse.success) {
        toast({ variant: "success", title: "Kayıt Başarılı!" });
      } else {
        throw new Error(backendResponse.message || "Backend kaydı başarısız.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Kayıt Başarısız",
        description: error.message,
      });
    } finally {
      setNameLoading(false);
      setLoading(false);
    }
  };

  const handleResendOtp = (event) => {
    event.preventDefault();
    handleSendOtp(event);
  };

  const handleEmailPasswordLogin = (event) => {
    event.preventDefault();
    setEmailLoading(true);
    setLoading(true);
    dispatch(loginUser(emailPasswordFormData))
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          toast({
            title: payload.message || "Giriş Başarılı!",
            variant: "success",
          });
        } else {
          toast({
            title: payload.message || "Giriş Başarısız",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        toast({
          title: error.message || "Giriş sırasında hata oluştu",
          variant: "destructive",
        });
      })
      .finally(() => {
        setEmailLoading(false);
        setLoading(false);
        setEmailPasswordFormData(initialEmailPasswordState);
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };

  // Method Selection Screen
  const renderSelectMethod = () => {
    const footerContent = (
      <span>
        Hesabınız yok mu?{" "}
        <Link
          to="/auth/register"
          className="font-medium text-primary hover:underline transition-colors"
        >
          Kayıt Ol
        </Link>
      </span>
    );

    return (
      <AuthLayout
        title="Hoş Geldiniz"
        description="Devam etmek için bir giriş yöntemi seçin"
        footerContent={footerContent}
      >
        <div className="space-y-4">
          <Button
            variant="default"
            className="w-full"
            onClick={() => setStep("email")}
          >
            <Mail className="mr-2 h-4 w-4" />
            E-posta ile Giriş Yap
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google ile Devam Et
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                veya
              </span>
            </div>
          </div>

          {/* Geçici olarak telefon girişi gizlendi
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setStep("phone")}
          >
            <Phone className="mr-2 h-4 w-4" />
            Telefon ile Giriş Yap
          </Button>
          */}
        </div>
      </AuthLayout>
    );
  };

  // Phone Input Screen
  const renderPhoneInput = () => (
    <AuthLayout
      title="Telefon Numarası"
      description="Doğrulama kodu göndermek için telefon numaranızı girin"
    >
      <form onSubmit={handleSendOtp} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon Numarası</Label>
          <PhoneInput
            international
            defaultCountry="TR"
            value={phoneNumber}
            onChange={setPhoneNumber}
            id="phone"
            placeholder="Telefon numaranızı girin"
          />
          {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
            <p className="text-xs text-destructive">
              Geçerli bir telefon numarası girin.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full"
            disabled={
              otpLoading ||
              loading ||
              !phoneNumber ||
              (phoneNumber && !isValidPhoneNumber(phoneNumber))
            }
          >
            {otpLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Phone className="mr-2 h-4 w-4" />
            )}
            SMS Gönder
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setStep("select")}
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Geri Dön
          </Button>
        </div>
      </form>
    </AuthLayout>
  );

  // OTP Verification Screen
  const renderOtpInput = () => (
    <AuthLayout
      title="Doğrulama Kodu"
      description={`${phoneNumber} numarasına gönderilen 6 haneli kodu girin`}
    >
      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp">Doğrulama Kodu</Label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="000000"
            className="text-center tracking-[0.5em] text-xl font-semibold"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={otpLoading || loading || otp.length !== 6}
        >
          {otpLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="mr-2 h-4 w-4" />
          )}
          Kodu Doğrula
        </Button>

        <div className="flex justify-between items-center text-sm">
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleResendOtp}
            disabled={resendDisabled || loading}
            className="px-0 h-auto"
          >
            {resendDisabled
              ? `Tekrar gönder (${resendTimer}s)`
              : "Kodu Tekrar Gönder"}
          </Button>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => {
              setStep("phone");
              setOtp("");
              setConfirmationResult(null);
            }}
            className="px-0 h-auto"
          >
            Numarayı Değiştir
          </Button>
        </div>
      </form>
    </AuthLayout>
  );

  // Name Input Screen
  const renderNameInput = () => (
    <AuthLayout
      title="Hesabınızı Tamamlayın"
      description="Son adım olarak adınızı ve soyadınızı girin"
    >
      <form onSubmit={handleRegisterNewUser} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="userName">Ad Soyad</Label>
          <Input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Adınız Soyadınız"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={nameLoading || loading || !userName.trim()}
        >
          {nameLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserIcon className="mr-2 h-4 w-4" />
          )}
          Kaydı Tamamla ve Giriş Yap
        </Button>
      </form>
    </AuthLayout>
  );

  // Email Password Login Screen
  const renderEmailPasswordLogin = () => {
    const footerContent = (
      <span>
        Hesabınız yok mu?{" "}
        <Link
          to="/auth/register"
          className="font-medium text-primary hover:underline transition-colors"
        >
          Kayıt Ol
        </Link>
      </span>
    );

    return (
      <AuthLayout
        title="E-posta ile Giriş"
        description="E-posta adresiniz ve şifrenizle giriş yapın"
        footerContent={footerContent}
      >
        <div className="space-y-6">
          <CommonForm
            formControls={loginFormControls}
            buttonText={
              emailLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş Yapılıyor...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Giriş Yap
                </div>
              )
            }
            formData={emailPasswordFormData}
            setFormData={setEmailPasswordFormData}
            onSubmit={handleEmailPasswordLogin}
            isBtnDisabled={emailLoading || loading}
          />
              <div className="text-right mt-4">
            <Link
                to="/auth/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                   >
                  Şifremi Unuttum?
             </Link>
               </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setStep("select")}
          >
            <ArrowLeft className="mr-2 h-3 w-3" />
            Diğer Giriş Yöntemleri
          </Button>
        </div>
      </AuthLayout>
    );
  };

  return (
    <>
      <div className="hidden" id="recaptcha-container"></div>
      
      {step === "select" && renderSelectMethod()}
      {step === "phone" && renderPhoneInput()}
      {step === "otp" && renderOtpInput()}
      {step === "name" && renderNameInput()}
      {step === "email" && renderEmailPasswordLogin()}
    </>
  );
}

export default AuthLogin;
