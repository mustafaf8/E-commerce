// client/src/components/common/footer.jsx
import React from "react";
import { Link } from "react-router-dom"; // İç linkler için
import {
  Instagram,
  Youtube,
  Twitter, // X ikonu yerine Twitter kullanabiliriz
  Facebook,
  Linkedin,
  Smartphone, // Mobil uygulama ikonu
  PhoneCall, // Telefon ikonu
  MessageSquare, // WhatsApp/Destek ikonu
  ArrowUpCircle, // Başa dön ikonu
} from "lucide-react";

// Ödeme yöntemi logoları için örnek import (gerçek yolları ayarlamanız gerekir)
// import visaLogo from '@/assets/payment/visa.png';
// import mastercardLogo from '@/assets/payment/mastercard.png';
// ... diğer logolar

// Uygulama mağazası logoları (bunlar da muhtemelen resim olacak)
// import appStoreBadge from '@/assets/badges/appstore.png';
// import googlePlayBadge from '@/assets/badges/googleplay.png';
// import appGalleryBadge from '@/assets/badges/appgallery.png';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Yumuşak kaydırma efekti
    });
  };

  // Örnek Ödeme Logoları (Gerçek resim URL'leri veya importlar ile değiştirin)
  const paymentLogos = [
    { name: "Bonus", url: "/placeholder-logo.png" },
    { name: "Maximum", url: "/placeholder-logo.png" },
    { name: "World", url: "/placeholder-logo.png" },
    { name: "Bankkart", url: "/placeholder-logo.png" },
    { name: "CardFinans", url: "/placeholder-logo.png" },
    { name: "Axess", url: "/placeholder-logo.png" },
    { name: "Paraf", url: "/placeholder-logo.png" },
    { name: "Visa", url: "/placeholder-logo.png" },
    { name: "Mastercard", url: "/placeholder-logo.png" },
    { name: "Troy", url: "/placeholder-logo.png" },
  ];

  // Örnek Uygulama Mağazası Rozetleri
  const appBadges = [
    { store: "App Store", url: "/placeholder-appstore.png", link: "#" },
    { store: "Google Play", url: "/placeholder-googleplay.png", link: "#" },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 pt-10 pb-4">
      <div className="container mx-auto px-4">
        {/* Üst Kısım: Linkler, Sosyal Medya, Uygulamalar, Müşteri Hizmetleri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          {/* Kurumsal */}
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-white mb-3">
              Şirketimiz
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/shop/hakkimizda"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  to="/ortaklarimiz"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  İş Ortaklarımız
                </Link>
              </li>
              <li>
                <Link
                  to="/yatirimci-iliskileri"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Yatırımcı İlişkileri
                </Link>
              </li>
              <li>
                <Link
                  to="/musteri-hizmetleri"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Müşteri Hizmetleri
                </Link>
              </li>
              <li>
                <Link
                  to="/kariyer"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Kariyer
                </Link>
              </li>
              <li>
                <Link
                  to="/kvkk"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Kişisel Verilerin Korunması
                </Link>
              </li>
              <li>
                <Link
                  to="/bilgi-guvenligi"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Bilgi Güvenliği Politikası
                </Link>
              </li>
              {/* ... diğer linkler */}
              <li>
                <Link
                  to="/iletisim"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Deposun (Örnek, kendi linklerinizle değiştirin) */}
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-white mb-3">
              Deposun
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/siparislerim"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Siparişlerim
                </Link>
              </li>
              <li>
                <Link
                  to="/hesabim"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Hesabım
                </Link>
              </li>
              <li>
                <Link
                  to="/yardim"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Yardım
                </Link>
              </li>
              {/* ... diğer linkler */}
              <li>
                <Link
                  to="/islem-rehberi"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  İşlem Rehberi
                </Link>
              </li>
            </ul>
          </div>

          {/* Bizi Takip Edin */}
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-white mb-3">
              Bizi Takip Edin
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary dark:hover:text-secondary"
                >
                  <Instagram size={16} className="mr-2" /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary dark:hover:text-secondary"
                >
                  <Youtube size={16} className="mr-2" /> Youtube
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary dark:hover:text-secondary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>{" "}
                  TikTok
                </a>
              </li>{" "}
              {/* TikTok ikonu için SVG */}
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary dark:hover:text-secondary"
                >
                  <Facebook size={16} className="mr-2" /> Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary dark:hover:text-secondary"
                >
                  <Twitter size={16} className="mr-2" /> X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary dark:hover:text-secondary"
                >
                  <Linkedin size={16} className="mr-2" /> LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Mobil Uygulamalar */}
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-white mb-3">
              Mobil Uygulamalar
            </h5>
            <div className="space-y-3">
              {appBadges.map((badge) => (
                <a
                  key={badge.store}
                  href={badge.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* Gerçek resimleri kullanın */}
                  <img
                    src={badge.url}
                    alt={`${badge.store}'dan İndirin`}
                    className="h-10 w-auto hover:opacity-80 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Aklınıza takılan bir soru mu var? */}
          <div className="text-sm">
            <h5 className="font-semibold text-gray-800 dark:text-white mb-3">
              Aklınıza takılan bir soru mu var?
            </h5>
            <div className="space-y-3">
              <button className="w-full bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded text-left text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Çözüm Merkezine bağlanın
              </button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                veya
              </p>
              <p className="font-medium">Çağrı Merkezimizi arayın</p>
              <a
                href="tel:08502524000"
                className="block text-lg font-bold text-gray-900 dark:text-white hover:text-primary dark:hover:text-secondary"
              >
                0000 000 00 00
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-green-600 hover:text-green-700 font-medium"
              >
                <MessageSquare size={16} className="mr-1" /> WhatsApp Destek
              </a>
            </div>
          </div>
        </div>

        {/* Orta Kısım: Ödeme Logoları */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
          {paymentLogos.map((logo) => (
            // Gerçek logoları ve boyutları ayarlayın
            <img
              key={logo.name}
              src={logo.url}
              alt={logo.name}
              className="h-6 md:h-7 opacity-60"
            />
          ))}
          {/* QR Kod veya diğer görseller eklenebilir */}
          {/* <img src="/placeholder-qr.png" alt="QR Code" className="h-8 w-8 opacity-60" /> */}
        </div>
      </div>

      {/* Alt Kısım: Copyright ve Başa Dön */}
      <div className="bg-black text-gray-400 py-3 text-xs">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <span>
            © Copyright 2013 - {new Date().getFullYear()} Deposun Tic. AŞ. Her
            Hakkı Saklıdır.
            <a href="#" className="ml-2 hover:text-white">
              Site Haritası
            </a>
            {/* Linki güncelleyin */}
          </span>
          <button
            onClick={scrollToTop}
            className="flex items-center mt-2 sm:mt-0 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowUpCircle size={16} className="mr-1" /> Başa Dön
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
