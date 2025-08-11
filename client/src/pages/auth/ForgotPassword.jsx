import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/store/auth-slice";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then((payload) => {
        toast({
          title: "İstek Gönderildi",
          description: payload.message,
          variant: "success",
        });
        setEmail("");
      })
      .catch((error) => {
        toast({
          title: "Hata",
          description: error.message || "Bir hata oluştu.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthLayout
      title="Şifreni Sıfırla"
      description="Hesabınıza kayıtlı e-posta adresini girin, size bir sıfırlama bağlantısı gönderelim."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">E-posta Adresi</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@mail.com"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Sıfırlama Bağlantısı Gönder
        </Button>
        <div className="text-center">
            <Button asChild variant="link" className="text-muted-foreground">
                <Link to="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Giriş'e Geri Dön
                </Link>
            </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;