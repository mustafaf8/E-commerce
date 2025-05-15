// // client/src/pages/shopping-view/payment-success.jsx
// import React from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { CheckCircle, AlertTriangle } from "lucide-react"; // İkonlar

// const PaymentSuccessPage = () => {
//   const [searchParams] = useSearchParams();
//   const status = searchParams.get("status");
//   const orderId = searchParams.get("orderId");
//   // const message = searchParams.get('message'); // İsteğe bağlı mesaj

//   // Bu sayfa artık hem başarıyı hem de "already_processed" gibi durumları gösterebilir
//   const isSuccess = status === "success" || status === "already_processed";

//   return (
//     <div className="container mx-auto p-8 flex flex-col items-center justify-center text-center min-h-[60vh]">
//       {isSuccess ? (
//         <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
//       ) : (
//         // Beklenmedik bir durum ama success sayfasında gösterilebilir
//         <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
//       )}

//       <h1 className="text-2xl font-semibold mb-2">
//         {isSuccess ? "Ödemeniz Başarıyla Alındı!" : "Ödeme Durumu"}
//       </h1>

//       {status === "success" && (
//         <p className="text-gray-600 mb-4">
//           Siparişiniz onaylandı
//           {orderId ? ` ve sipariş numaranız: ${orderId}` : ""}. En kısa sürede
//           hazırlanıp kargoya verilecektir.
//         </p>
//       )}
//       {status === "already_processed" && (
//         <p className="text-gray-600 mb-4">
//           Bu siparişin ({orderId}) ödemesi daha önce alınmış.
//         </p>
//       )}
//       {/* Diğer olası 'başarılı' durumlar buraya eklenebilir */}

//       <div className="flex space-x-4 mt-6">
//         <Link to="/shop/home" className="text-blue-600 hover:underline">
//           Alışverişe Devam Et
//         </Link>
//         {orderId && (
//           <Link to="/shop/account" className="text-blue-600 hover:underline">
//             Siparişlerim Sayfasına Git
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccessPage;

