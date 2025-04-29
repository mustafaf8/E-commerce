const AboutUs = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 mb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hikayemizi Keşfedin
          </h1>
          <p className="text-xl md:w-3/4 opacity-90">
            Tutkuyla başlayan bir yolculuk, güvenle devam eden bir başarı
            hikayesi
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-8 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Vizyonumuz
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              E-ticaret sektöründe öncü ve yenilikçi bir marka olarak,
              sürdürülebilir büyüme sağlamak ve müşterilerimizin hayatını
              kolaylaştıran çözümler sunmaktır. Dijital dünyanın sınırlarını
              zorlayarak alışveriş deneyimini sürekli iyileştirmeyi ve
              teknolojik yenilikleri müşterilerimizin hizmetine sunmayı
              hedefliyoruz.
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-8 rounded-lg border-l-4 border-indigo-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Misyonumuz
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Kaliteli ürün ve hizmetlerimizle müşterilerimizin beklentilerini
              aşan bir alışveriş deneyimi sunmak, sektörde güvenilirlik
              standardını belirlemek ve sürdürülebilir iş modelleri geliştirerek
              paydaşlarımızla birlikte büyümektir. Müşterilerimiz,
              çalışanlarımız ve iş ortaklarımız için değer yaratmaya
              odaklanıyoruz.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Müşteri Odaklılık
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tüm kararlarımızda müşterilerimizin ihtiyaç ve beklentilerini
                merkeze alıyoruz.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Güvenilirlik
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Her adımda dürüstlük ve şeffaflık ilkesiyle hareket ediyoruz.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Yenilikçilik
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sürekli gelişim için yeni fikirler ve teknolojileri
                benimsiyoruz.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Kalite
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Ürün ve hizmetlerimizde en yüksek standartları sağlamayı taahhüt
                ediyoruz.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Takım Çalışması
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Başarının anahtarının ekip ruhu ve işbirliğinde olduğuna
                inanıyoruz.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 md:p-12 text-white shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Hikayemizin Bir Parçası Olun
            </h2>
            <p className="mb-8 text-indigo-100">
              Müşterilerimiz, iş ortaklarımız ve çalışanlarımızla birlikte
              başarı hikayemizi yazıyoruz. Siz de bu yolculuğun bir parçası
              olmak ister misiniz?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors">
                Bizimle İletişime Geçin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
