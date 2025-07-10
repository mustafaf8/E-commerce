import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  MessageSquare,
  ArrowUpCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const paymentLogos = [
    { name: "Bonus", url: "/logo_band_colored@2x.png" },
  ];

  const appBadges = [
    {
      store: "Google Play",
      url: "/Google_Play.svg",
      link: "https://play.google.com/store/apps/details?id=com.aliosmangok.rmrenerji&pli=1",
    },
  ];

  const footerLinks = [
    {
      title: "Şirketimiz",
      links: [
        { label: "İletişim", href: "/shop/iletisim" },
        { label: "Hakkımızda", href: "/shop/hakkimizda" },
        { label: "Bilgi Güvenliği Politikası", href: "/shop/bilgi-guvenligi" },
        { label: "Kişisel Verilerin Korunması", href: "/shop/kvkk" },
      ],
    },
    {
      title: "Yasal Bilgiler",
      links: [
        { label: "SSL Sertifikası", href: "/shop/ssl-sertifikasi" },
        { label: "Gizlilik Sözleşmesi", href: "/shop/gizlilik-sozlesmesi" },
        { label: "Teslimat ve İade Şartları", href: "/shop/teslimat-iade" },
        { label: "Mesafeli Satış Sözleşmesi", href: "/shop/mesafeli-satis" },
      ],
    },
    {
      title: "Hesabım",
      links: [
        { label: "Siparişlerim", href: "/shop/account" },
        { label: "Hesap Bilgilerim", href: "/shop/account" },
        { label: "İşlem Rehberi", href: "/shop/islem-rehberi" },
      ],
    },

    {
      title: "Bizi Takip Edin",
      links: [
        {
          label: "Instagram",
          href: "https://www.instagram.com/rmrenerjisistemleri/",
          icon: <Instagram size={16} />,
          external: true,
        },
        {
          label: "Facebook",
          href: "https://www.facebook.com/rmr.enerji/",
          icon: <Facebook size={16} />,
          external: true,
        },
      ],
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 pt-2 pb-20 md:pb-4 lg:pb-4 border-t border-gray-100 mt-6">
      <div className="mt-4 container mx-auto px-4 lg:px-20">
        {/* Main footer content */}
        <div className="mb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-[640px]:ml-16 min-[699px]:ml-16 min-[1024px]:ml-32">
          {/* First row - 3 columns */}
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 relative pl-3 before:absolute before:left-0 before:top-1 before:h-5 before:w-1 before:bg-primary before:rounded-full">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary flex items-center gap-2"
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary flex items-center"
                      >
                        <ChevronRight size={14} className="mr-1" />
                        <span>{link.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Second row - 3 columns */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 relative pl-3 before:absolute before:left-0 before:top-1 before:h-5 before:w-1 before:bg-primary before:rounded-full">
              Mobil Uygulama
            </h3>

            <div className="mb-4">
              {appBadges.map((badge) => (
                <a
                  key={badge.store}
                  href={badge.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img
                    src={badge.url}
                    alt={`${badge.store}'dan İndirin`}
                    className="h-6 w-auto hover:opacity-80 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 relative pl-3 before:absolute before:left-0 before:top-1 before:h-5 before:w-1 before:bg-primary before:rounded-full">
              Yardım Merkezi
            </h3>

            <a
              href="https://wa.me/+905324712824"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 rounded-full bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
            >
              <MessageSquare size={16} className="mr-2" />
              WhatsApp Destek
            </a>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 relative pl-3 before:absolute before:left-0 before:top-1 before:h-5 before:w-1 before:bg-primary before:rounded-full">
              Hakkımızda
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              sizlere hizmet vermekten gurur duyuyoruz.
            </p>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-0 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            {paymentLogos.map((logo) => (
              <img
                key={logo.name}
                src={logo.url}
                alt={logo.name}
                className="h-10 opacity-90 max-[690px]:h-7"
              />
            ))}
          </div>

          <div className="flex justify-center items-center">
            <div className="text-center text-xs text-gray-500 dark:text-gray-500">
              <p>© {new Date().getFullYear()} Deposun. Tüm Hakları Saklıdır.</p>
            </div>
            <div className="lg:px-8 flex justify-center">
              <Button
                variant="outline"
                onClick={scrollToTop}
                className="rounded-full flex items-center gap-2 text-sm hover:bg-primary hover:text-white transition-colors"
              >
                <ArrowUpCircle size={16} />
                <span>Başa Dön</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
