import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthLayout from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail } from "lucide-react";
import { resendEmailVerification, verifyEmailCode } from "@/store/auth-slice";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function VerifyEmailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const query = useQuery();

  const emailFromQuery = query.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef(Array.from({ length: 6 }, () => null));
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (emailFromQuery && emailFromQuery !== email) {
      setEmail(emailFromQuery);
    }
  }, [emailFromQuery]);

  const handleVerify = async (e) => {
    e?.preventDefault?.();
    if (!email || !code || code.length !== 6) {
      toast({ variant: "destructive", title: "Lütfen e-posta ve 6 haneli kodu girin" });
      return;
    }
    setVerifyLoading(true);
    try {
      const res = await dispatch(verifyEmailCode({ email, code })).unwrap();
      if (res?.success) {
        toast({ variant: "success", title: res.message || "E-posta doğrulandı" });
        navigate("/auth/login?verified=1");
      } else {
        toast({ variant: "destructive", title: res?.message || "Kod doğrulanamadı" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: err?.message || "Kod doğrulanamadı" });
    } finally {
      setVerifyLoading(false);
    }
  };

  const updateCodeFromDigits = (nextDigits) => {
    const joined = nextDigits.join("");
    setCode(joined);
  };

  const handleDigitChange = (index, value) => {
    const sanitized = (value || "").replace(/[^0-9]/g, "").slice(0, 1);
    const nextDigits = [...digits];
    nextDigits[index] = sanitized;
    setDigits(nextDigits);
    updateCodeFromDigits(nextDigits);

    if (sanitized && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = "";
        setDigits(nextDigits);
        updateCodeFromDigits(nextDigits);
      } else if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    const pasted = (e.clipboardData.getData("text") || "").replace(/[^0-9]/g, "");
    if (pasted.length === 6) {
      const nextDigits = pasted.split("").slice(0, 6);
      setDigits(nextDigits);
      updateCodeFromDigits(nextDigits);
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({ variant: "destructive", title: "Lütfen e-posta adresinizi girin" });
      return;
    }
    setResendLoading(true);
    try {
      const res = await dispatch(resendEmailVerification({ email })).unwrap();
      if (res?.success) {
        toast({ variant: "success", title: res?.message || "Kod gönderildi" });
        setCode("");
      } else {
        toast({ variant: "destructive", title: res?.message || "Kod gönderilemedi" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: err?.message || "Kod gönderilemedi" });
    } finally {
      setResendLoading(false);
    }
  };

  const footerContent = (
    <span>
      Zaten hesabınız var mı?{" "}
      <Link className="font-medium text-primary hover:underline transition-colors" to="/auth/login">
        Giriş Yap
      </Link>
    </span>
  );

  return (
    <AuthLayout
      title="E-posta Doğrulama"
      description={email ? `${email} adresine gönderilen 6 haneli kodu girin` : "E-posta adresinizi ve size gönderilen 6 haneli kodu girin"}
      footerContent={footerContent}
    >
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            placeholder="ornek@eposta.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code-0">Doğrulama Kodu</Label>
          <div
            className="flex items-center justify-center gap-2"
            role="group"
            aria-label="Doğrulama kodu giriş alanları"
            onPaste={handleCodePaste}
          >
            {digits.map((d, idx) => (
              <input
                key={idx}
                id={`code-${idx}`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="w-10 h-10 md:w-12 md:h-12 text-center text-xl md:text-2xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-green-600"
                value={d}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                ref={(el) => (inputRefs.current[idx] = el)}
                aria-label={`Kod hane ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={verifyLoading || !email || code.length !== 6}>
          {verifyLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Kodu Doğrula
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={handleResend}
          disabled={resendLoading || !email}
        >
          {resendLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          Yeni Kod Gönder
        </Button>
      </form>
    </AuthLayout>
  );
}
