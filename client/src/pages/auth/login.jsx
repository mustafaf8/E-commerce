import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Phone,
  KeyRound,
  User as UserIcon,
  Mail,
  ChromeIcon,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

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
    let verifier = window.recaptchaVerifier;
    if (step === "phone" && !verifier) {
      try {
        console.log("Setting up reCAPTCHA...");
        verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: (response) => console.log("reCAPTCHA verified"),
          "expired-callback": () => {
            console.warn("reCAPTCHA expired.");
            toast({
              variant: "warning",
              title: "reCAPTCHA süresi doldu, tekrar deneyin.",
            });
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
            }
          },
        });
        verifier.render().catch((err) => {
          console.error("reCAPTCHA render error:", err);
          toast({ variant: "destructive", title: "reCAPTCHA yüklenemedi." });
        });
        window.recaptchaVerifier = verifier;
      } catch (error) {
        console.error("Error setting up reCAPTCHA:", error);
        toast({
          variant: "destructive",
          title: "Giriş sistemi başlatılamadı.",
        });
      }
    }

    return () => {
      if (verifier && typeof verifier.clear === "function") {
        try {
          verifier.clear();
          console.log("reCAPTCHA cleared.");
          window.recaptchaVerifier = null;
        } catch (e) {
          console.warn("Could not clear reCAPTCHA:", e);
        }
      }
    };
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
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "SMS Gönderilemedi",
        description: error.message,
      });
      setResendDisabled(false);
      setResendTimer(0);

      if (window.recaptchaVerifier && window.recaptchaWidgetId !== undefined) {
        try {
          grecaptcha.reset(window.recaptchaWidgetId);
        } catch (e) {
          console.error("Recaptcha reset failed", e);
        }
      }
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
      console.error("Error verifying OTP or backend check:", error);
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
      const firebaseToken = await user.getIdToken(true); // Force refresh token
      const backendResponse = await dispatch(
        registerPhoneUser({ token: firebaseToken, userName: userName.trim() })
      ).unwrap();

      if (backendResponse.success) {
        toast({ variant: "success", title: "Kayıt Başarılı!" });
      } else {
        throw new Error(backendResponse.message || "Backend kaydı başarısız.");
      }
    } catch (error) {
      console.error("Error registering new user:", error);
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

  const handleResendOtp = () => {
    if (window.recaptchaVerifier && window.recaptchaWidgetId !== undefined) {
      try {
        grecaptcha.reset(window.recaptchaWidgetId);
      } catch (e) {
        console.error("Recaptcha reset failed", e);
      }
    }
    handleSendOtp({ preventDefault: () => {} });
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
        console.error("Email login error:", error);
        toast({
          title: error.message || "Giriş sırasında hata oluştu",
          variant: "destructive",
        });
      })
      .finally(() => {
        setEmailLoading(false);
        setLoading(false);
        setEmailPasswordFormData(initialEmailPasswordState); // Formu temizle
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };

  const renderSelectMethod = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Giriş Yap veya Kayıt Ol
        </CardTitle>
        <CardDescription>Devam etmek için bir yöntem seçin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setStep("email")}
        >
          <Mail className="mr-2 h-4 w-4" /> E-posta ile Giriş Yap
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <ChromeIcon className="mr-2 h-4 w-4" /> Google ile Giriş Yap
        </Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              veya
            </span>
          </div>
        </div>

        <Button
          className="w-full"
          variant="outline"
          onClick={() => setStep("phone")}
        >
          <Phone className="mr-2 h-4 w-4" /> Telefon Numarası ile Giriş Yap
        </Button>
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground justify-center">
        Hesabınız yok mu?{" "}
        <Link
          to="/auth/register"
          className="underline ml-1 font-bold text-black"
        >
          Kayıt Ol
        </Link>
      </CardFooter>
    </Card>
  );

  const renderPhoneInput = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Telefon Numarası</CardTitle>
        <CardDescription>
          Devam etmek için telefon numaranızı girin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <Label htmlFor="phone" className="sr-only">
              Telefon Numarası
            </Label>
            <PhoneInput
              international
              defaultCountry="TR"
              value={phoneNumber}
              onChange={setPhoneNumber}
              id="phone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Telefon numaranızı girin"
            />
            {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
              <p className="text-xs text-red-600 mt-1">
                Geçerli bir numara girin.
              </p>
            )}
          </div>
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
            )}{" "}
            SMS Gönder
          </Button>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="w-full text-xs"
            onClick={() => setStep("select")}
          >
            Giriş Yöntemini Değiştir
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderOtpInput = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Kodu Doğrula</CardTitle>
        <CardDescription>
          {phoneNumber} numarasına gönderilen 6 haneli kodu girin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <Label htmlFor="otp" className="sr-only">
              Doğrulama Kodu (sms)
            </Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric" // Mobil klavyeyi rakamlara ayarlar
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="XXXXXX"
              className="mt-1 text-center tracking-[0.5em] text-xl font-semibold" // Harf aralığı ayarlandı
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
            )}{" "}
            Kodu Doğrula
          </Button>
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={handleResendOtp}
              disabled={resendDisabled || loading}
              className="text-xs px-0"
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
              className="text-xs px-0"
            >
              Numarayı Değiştir
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderNameInput = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">
          Hesabınızı Tamamlayın
        </CardTitle>
        <CardDescription>
          Lütfen adınızı ve soyadınızı girerek kaydı tamamlayın.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegisterNewUser} className="space-y-4">
          <div>
            <Label htmlFor="userName">Adınız ve Soyadınız</Label>
            <Input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Adınız Soyadınız"
              required
              className="mt-1"
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
            )}{" "}
            Kaydı Tamamla ve Giriş Yap
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderEmailPasswordLogin = () => (
    <Card className="max-[510px]:w-full w-[450px] mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">
          E-posta ile Giriş Yap
        </CardTitle>
        <CardDescription>veya</CardDescription>
        <button
          className="font-medium text-primary hover:underline"
          onClick={() => setStep("select")}
        >
          başka bir yöntem seç
        </button>
      </CardHeader>
      <CardContent>
        <CommonForm
          formControls={loginFormControls}
          buttonText={emailLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          formData={emailPasswordFormData}
          setFormData={setEmailPasswordFormData}
          onSubmit={handleEmailPasswordLogin}
          isBtnDisabled={emailLoading || loading}
        />
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground justify-center">
        Hesabınız yok mu?{" "}
        <Link
          to="/auth/register"
          className="underline ml-1 font-bold text-black"
        >
          Kayıt Ol
        </Link>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-120">
      <div className="bottom-40" id="recaptcha-container"></div>

      {step === "select" && renderSelectMethod()}
      {step === "phone" && renderPhoneInput()}
      {step === "otp" && renderOtpInput()}
      {step === "name" && renderNameInput()}
      {step === "email" && renderEmailPasswordLogin()}
    </div>
  );
}

export default AuthLogin;
