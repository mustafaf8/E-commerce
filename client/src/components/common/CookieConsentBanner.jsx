import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Info } from "lucide-react"; // Info ikonu eklendi

const COOKIE_CONSENT_KEY = "cookie_consent_status";

function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consentStatus) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // 1.5 saniye sonra
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
    // Burada kabul edildiğinde yapılacak ek işlemler olabilir, örneğin:
    // if (typeof window.gtag === 'function') { // Eğer Google Analytics kullanılıyorsa
    //   window.gtag('consent', 'update', {
    //     'analytics_storage': 'granted',
    //     'ad_storage': 'granted' // Pazarlama çerezleri için
    //   });
    // }
    // console.log('Çerezler kabul edildi.');
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
    // Burada reddedildiğinde yapılacak ek işlemler olabilir, örneğin:
    // if (typeof window.gtag === 'function') { // Eğer Google Analytics kullanılıyorsa
    //   window.gtag('consent', 'update', {
    //     'analytics_storage': 'denied',
    //     'ad_storage': 'denied'
    //   });
    // }
    // console.log('Çerezler reddedildi.');
    // Önemli Not: Reddetme durumunda, sitenizin çalışması için zorunlu olmayan
    // çerezleri (analitik, pazarlama vb.) yüklememelisiniz.
    // Bu genellikle kullandığınız üçüncü parti servislerin (örn: Google Analytics)
    // başlatılmasını/konfigürasyonunu bu tercihe göre ayarlayarak yapılır.
  };

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed bottom-0 left-0 right-0 w-full bg-background border-t border-border shadow-xl p-2 sm:p-3 md:p-4 z-[9999998] transition-all duration-500 ease-in-out transform hidden sm:block ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-start sm:items-center gap-2 md:gap-3 text-xs sm:text-sm text-muted-foreground w-full sm:w-auto">
          <Info className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
          <p>
            Sitemizde size daha iyi hizmet verebilmek çerezler kullanıyoruz.{' '}
            <Link
              to="/shop/kvkk"
              className="underline hover:text-primary font-medium"
            >
              Çerez Politikamız ve KVKK Aydınlatma Metni
            </Link>{' '}
            hakkında detaylı bilgiye ulaşabilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
            className="flex-1 sm:flex-none py-2 px-2 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
          >
            Reddet
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-2 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm"
          >
            Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
