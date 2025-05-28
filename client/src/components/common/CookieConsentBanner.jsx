import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldCheck, Info } from "lucide-react"; // Info ikonu eklendi

const COOKIE_CONSENT_KEY = "cookie_consent_status";

function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem(COOKIE_CONSENT_KEY);
    // Eğer daha önce bir tercih yapılmamışsa veya durum "pending" (varsayılan) ise banner'ı göster
    if (!consentStatus) {
      // Banner'ı küçük bir gecikmeyle göstererek sayfa yüklemesinin önüne geçmeyelim
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
      aria-hidden={!isVisible} // Erişilebilirlik için
      className={`fixed bottom-0 left-0 right-0 w-full bg-background border-t border-border shadow-xl p-3 md:p-4 z-[60] transition-all duration-500 ease-in-out transform ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 md:gap-4">
        <div className="flex items-start lg:items-center gap-2 md:gap-3 text-sm text-muted-foreground">
          <Info className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0 mt-0.5 lg:mt-0" />
          <p>
            Sitemizde size daha iyi hizmet verebilmek ve alışveriş deneyiminizi
            kişiselleştirmek için çerezler kullanıyoruz.{" "}
            <Link
              to="/shop/kvkk"
              className="underline hover:text-primary font-medium"
            >
              Çerez Politikamız ve KVKK Aydınlatma Metni
            </Link>{" "}
            hakkında detaylı bilgiye ulaşabilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 w-full lg:w-auto mt-3 lg:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
            className="flex-1 lg:flex-none py-2 px-4 h-9 text-sm"
          >
            Reddet
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="flex-1 lg:flex-none bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 h-9 text-sm"
          >
            Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
