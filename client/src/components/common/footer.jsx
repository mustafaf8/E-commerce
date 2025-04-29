import { Link } from "react-router-dom"; // İç linkler için
import {
  Instagram,
  Facebook,
  MessageSquare, // WhatsApp/Destek ikonu
  ArrowUpCircle, // Başa dön ikonu
} from "lucide-react";

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
    { store: "Google Play", url: "/placeholder-googleplay.png", link: "#" },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 pt-10 pb-4 max-[1024px]:pb-16">
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
                  to="/shop/ortaklarimiz"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  İş Ortaklarımız
                </Link>
              </li>

              <li>
                <Link
                  to="/shop/kvkk"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Kişisel Verilerin Korunması
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/bilgi-guvenligi"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Bilgi Güvenliği Politikası
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
                  to="/shop/account"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Siparişlerim
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/account"
                  className="hover:text-primary dark:hover:text-secondary"
                >
                  Hesabım
                </Link>
              </li>

              {/* ... diğer linkler */}
              <li>
                <Link
                  to="/shop/islem-rehberi"
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
                  href="https://www.instagram.com/rmrenerjisistemleri/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary dark:hover:text-secondary"
                >
                  <Instagram size={16} className="mr-2" /> Instagram
                </a>
              </li>

              {/* TikTok ikonu için SVG */}
              <li>
                <a
                  href="https://www.facebook.com/rmr.enerji/?locale=tr_TR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary dark:hover:text-secondary"
                >
                  <Facebook size={16} className="mr-2" /> Facebook
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
              <p className="font-medium">Çağrı Merkezimizi arayın</p>
              <a
                href="tel:08502524000"
                className="block text-lg font-bold text-gray-900 dark:text-white hover:text-primary dark:hover:text-secondary"
              >
                0000 000 00 00
              </a>
              <a
                href="https://wa.me/+905347168754"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-start text-green-600 hover:text-green-700 font-medium"
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
