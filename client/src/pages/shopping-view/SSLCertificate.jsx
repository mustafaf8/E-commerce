import { Shield, Lock, CheckCircle, Globe, Server, Eye } from "lucide-react";

const SSLCertificate = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12 mb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                SSL Sertifikası
              </h1>
              <p className="text-xl opacity-90 md:w-3/4">
                Verileriniz şifrelenmiş bağlantılarla korunuyor. 
                SSL güvenliği hakkında bilgi edinin.
              </p>
            </div>
            <div className="hidden md:block">
              <Shield className="h-24 w-24 text-white opacity-80" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Lock className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              SSL Sertifikası Nedir?
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            <span className="font-semibold">SSL (Secure Sockets Layer)</span> sertifikası, 
            web sitemiz ile tarayıcınız arasındaki veri alışverişini şifreleyen güvenlik 
            protokolüdür. Bu sayede kişisel bilgileriniz, ödeme bilgileriniz ve tüm hassas 
            verileriniz üçüncü şahıslar tarafından görüntülenemez ve değiştirilemez.
          </p>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-green-800 dark:text-green-200">
              <span className="font-semibold">Deposun</span> olarak 256-bit SSL şifreleme 
              kullanarak verilerinizi en üst düzeyde koruyoruz.
            </p>
          </div>
        </div>

        {/* How SSL Works */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Server className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            SSL Nasıl Çalışır?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                1. Bağlantı Kurulumu
              </h3>
              <p className="text-gray-700 dark:text-gray-400 text-sm">
                Tarayıcınız sitemize bağlandığında SSL sertifikamızı kontrol eder
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                2. Şifreleme
              </h3>
              <p className="text-gray-700 dark:text-gray-400 text-sm">
                Verileriniz güçlü algoritmatlar kullanılarak şifrelenir
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                3. Güvenli İletim
              </h3>
              <p className="text-gray-700 dark:text-gray-400 text-sm">
                Şifrelenmiş veriler güvenli kanal üzerinden iletilir
              </p>
            </div>
          </div>
        </div>

        {/* SSL Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            SSL Sertifikasının Faydaları
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Veri Şifreleme
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm">
                    Tüm verileriniz 256-bit şifreleme ile korunur
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Kimlik Doğrulama
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm">
                    Sitemizin gerçekliği doğrulanır, sahte sitelerden korunursunuz
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Veri Bütünlüğü
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm">
                    Verilerinizin transit sırasında değiştirilmediği garantilenir
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    SEO Avantajı
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm">
                    Arama motorları SSL korumalı siteleri tercih eder
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Güven Göstergesi
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm">
                    Adres çubuğundaki kilit işareti güvenliği gösterir
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Uyumluluk
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 text-sm">
                    PCI DSS ve diğer güvenlik standartlarına uyum sağlar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Verify SSL */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Eye className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            SSL Sertifikasını Nasıl Kontrol Edersiniz?
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                1. Adres Çubuğunu Kontrol Edin
              </h3>
              <p className="text-gray-700 dark:text-gray-400 mb-3">
                Web sitesi adresinin başında "https://" olduğunu ve adres çubuğunda 
                kilit işaretinin bulunduğunu kontrol edin.
              </p>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded border border-green-300 dark:border-green-700">
                <code className="text-green-800 dark:text-green-200 text-sm">
                  🔒 https://deposun.com
                </code>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                2. Sertifika Detaylarını İnceleyin
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Kilit işaretine tıklayarak sertifika detaylarını görüntüleyebilir, 
                sertifikanın geçerlilik süresini ve kimlik bilgilerini kontrol edebilirsiniz.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                3. Güvenlik Uyarılarına Dikkat Edin
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Tarayıcınız güvenlik uyarısı veriyorsa, siteyi ziyaret etmeden önce 
                mutlaka bu uyarıları dikkate alın.
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Sertifika Bilgileri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                Sertifika Türü
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Extended Validation (EV) SSL Sertifikası
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                Şifreleme Seviyesi
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                256-bit AES Şifreleme
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                Sertifika Otoritesi
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Let's Encrypt / DigiCert
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                Güncelleme Sıklığı
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Otomatik olarak her 90 günde bir yenilenir
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSLCertificate; 