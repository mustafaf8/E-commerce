import { UserCheck, Eye, Shield, Lock, FileText, Users, Clock, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 mb-6 text-center">
        <div className="container mx-auto px-4">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Gizlilik Sözleşmesi
              </h1>
              <p className="text-xl opacity-90 ">
                Kişisel verilerinizin korunması ve gizliliği konusundaki 
                taahhütlerimiz ve haklarınız.
              </p>
            </div>

        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gizlilik Politikamız
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            <span className="font-semibold">Deposun</span> olarak, kişisel verilerinizin 
            gizliliğini korumak bizim için en önemli önceliktir. Bu gizlilik sözleşmesi, 
            kişisel verilerinizi nasıl topladığımız, kullandığımız, sakladığımız ve 
            koruduğumuz hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
          </p>
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border-l-4 border-indigo-500">
            <p className="text-indigo-800 dark:text-indigo-200">
              Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve 
              ilgili mevzuat uyarınca hazırlanmıştır.
            </p>
          </div>
        </div>

        {/* Data Collection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            Hangi Verileri Topluyoruz?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
                Kimlik ve İletişim Bilgileri
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                <li>• Ad, soyad, TC Kimlik No</li>
                <li>• E-posta adresi</li>
                <li>• Telefon numarası</li>
                <li>• Doğum tarihi</li>
               
              </ul>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
                Adres ve Teslimat Bilgileri
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                <li>• Ev/iş adresi bilgileri</li>
                <li>• Fatura adresi</li>
                <li>• Teslimat adresi</li>
                <li>• Şehir, ilçe, posta kodu</li>
              </ul>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
                Finansal Bilgiler
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                
                <li>• Sipariş ve ödeme geçmişi</li>
                <li>• Fatura bilgileri</li>
              </ul>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
                Kullanım Bilgileri
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                <li>• Site kullanım alışkanlıkları</li>
                <li>• IP adresi ve konum bilgileri</li>
                <li>• Cihaz ve tarayıcı bilgileri</li>
                <li>• Çerez (cookie) verileri</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Usage */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
            Verilerinizi Neden Kullanıyoruz?
          </h2>

          <div className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                🛒 Sipariş ve Hizmet Sunumu
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Siparişlerinizi almak, işlemek, teslimat yapmak ve müşteri hizmetleri sunmak için.
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                📧 İletişim ve Bilgilendirme
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Size sipariş durumu, kampanyalar ve önemli güncellemeler hakkında bilgi vermek için.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                📊 Analiz ve İyileştirme
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Hizmet kalitemizi artırmak, site performansını iyileştirmek ve kişiselleştirilmiş deneyim sunmak için.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                ⚖️ Yasal Yükümlülükler
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Vergi, muhasebe ve diğer yasal yükümlülüklerimizi yerine getirmek için.
              </p>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Users className="h-6 w-6 text-teal-600 dark:text-teal-400 mr-2" />
            Verilerinizi Kimlerle Paylaşıyoruz?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-3">
                🚚 Kargo ve Lojistik Firmaları
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                Siparişlerinizin teslimatı için gerekli bilgiler:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-500 space-y-1">
                <li>• Ad, soyad, telefon</li>
                <li>• Teslimat adresi</li>
                <li>• Ürün bilgileri</li>
              </ul>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-3">
                🏛️ Kamu Kurumları
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                Yasal yükümlülükler çerçevesinde:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-500 space-y-1">
                <li>• Vergi daireleri</li>
                <li>• Adli makamlar</li>
                <li>• Düzenleyici kurumlar</li>
              </ul>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-3">
                🔧 Teknik Hizmet Sağlayıcıları
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">
                Platform işleyişi için:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-500 space-y-1">
                <li>• Bulut depolama hizmetleri</li>
                <li>• Analitik platformları</li>
                <li>• E-posta servisleri</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Lock className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            Verilerinizi Nasıl Koruyoruz?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  🔐 Teknik Güvenlik Önlemleri
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• 256-bit SSL şifreleme</li>
                  <li>• Güvenlik duvarları</li>
                  <li>• Düzenli güvenlik taramaları</li>
                  <li>• Veri yedekleme sistemleri</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  👥 Erişim Kontrolü
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• Yetki tabanlı erişim</li>
                  <li>• Çok faktörlü kimlik doğrulama</li>
                  <li>• Personel güvenlik eğitimleri</li>
                  <li>• Düzenli erişim denetimleri</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  📋 İdari Önlemler
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• Gizlilik sözleşmeleri</li>
                  <li>• Veri işleme prosedürleri</li>
                  <li>• Olay müdahale planları</li>
                  <li>• Düzenli güvenlik denetimleri</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  🏢 Fiziksel Güvenlik
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• Güvenli veri merkezleri</li>
                  <li>• Kamera gözetim sistemleri</li>
                  <li>• Kartlı geçiş sistemleri</li>
                  <li>• 7/24 güvenlik görevlisi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-2" />
            Verilerinizi Ne Kadar Süre Saklıyoruz?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                Hesap Bilgileri
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Hesabınızı silene kadar veya 3 yıl hareketsizlik sonrası otomatik silinir.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                Sipariş Kayıtları
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Yasal yükümlülükler gereği 10 yıl süreyle muhafaza edilir.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                İletişim Kayıtları
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Müşteri hizmetleri kayıtları 2 yıl süreyle saklanır.
              </p>
            </div>
          </div>
        </div>

        {/* User Rights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            Kişisel Veri Haklarınız
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">📋</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Bilgi Alma Hakkı</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Hangi verilerinizin işlendiğini öğrenme hakkınız vardır.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">✏️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Düzeltme Hakkı</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Yanlış veya eksik bilgilerin düzeltilmesini talep edebilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">🗑️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Silme Hakkı</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Verilerinizin silinmesini talep edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">🚫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">İtiraz Hakkı</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Veri işlenmesine itiraz edebilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">📤</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Taşınabilirlik Hakkı</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Verilerinizi başka bir sisteme aktarma hakkınız vardır.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">⚖️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Şikayet Hakkı</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Veri Koruma Kurulu'na şikayet edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Haklarınızı kullanmak için:</strong> destek@deposun.com adresine 
              başvurabilir veya müşteri hizmetlerimizi arayabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 