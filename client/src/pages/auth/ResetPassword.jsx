import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/auth/AuthLayout";
import { Loader2, KeyRound } from "lucide-react";
import { resetPassword } from "@/store/auth-slice"; 

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useParams();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Şifreler Uyuşmuyor",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 4) {
      toast({
        title: "Şifre çok kısa",
        description: "Şifreniz en az 4 karakter olmalıdır.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    dispatch(resetPassword({ token, password }))
      .unwrap()
      .then((payload) => {
        toast({
          title: "Başarılı!",
          description: payload.message,
          variant: "success",
        });
        navigate("/auth/login");
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
      title="Yeni Şifre Belirle"
      description="Lütfen yeni şifrenizi girin."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password">Yeni Şifre</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Yeni şifreniz"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Yeni şifrenizi tekrar girin"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="mr-2 h-4 w-4" />
          )}
          Şifreyi Güncelle
        </Button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;