import { useState } from "react";

const Partners = () => {
  const partnerCategories = [
    {
      id: "premium",
      name: "Premium İş Ortaklarımız",
      partners: [
        { id: 1, name: "Tech Solutions", industry: "Teknoloji" },
        { id: 2, name: "Global Logistics", industry: "Lojistik" },
        { id: 3, name: "Finance Group", industry: "Finans" },
        { id: 4, name: "Smart Retail", industry: "Perakende" },
      ],
    },
    {
      id: "technology",
      name: "Teknoloji Ortaklarımız",
      partners: [
        { id: 5, name: "Cloud Services", industry: "Bulut" },
        { id: 6, name: "DataTech", industry: "Veri" },
        { id: 7, name: "AI Solutions", industry: "Yapay Zeka" },
        { id: 8, name: "DigiMarketing", industry: "Dijital Pazarlama" },
      ],
    },
    {
      id: "logistics",
      name: "Tedarik ve Lojistik Ortaklarımız",
      partners: [
        { id: 9, name: "Fast Delivery", industry: "Kargo" },
        { id: 10, name: "Supply Chain Co.", industry: "Tedarik Zinciri" },
        { id: 11, name: "Global Transport", industry: "Nakliye" },
        { id: 12, name: "Stock Masters", industry: "Depolama" },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState("premium");

  return (
    <div>
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 mb-0">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            İş Ortaklarımız
          </h1>
          <p className="text-xl md:w-3/4 opacity-90">
            Kaliteli hizmet anlayışımızı sürdürmek için alanında uzman iş
            ortaklarımızla çalışıyoruz.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {partnerCategories.map((category) => (
            <button
              key={category.id}
              className={`px-6 py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        {partnerCategories.map((category) => (
          <div
            key={category.id}
            className={`transition-all duration-500 ${
              activeCategory === category.id
                ? "opacity-100"
                : "hidden opacity-0"
            }`}
          >
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-200">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {category.partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center justify-center group"
                >
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center mb-4 p-4 group-hover:scale-110 transition-transform duration-300">
                    {/* Gerçek uygulamada buraya img eklenecek */}
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {partner.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {partner.industry}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;