// client/src/pages/shopping-view/payment-success.jsx
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertTriangle, Info, ShoppingBag } from "lucide-react"; // Info ikonu eklendi
import { clearGuestCart } from "@/lib/guestCartUtils";
import { useDispatch, useSelector } from "react-redux"; // useSelector eklendi
import { clearCartState } from "@/store/shop/cart-slice";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth); // Kullanıcının giriş durumunu al

  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId"); // Bu bizim sipariş takip kodumuz olacak

  const isSuccess = status === "success" || status === "already_processed";

  useEffect(() => {
    if (isSuccess) {
      // Eğer kullanıcı giriş yapmamışsa (misafir ise) yerel sepeti temizle
      if (!isAuthenticated) {
        clearGuestCart();
        console.log("Misafir sepeti ödeme sonrası temizlendi.");
      }
      // Her durumda Redux sepet state'ini de temizle
      // (Giriş yapmış kullanıcılar için backend sepeti zaten order oluşturulurken temizlenmiş olmalı,
      // ama client state'ini de sıfırlamak iyi bir pratik.)
      dispatch(clearCartState());
      console.log("Redux sepet state'i ödeme sonrası temizlendi.");
    }
  }, [isSuccess, isAuthenticated, dispatch]);

  // return (
  //   <div className="container mx-auto p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
  //     {isSuccess ? (
  //       <CheckCircle className="w-20 h-20 md:w-24 md:h-24 text-green-500 mb-6" />
  //     ) : (
  //       <AlertTriangle className="w-20 h-20 md:w-24 md:h-24 text-yellow-500 mb-6" />
  //     )}

  //     <h1 className="text-2xl md:text-3xl font-semibold mb-3">
  //       {isSuccess ? "Ödemeniz Başarıyla Alındı!" : "Ödeme Durumu"}
  //     </h1>

  //     {status === "success" && orderId && (
  //       <>
  //         <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
  //           Siparişiniz onaylandı ve başarıyla oluşturuldu.
  //         </p>
  //         <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 md:p-6 my-6 max-w-lg w-full">
  //           {" "}
  //           {/* max-w-md yerine max-w-lg veya daha geniş bir değer */}
  //           <div className="flex items-center justify-center mb-3">
  //             <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
  //             <h2 className="text-xl font-medium text-blue-700 dark:text-blue-300">
  //               Sipariş Takip Kodunuz:
  //             </h2>
  //           </div>
  //           <p className=" text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-wider bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow">
  //             {orderId}
  //           </p>
  //           <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
  //             Bu kodu kullanarak siparişinizin durumunu &quot;Hesabım {">"}{" "}
  //             Siparişlerim&quot; bölümünden (eğer üye girişi yaptıysanız) veya
  //             ileride eklenecek &quot;Sipariş Takibi&quot; sayfasından
  //             sorgulayabilirsiniz.
  //           </p>
  //           <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
  //             Sipariş detaylarınız ayrıca e-posta adresinize gönderilecektir.
  //           </p>
  //         </div>
  //         <p className="text-gray-600 dark:text-gray-400 mb-8">
  //           Siparişiniz en kısa sürede hazırlanıp kargoya verilecektir. Teşekkür
  //           ederiz!
  //         </p>
  //       </>
  //     )}

  //     {status === "already_processed" && (
  //       <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
  //         Bu siparişin ({orderId}) ödemesi daha önce başarıyla işlenmiş.
  //       </p>
  //     )}
  //     {/* Diğer olası 'başarılı' veya bilgi durumları buraya eklenebilir */}

  //     <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
  //       <Link
  //         to="/shop/home"
  //         className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md text-base font-medium transition-colors w-full sm:w-auto"
  //       >
  //         Alışverişe Devam Et
  //       </Link>
  //       {isAuthenticated &&
  //         orderId && ( // Sadece giriş yapmışsa ve orderId varsa göster
  //           <Link
  //             to="/shop/account" // Siparişlerim sekmesine yönlendirir
  //             className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 px-6 py-3 rounded-md text-base font-medium transition-colors w-full sm:w-auto"
  //           >
  //             Siparişlerimi Görüntüle
  //           </Link>
  //         )}
  //     </div>
  //   </div>
  // );

  return (
    <div className="container mx-auto p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
      {isSuccess ? (
        <CheckCircle className="w-12 h-12  text-green-500 mb-1" />
      ) : (
        <AlertTriangle className="w-12 h-12  text-yellow-500 mb-1" />
      )}

      <h1 className="text-2xl font-semibold mb-3">
        {isSuccess ? "Ödemeniz Başarıyla Alındı!" : "Ödeme Durumu"}
      </h1>

      {status === "success" && orderId && (
        <>
          <p className="text-gray-700 dark:text-gray-300 mb-0 text-lg">
            Siparişiniz onaylandı ve başarıyla oluşturuldu.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 md:p-6 my-4 max-w-lg w-full">
            <div className="flex items-center justify-center mb-3">
              <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-medium text-blue-700 dark:text-blue-300">
                Sipariş Takip Kodunuz:
              </h2>
            </div>
            <p className="w-full text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-wider bg-white dark:bg-gray-800 px-1 py-2 rounded-md shadow break-all">
              {orderId}
            </p>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 space-y-1">
              {" "}
              {/* space-y-1 eklendi */}
              <p>
                Bu kodu kullanarak siparişinizin durumunu, sayfanın üst
                kısmındaki menüde bulunan
                <ShoppingBag className="inline-block w-4 h-4 mx-1 relative -top-px" />
                <span className="font-semibold">
                  &quot;
                  <Link
                    to="/shop/home"
                    className="text-blue-600 hover:underline"
                  >
                    Siparişlerim
                  </Link>
                  &quot;
                </span>
                bağlantısından veya
                {isAuthenticated ? (
                  <>
                    {" "}
                    doğrudan{" "}
                    <Link
                      to="/shop/account"
                      className="text-blue-600 hover:underline"
                    >
                      Hesabım &gt; Siparişlerim
                    </Link>{" "}
                    bölümünden
                  </>
                ) : (
                  " e-posta adresinizle birlikte sorgulayabilirsiniz."
                )}
              </p>
              <p className="mt-1">
                {" "}
                {/* Üstteki p'den biraz ayırmak için mt-1 */}
                Ayrıca, sipariş detaylarınız ve bu takip kodu e-posta adresinize
                de gönderilecektir.
              </p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Siparişiniz en kısa sürede hazırlanıp kargoya verilecektir. Teşekkür
            ederiz!
          </p>
        </>
      )}

      {status === "already_processed" && (
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
          Bu siparişin ({orderId}) ödemesi daha önce başarıyla işlenmiş.
        </p>
      )}

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Link
          to="/shop/home"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md text-base font-medium transition-colors w-full sm:w-auto"
        >
          Alışverişe Devam Et
        </Link>
        {isAuthenticated && orderId && (
          <Link
            to="/shop/account"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 px-6 py-3 rounded-md text-base font-medium transition-colors w-full sm:w-auto"
          >
            Siparişlerimi Görüntüle
          </Link>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
