import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const id = searchParams.get("id");
  const message = searchParams.get("message");

  let statusConfig = {
    icon: <AlertCircle className="w-16 h-16 text-yellow-500" />,
    title: "Belirsiz Durum",
    description: "Ödeme durumu bilinmiyor.",
    cardClass: "border-yellow-500 bg-yellow-50",
  };

  if (status === "success") {
    statusConfig = {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      title: "Ödeme Başarılı",
      description: "Ödeme başarıyla alındı ve kaydedildi.",
      cardClass: "border-green-500 bg-green-50",
    };
  } else if (status === "failed") {
    statusConfig = {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: "Ödeme Başarısız",
      description: `Ödeme işlemi başarısız oldu. ${message ? `Hata: ${message}` : ''}`,
      cardClass: "border-red-500 bg-red-50",
    };
  } else if (status === "error") {
     statusConfig = {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: "Sistem Hatası",
      description: `İşlem sırasında bir hata oluştu. ${message ? `Detay: ${message}` : ''}`,
      cardClass: "border-red-500 bg-red-50",
    };
  }
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Card className={`text-center w-full max-w-md ${statusConfig.cardClass}`}>
        <CardHeader>
          <div className="mx-auto mb-4">{statusConfig.icon}</div>
          <CardTitle className="text-2xl">{statusConfig.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{statusConfig.description}</p>
          {id && <p className="text-sm text-gray-500 mt-2">İşlem ID: {id}</p>}
          <Button asChild className="mt-6" aria-label="Yeni Ödeme Sayfasına Dön">
            <Link to="/admin/direct-payment">Yeni Ödeme Sayfasına Dön</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStatusPage;