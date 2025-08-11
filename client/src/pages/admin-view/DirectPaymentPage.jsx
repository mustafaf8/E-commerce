import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import useAdminPermission from "@/hooks/useAdminPermission";
import api from "@/api/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, History, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDirectPayments } from "@/store/admin/directPaymentSlice";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const PaymentHistory = () => {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.directPayments);

  useEffect(() => {
    dispatch(fetchDirectPayments());
  }, [dispatch]);

  if (loading) return <div className="text-center p-4"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><History /> Son İşlemler</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto space-y-3">
        {payments.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Henüz işlem yapılmamış.</p>}
        {payments.map(payment => (
          <div key={payment._id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div>
              <p className={`font-bold text-lg ${payment.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                {payment.amount.toFixed(2)} TL
              </p>
              <p className="text-xs text-gray-500">{payment.customerNote || 'Not yok'}</p>
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(payment.createdAt), "d MMMM yyyy, HH:mm", { locale: tr })}
                {` - ${payment.adminId?.userName || 'Bilinmeyen'}`}
              </p>
            </div>
            <div className={`flex items-center gap-2 text-sm font-semibold ${payment.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
              {payment.status === 'paid' ? <CheckCircle /> : <XCircle />}
              <span>{payment.status === 'paid' ? 'Başarılı' : 'Başarısız'}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const DirectPaymentPage = () => {
  const [amount, setAmount] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const canManage = useAdminPermission("direct-payment", "manage");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canManage) {
        toast({ title: "Yetkiniz yok.", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
      const response = await api.post("/admin/direct-payment/initiate", {
        amount: parseFloat(amount),
        customerNote,
      });
      if (response.data.success && response.data.paymentPageUrl) {
        toast({ title: "Ödeme sayfasına yönlendiriliyorsunuz...", variant: "success" });
        window.location.href = response.data.paymentPageUrl;
      } else {
        throw new Error(response.data.message || "Ödeme başlatılamadı.");
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: error.message || "Bir sorun oluştu.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Alışverişsiz Ödeme</h1>
        <p className="text-gray-500 mt-1">Müşteriden hızlıca ödeme almak için bu aracı kullanın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="text-primary" />
                Yeni Ödeme Oluştur
              </CardTitle>
              <CardDescription>Ödeme tutarını ve açıklamasını girerek işleme başlayın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="amount" className="text-base">Ödeme Tutarı (TL) *</Label>
                <Input
                  id="amount" type="number" step="0.01" min="1"
                  value={amount} onChange={(e) => setAmount(e.target.value)}
                  placeholder="Örn: 150.75" required disabled={!canManage}
                  className="text-lg p-6 mt-2"
                />
              </div>
              <div>
                <Label htmlFor="customerNote" className="text-base">Müşteri Notu (Opsiyonel)</Label>
                <Textarea
                  id="customerNote" value={customerNote} onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Örn: Müşteri Adı, Telefon veya Sipariş Notu" disabled={!canManage}
                  className="mt-2"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={loading || !canManage || !amount || parseFloat(amount) <= 0}
                className="w-full text-lg py-6"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2 h-5 w-5" />}
                {loading ? "Yönlendiriliyor..." : "Güvenli Ödeme Sayfası Oluştur"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <PaymentHistory />
      </div>
    </div>
  );
};

export default DirectPaymentPage;