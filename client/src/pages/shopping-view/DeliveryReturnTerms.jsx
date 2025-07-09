import { Truck, RotateCcw, Clock, Shield, Package, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";

const DeliveryReturnTerms = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white py-12 mb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Teslimat ve İade Şartları
              </h1>
              <p className="text-xl opacity-90 md:w-3/4">
                Kargo, teslimat ve iade süreçlerimiz hakkında 
                detaylı bilgiler burada.
              </p>
            </div>
            <div className="hidden md:block">
              <Truck className="h-24 w-24 text-white opacity-80" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Delivery Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Teslimat Bilgileri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
              <div className="flex items-center mb-3">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Teslimat Süreleri
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Aynı gün kargo: Saat 14:00'a kadar verilen siparişler
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  1-2 iş günü: İstanbul, Ankara, İzmir
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  2-3 iş günü: Diğer iller
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  3-5 iş günü: Uzak bölgeler
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
              <div className="flex items-center mb-3">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Kargo Ücretleri
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  200 TL ve üzeri: ÜCRETSİZ KARGO
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  200 TL altı: 19,90 TL kargo ücreti
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Aynı gün teslimat: +15 TL ek ücret
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Adrese teslim garantili
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Önemli Notlar:
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Teslimat süreleri, kargo şirketinin çalışma takvimi ve hava koşullarına bağlı olarak değişebilir.</li>
              <li>• Resmi tatil günlerinde kargo teslimatı yapılmaz.</li>
              <li>• Büyük hacimli ürünler için özel teslimat koşulları geçerlidir.</li>
              <li>• Teslim alacak kişinin kimlik ibrazı gereklidir.</li>
            </ul>
          </div>
        </div>

        {/* Return Policy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <RotateCcw className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              İade Politikası
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                İade Süresi
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Ürünü teslim aldığınız tarihten itibaren <span className="font-bold text-orange-600">14 gün</span> içinde 
                iade edebilirsiniz. Bu süre, Mesafeli Satış Sözleşmesi kapsamında yasal hakkınızdır.
              </p>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded border border-orange-300 dark:border-orange-700">
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  💡 İade süresi, ürünü teslim aldığınız günden itibaren başlar, tatil günleri dahil edilir.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                  ✅ İade Edilebilir Ürünler
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• Orijinal ambalajında, etiketli ürünler</li>
                  <li>• Kullanılmamış, hasarsız ürünler</li>
                  <li>• Hijyen koşulları bozulmamış ürünler</li>
                  <li>• Aksesuarları eksiksiz ürünler</li>
                  <li>• Fatura ile birlikte gönderilen ürünler</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3">
                  ❌ İade Edilemez Ürünler
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• Kişisel hijyen ürünleri</li>
                  <li>• Kullanılmış kozmetik ürünler</li>
                  <li>• Özel üretim ürünler</li>
                  <li>• Ambalajı açılmış yazılım ürünleri</li>
                  <li>• Ses/görüntü kayıtları, kitaplar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Package className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
            İade Süreci
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                İade Talebi
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Hesabım &gt; Siparişlerim bölümünden iade talebi oluşturun
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Onay
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                İade talebiniz 24 saat içinde değerlendirilir
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Kargo
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Ürünü ücretsiz kargo ile bize gönderin
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                İade
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                5-7 iş günü içinde ödemeniz iade edilir
              </p>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              💳 İade Ödemeleri
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Kredi kartı ödemeleri: 2-5 iş günü içinde kartınıza iade</li>
              <li>• Banka havalesi ödemeleri: 3-7 iş günü içinde hesabınıza iade</li>
              <li>• Kapıda ödeme: Banka hesabınıza havale ile iade</li>
            </ul>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400 mr-2" />
            Değişim Politikası
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-3">
                Değişim Koşulları
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                  Aynı ürün grubunda değişim yapılabilir
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                  Beden/renk değişimi ücretsizdir
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                  Fiyat farkı olan değişimlerde ek ödeme alınır
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-teal-600 mr-2 mt-0.5 flex-shrink-0" />
                  Değişim hakkı sadece 1 kez kullanılabilir
                </li>
              </ul>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-3">
                Değişim Süreci
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
                <li className="flex items-start">
                  <span className="bg-teal-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">1</span>
                  Online değişim talebi oluşturun
                </li>
                <li className="flex items-start">
                  <span className="bg-teal-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">2</span>
                  Ürünü kargo ile gönderin
                </li>
                <li className="flex items-start">
                  <span className="bg-teal-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">3</span>
                  Yeni ürününüz 3-5 iş günü içinde gelir
                </li>
                <li className="flex items-start">
                  <span className="bg-teal-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0">4</span>
                  Fiyat farkı varsa tahsil edilir
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 mr-2" />
            Önemli Bilgiler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                  Hasarlı Ürün Teslimatı
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Ürününüz hasarlı olarak geldiyse, kargo teslim sırasında tutanak tutarak 
                  derhal bizimle iletişime geçin. 48 saat içinde çözüm sağlanır.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                  Yanlış Ürün Teslimatı
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Sipariş ettiğinizden farklı bir ürün geldiyse, ücretsiz değişim 
                  hakkınız vardır. Kargo masrafları tarafımızdan karşılanır.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                  İade/Değişim Reddi
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Kullanılmış, hasarlı veya hijyen koşulları bozulmuş ürünlerin 
                  iadesi kabul edilmez. Bu durumda ürün size iade edilir.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  Müşteri Hizmetleri
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  İade/değişim ile ilgili sorularınız için 7/24 müşteri hizmetlerimizle 
                  iletişime geçebilirsiniz: +90 532 471 28 24
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReturnTerms; 