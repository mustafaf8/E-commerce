import { ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";

const KVKK = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-12 mb-6 text-center">
        <div className="container mx-auto px-4">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Kişisel Verilerin Korunması
              </h1>
              <p className="text-xl opacity-90 ">
                Verileriniz bizimle güvende. KVKK uyumlu veri işleme
                politikalarımız hakkında bilgi edinin.
              </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <ShieldCheck className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Kişisel Verilerin Korunması Hakkında
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            <span className="font-semibold">Göktürkler Enerji</span> olarak,
            müşterilerimizin ve kullanıcılarımızın kişisel verilerinin
            gizliliğine ve güvenliğine büyük önem veriyoruz. Kişisel
            verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu
            (&quot;KVKK&quot;) ve ilgili diğer mevzuat hükümlerine uygun olarak
            işlenmekte ve korunmaktadır.
          </p>
          <div className="flex items-center justify-center mt-6 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <AlertCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-center text-gray-700 dark:text-gray-300">
            Bu sayfada, kişisel verilerinizin nasıl toplandığı, işlendiği,
            saklandığı ve korunduğu hakkında detaylı bilgilere ulaşabilirsiniz.
          </p>
        </div>

        {/* Processing Purposes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
            Kişisel Verilerin İşlenme Amaçları
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Kişisel verileriniz, KVKK&apos;nın 5. ve 6. maddelerinde belirtilen
            kişisel veri işleme şartları ve amaçları dahilinde aşağıdaki
            amaçlarla işlenmektedir:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                Ürün ve Hizmet Sunumu
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Sizlere ürün ve hizmetlerimizi sunabilmek, sipariş süreçlerinizi
                yönetmek
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                Müşteri İlişkileri
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Müşteri ilişkilerini yönetmek, şikayetleri çözümlemek, sorunları
                gidermek
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                Yasal Yükümlülükler
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Yasal düzenlemelerden doğan yükümlülüklerimizi yerine getirmek
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                İletişim Faaliyetleri
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Sizlerle iletişim kurabilmek, bilgilendirmelerde bulunabilmek
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                Güvenlik
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                İşlem güvenliğini sağlamak ve dolandırıcılık girişimlerini
                önlemek
              </p>
            </div>
          </div>
        </div>

        {/* Data Transfer */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg
              className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Kişisel Verilerin Aktarılması
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Kişisel verileriniz, işleme amaçlarımız doğrultusunda gerekli
            güvenlik önlemleri alınarak aşağıdaki alıcı gruplarına
            aktarılabilmektedir:
          </p>

          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                Yasal Yükümlülüklerimiz İçin
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Kanuni yükümlülüklerimizi yerine getirmek amacıyla, ilgili kamu
                kurum ve kuruluşlarına (vergi daireleri, mahkemeler vb.) kişisel
                verileriniz aktarılabilmektedir.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                İş Ortaklarımız ve Tedarikçilerimize
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Ürün ve hizmetlerimizin sağlanabilmesi amacıyla iş
                ortaklarımıza, tedarikçilerimize veya alt yüklenicilerimize
                (kargo şirketleri, ödeme sistemleri, yazılım firmaları vb.)
                kişisel verileriniz aktarılabilmektedir.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                Yurt Dışı Aktarım
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Bazı hizmetlerimizin sunulabilmesi için kişisel verileriniz,
                KVKK&apos;nın 9. maddesi kapsamında gerekli güvenlik önlemleri
                alınarak yurt dışındaki sunucularda barındırılabilmektedir. Bu
                aktarım, açık rızanız dahilinde veya KVKK&apos;da öngörülen
                diğer şartların varlığı halinde gerçekleştirilmektedir.
              </p>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
            Kişisel Veri Güvenliği
          </h2>

          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Göktürkler Enerji olarak kişisel verilerinizin güvenliğini sağlamak için
            aşağıdaki teknik ve idari tedbirleri almaktayız:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">
                Teknik Tedbirler
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Ağ güvenliği ve uygulama güvenliği sağlanmaktadır.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Kişisel veri içeren sistemlere kullanıcı adı ve şifre ile
                    erişim sağlanmaktadır.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Kişisel verileriniz düzenli olarak yedeklenmekte ve güvenli
                    ortamlarda saklanmaktadır.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    SSL sertifikası kullanılarak iletişim şifrelenmektedir.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">
                İdari Tedbirler
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Çalışanlarımıza düzenli olarak kişisel veri güvenliği
                    eğitimleri verilmektedir.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Gizlilik taahhütnameleri yapılmaktadır.</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    Görev değişikliği olan ya da işten ayrılan çalışanların bu
                    alandaki yetkileri kaldırılmaktadır.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Düzenli olarak denetimler yapılmaktadır.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default KVKK;
