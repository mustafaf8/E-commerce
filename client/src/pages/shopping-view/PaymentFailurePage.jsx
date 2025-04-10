// YENİ DOSYA: client/src/pages/shopping-view/PaymentFailurePage.jsx
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react"; // Hata ikonu

const PaymentFailurePage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const errorCode = searchParams.get("errorCode");
  const message = searchParams.get("message"); // Opsiyonel mesaj

  let failureMessage = "Ödeme sırasında bir hata oluştu.";
  if (status === "failed") {
    failureMessage = `Ödeme alınamadı. ${
      errorCode ? `(Hata Kodu: ${errorCode})` : ""
    }`;
  } else if (status === "retrieval_error") {
    failureMessage = "Ödeme sonucu doğrulanırken bir hata oluştu.";
  } else if (status === "server_error") {
    failureMessage = "Sunucu hatası nedeniyle işlem tamamlanamadı.";
  } else if (status === "error" && message === "OrderNotFoundForToken") {
    failureMessage = "Ödeme bilgisi ile eşleşen sipariş bulunamadı.";
  } else if (status === "error" && message === "InvalidCallback") {
    failureMessage = "Geçersiz ödeme dönüş bilgisi alındı.";
  }

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Ödeme Başarısız</h1>
      <p className="text-gray-600 mb-4">{failureMessage}</p>
      {orderId && (
        <p className="text-sm text-gray-500 mb-4">
          İlgili Sipariş ID: {orderId}
        </p>
      )}

      <div className="flex space-x-4 mt-6">
        <Link to="/shop/checkout" className="text-blue-600 hover:underline">
          Tekrar Dene
        </Link>
        <Link to="/shop/home" className="text-blue-600 hover:underline">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
