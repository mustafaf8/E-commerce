// client/src/pages/shopping-view/about-us.jsx
import React from "react";

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {" "}
      {/* Sayfa içeriği için konteyner */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-300 dark:border-gray-700">
        Hakkımızda
      </h1>
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
        <p>
          [MARKA ADINIZ], sektördeki deneyimi ve yenilikçi yaklaşımıyla
          müşterilerine kaliteli ürünler sunmayı hedefleyen bir e-ticaret
          platformudur. Kurulduğumuz günden bu yana, müşteri memnuniyetini her
          zaman ön planda tuttuk ve geniş ürün yelpazemizle ihtiyaçlarınıza
          cevap vermeye çalıştık.
        </p>
        <p>
          Misyonumuz, en son trendleri takip ederek ve güvenilir markalarla
          işbirliği yaparak kullanıcılarımıza eşsiz bir alışveriş deneyimi
          yaşatmaktır. Teknolojik altyapımız ve güçlü lojistik ağımız sayesinde
          siparişlerinizi hızlı ve güvenli bir şekilde size ulaştırıyoruz.
        </p>
        {/* Eğer alt başlıklar varsa h2 veya h3 kullanabilirsiniz: */}
        <h2 className="text-2xl font-semibold mt-6 mb-3">Vizyonumuz</h2>
        <p>
          E-ticaret sektöründe öncü ve yenilikçi bir marka olarak,
          sürdürülebilir büyüme sağlamak ve müşterilerimizin hayatını
          kolaylaştıran çözümler sunmaktır.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-3">Değerlerimiz</h2>
        <ul>
          <li>Müşteri Odaklılık</li>
          <li>Güvenilirlik</li>
          <li>Yenilikçilik</li>
          <li>Kalite</li>
          <li>Takım Çalışması</li>
        </ul>
        {/* --- İÇERİK EKLEME ALANI SONU --- */}
      </div>
    </div>
  );
};

export default AboutUs;
