import {
  ShieldCheck,
  Lock,
  Eye,
  FileCheck,
  Users,
  RefreshCw,
} from "lucide-react";

const InfoSecurityPolicy = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 mb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bilgi Güvenliği Politikası
          </h1>
          <p className="text-xl md:w-3/4 opacity-90">
            Müşterilerimizin güvenliği ve veri gizliliği her zaman
            önceliğimizdir
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Güvenlik Taahhüdümüz
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            <span className="font-semibold">ShopName</span>, faaliyetlerini
            yürütürken sahip olduğu tüm bilgi varlıklarının gizliliğini,
            bütünlüğünü ve erişilebilirliğini korumayı taahhüt eder. Bilgi
            güvenliği, iş sürekliliğimizin ve itibarımızın temelini oluşturur.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            En güncel güvenlik önlemleri ve endüstri standartlarını takip ederek
            verilerinizi korumak için sürekli çalışıyoruz.
          </p>
        </div>

        {/* Policy Purpose */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Politikanın Amacı
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
            Bu politikanın amacı, şirketimizin bilgi varlıklarını içeriden veya
            dışarıdan gelebilecek kasıtlı veya kasıtsız tehditlere karşı
            korumak, yasal gerekliliklere uyum sağlamak ve bilgi güvenliği
            yönetim sistemini sürekli iyileştirmektir.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
            <p className="text-blue-800 dark:text-blue-200">
              Bilgi güvenliği politikamız ISO 27001 standartlarına uygun olarak
              tasarlanmış ve düzenli olarak bağımsız denetimlerden geçmektedir.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Temel İlkelerimiz
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Gizlilik
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Bilgiye yalnızca yetkili kişilerin erişiminin sağlanması ve
                hassas verilerin korunması.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bütünlük
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Bilginin doğruluğunun ve eksiksizliğinin korunması, yetkisiz
                değişikliklere karşı önlem alınması.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Erişilebilirlik
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Yetkili kullanıcıların ihtiyaç duydukları anda bilgiye
                erişebilmesinin sağlanması.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <FileCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Yasal Uyum
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Bilgi güvenliği ile ilgili tüm yasalara ve düzenlemelere tam
                uyumun gözetilmesi.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Farkındalık
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Tüm çalışanların bilgi güvenliği sorumlulukları konusunda
                düzenli olarak bilinçlendirilmesi.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Sürekli İyileştirme
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Bilgi güvenliği süreçlerinin düzenli olarak gözden geçirilmesi
                ve iyileştirilmesi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-md mb-2">
                <ShieldCheck className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SSL Korumalı
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-md mb-2">
                <Lock className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Güvenli Ödeme
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-md mb-2">
                <FileCheck className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                KVKK Uyumlu
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-md mb-2">
                <RefreshCw className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ISO 27001
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSecurityPolicy;
