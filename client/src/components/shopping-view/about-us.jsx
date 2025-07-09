import { 
  Store, 
  Users, 
  Heart, 
  Shield, 
  Truck, 
  Award, 
  Clock, 
  Star,
  CheckCircle,
  Target,
  Lightbulb,
  Globe
} from "lucide-react";

const AboutUs = () => {
  const stats = [
    { icon: Users, number: "10K+", label: "Mutlu Müşteri" },
    { icon: Store, number: "50+", label: "Ürün Çeşidi" },
    { icon: Award, number: "7", label: "Yıllık Deneyim" },
    { icon: Truck, number: "24/7", label: "Hızlı Teslimat" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Güvenli Alışveriş",
      description: "256-bit SSL şifreleme ile korumalı ödeme sistemi"
    },
    {
      icon: Truck,
      title: "Hızlı Teslimat",
      description: "Aynı gün ve ertesi gün teslimat seçenekleri"
    },
    {
      icon: Heart,
      title: "Müşteri Memnuniyeti",
      description: "7/24 müşteri desteği ve kolay iade süreci"
    },
    {
      icon: Award,
      title: "Kalite Garantisi",
      description: "Orijinal ve kaliteli ürünler, resmi garanti"
    }
  ];

  const timeline = [
    {
      year: "2018",
      title: "Kuruluş",
      description: "E-ticaret yolculuğumuza başladık"
    },
    {
      year: "2019",
      title: "Büyüme",
      description: "Ürün çeşitliliğimizi genişlettik"
    },
    {
      year: "2021",
      title: "Yenilik",
      description: "Mobil uygulamamızı geliştirdik"
    },
    {
      year: "2024",
      title: "Liderlik",
      description: "Sektörde öncü marka olduk"
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Deposun
              </span>
              <br />
              Hikayemiz
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
              Müşteri memnuniyetini ön planda tutarak, kaliteli ürünleri 
              en uygun fiyatlarla buluşturan güvenilir e-ticaret platformu
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                🚀 7+ Yıllık Deneyim
              </span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                ⭐ 10K+ Mutlu Müşteri
              </span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                🛡️ Güvenli Alışveriş
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Müşteri Memnuniyeti Odaklı 
              <span className="text-blue-600"> E-Ticaret</span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              2018 yılından bu yana, müşterilerimize en kaliteli ürünleri en uygun fiyatlarla 
              sunma misyonuyla yola çıktık. Bugün binlerce müşterimizin güvenini kazanmış, 
              sektörde öncü bir marka haline gelmişiz.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Geniş ürün yelpazemiz, hızlı teslimat seçeneklerimiz ve 7/24 müşteri 
              desteğimizle sizlere en iyi alışveriş deneyimini sunuyoruz.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Orijinal Ürünler</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Hızlı Kargo</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Güvenli Ödeme</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Neden Deposun?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="h-5 w-5 mr-3 text-yellow-300" />
                  <span>Müşteri memnuniyeti önceliği</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 mr-3 text-yellow-300" />
                  <span>Uygun fiyat garantisi</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 mr-3 text-yellow-300" />
                  <span>Geniş ürün yelpazesi</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 mr-3 text-yellow-300" />
                  <span>Kolay iade süreci</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Neden Bizi Seçmelisiniz?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Size en iyi hizmeti sunmak için sürekli gelişiyoruz
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Yolculuğumuz
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Bugünlere gelene kadar kat ettiğimiz yol
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600 hidden md:block"></div>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                      <div className="text-blue-600 font-bold text-xl mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:block w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full relative z-10 mx-auto"></div>
                  <div className="w-full md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Misyonumuz</h3>
            </div>
            <p className="text-blue-100 leading-relaxed">
              Müşterilerimizin ihtiyaçlarını en iyi şekilde karşılayarak, kaliteli ürünleri 
              uygun fiyatlarla sunmak ve güvenilir alışveriş deneyimi yaşatmak. 
              Teknoloji ve yenilikçilikle desteklediğimiz hizmetlerimizle müşteri 
              memnuniyetini en üst seviyede tutmak.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <Lightbulb className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Vizyonumuz</h3>
            </div>
            <p className="text-purple-100 leading-relaxed">
              E-ticaret sektöründe müşteri odaklı yaklaşımımızla öncü marka olmak, 
              sürdürülebilir büyüme ile sektöre yön vermek. Yenilikçi çözümlerimiz 
              ve kaliteli hizmetimizle Türkiye'nin en güvenilir online alışveriş 
              platformu olmak.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Değerlerimiz
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            İş yapış şeklimizi şekillendiren temel ilkelerimiz
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Müşteri Odaklılık
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Her kararımızda müşterilerimizin memnuniyetini ön planda tutuyoruz.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Güvenilirlik
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Şeffaf ve dürüst iş anlayışımızla müşterilerimizin güvenini kazanıyoruz.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Yenilikçilik
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Teknolojik gelişmeleri takip ederek sürekli kendimizi yeniliyoruz.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Kalite
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              En yüksek kalite standartlarında ürün ve hizmet sunuyoruz.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Ekip Ruhu
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Güçlü ekip çalışmasıyla başarıya ulaştığımıza inanıyoruz.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Sürdürülebilirlik
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Çevre ve toplum sorumluluğu bilincinde hareket ediyoruz.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bizimle Alışverişe Başlayın
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Binlerce ürün arasından dilediğinizi seçin, güvenle alışveriş yapın
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white">
              🚚 Ücretsiz Kargo (200₺ üzeri)
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white">
              🔄 14 Gün İade Garantisi
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white">
              🔒 Güvenli Ödeme
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
