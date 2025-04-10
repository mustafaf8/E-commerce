// client/src/pages/shopping-view/payment-success.jsx
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertTriangle } from "lucide-react"; // İkonlar

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  // const message = searchParams.get('message'); // İsteğe bağlı mesaj

  // Bu sayfa artık hem başarıyı hem de "already_processed" gibi durumları gösterebilir
  const isSuccess = status === "success" || status === "already_processed";

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center text-center min-h-[60vh]">
      {isSuccess ? (
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      ) : (
        // Beklenmedik bir durum ama success sayfasında gösterilebilir
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      )}

      <h1 className="text-2xl font-semibold mb-2">
        {isSuccess ? "Ödemeniz Başarıyla Alındı!" : "Ödeme Durumu"}
      </h1>

      {status === "success" && (
        <p className="text-gray-600 mb-4">
          Siparişiniz onaylandı
          {orderId ? ` ve sipariş numaranız: ${orderId}` : ""}. En kısa sürede
          hazırlanıp kargoya verilecektir.
        </p>
      )}
      {status === "already_processed" && (
        <p className="text-gray-600 mb-4">
          Bu siparişin ({orderId}) ödemesi daha önce alınmış.
        </p>
      )}
      {/* Diğer olası 'başarılı' durumlar buraya eklenebilir */}

      <div className="flex space-x-4 mt-6">
        <Link to="/shop/home" className="text-blue-600 hover:underline">
          Alışverişe Devam Et
        </Link>
        {orderId && (
          <Link to="/shop/account" className="text-blue-600 hover:underline">
            Siparişlerim Sayfasına Git
          </Link>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
