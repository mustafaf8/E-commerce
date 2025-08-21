import { useEffect, useMemo, useState } from "react";
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
          <Label htmlFor="code">Doğrulama Kodu</Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
            className="text-center tracking-[0.5em] text-xl font-semibold"
            required
          />
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
