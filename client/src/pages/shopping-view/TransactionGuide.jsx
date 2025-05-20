import { Link } from "react-router-dom";
import {
  AlertCircle,
  HelpCircle,
  CheckCircle,
  UserIcon,
  ShoppingCart,
  CreditCard,
  LifeBuoy,
  Heart,
  Trash2,
} from "lucide-react";

const TransactionGuide = () => {
  const sections = [
    {
      id: "account",
      title: "Hesap İşlemleri",
      icon: (
        <UserIcon className="h-6 w-6 text-primary dark:text-primary-light" />
      ),
      items: [
        {
          title: "Nasıl Kayıt Olunur?",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Giriş sayfasındaki &quot;Kayıt Ol&quot; bağlantısını kullanın.
              </li>
              <li>Kullanıcı adı, e-posta ve güvenli bir şifre belirleyin.</li>
              <li>
                Alternatif olarak, telefon numarası ile giriş yaparken
                yönlendirildiğiniz adımları takip ederek adınızı belirtin ve
                kaydı tamamlayın.
              </li>
            </ul>
          ),
        },
        {
          title: "Nasıl Giriş Yapılır?",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">E-posta/Şifre:</span> Giriş
                sayfasında ilgili alanları doldurun.
              </li>
              <li>
                <span className="font-medium">Telefon Numarası:</span>{" "}
                Numaranızı girin ve SMS ile gelen doğrulama kodunu kullanın.
              </li>
              <li>
                <span className="font-medium">Google:</span> &quot;Google ile
                Giriş Yap&quot; butonunu kullanın.
              </li>
              <li className="flex items-start">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  Giriş yaparken sorun yaşıyorsanız (örn. şifre hatası, SMS
                  gelmemesi), lütfen bilgilerinizi kontrol edin veya destek ile
                  iletişime geçin.
                </span>
              </li>
            </ul>
          ),
        },
        {
          title: "Hesap Bilgilerimi Nasıl Güncellerim?",
          content: (
            <p>
              &quot;Hesabım&quot; sayfasındaki &quot;Bilgilerim&quot;
              sekmesinden sadece{" "}
              <span className="font-medium">kullanıcı adınızı</span>{" "}
              güncelleyebilirsiniz. Güvenlik amacıyla e-posta ve telefon
              numarası değiştirilemez.
            </p>
          ),
        },
        {
          title: "Adreslerimi Nasıl Yönetirim?",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                &quot;Hesabım&quot; sayfasındaki &quot;Adresler&quot; sekmesine
                gidin.
              </li>
              <li>Mevcut adresleri düzenleyebilir veya silebilirsiniz.</li>
              <li>
                &quot;Yeni Adres Ekle&quot; bölümünden en fazla 3 adet teslimat
                adresi tanımlayabilirsiniz.
              </li>
              <li className="flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>
                  Adreslerinizin doğruluğu, siparişlerinizin sorunsuz teslimatı
                  için önemlidir.
                </span>
              </li>
            </ul>
          ),
        },
      ],
    },
    {
      id: "shopping",
      title: "Alışveriş ve Ürünler",
      icon: (
        <ShoppingCart className="h-6 w-6 text-primary dark:text-primary-light" />
      ),
      items: [
        {
          title: "Ürün Nasıl Aranır?",
          content: (
            <p>
              Sayfanın üst kısmındaki arama çubuğunu kullanarak ürün adı, marka
              veya kategoriye göre hızlıca arama yapabilirsiniz.
            </p>
          ),
        },
        {
          title: "Ürünler Nasıl Filtrelenir ve Sıralanır?",
          content: (
            <p>
              Listeleme sayfalarında sol bölümdeki filtreleri (kategori, marka
              vb.) kullanarak sonuçları daraltın. Sağ üstteki &quot;Sırala&quot;
              menüsü ile fiyat, popülerlik gibi kriterlere göre düzenleyin.
            </p>
          ),
        },
        {
          title: "Ürün Sepete Nasıl Eklenir?",
          content: (
            <p className="flex items-start">
              <span className="flex-grow">
                Ürün kartı veya detay sayfasındaki &quot;Sepete Ekle&quot;
                butonu ile ekleyebilirsiniz.{" "}
              </span>
              <CheckCircle className="w-5 h-5 ml-2 text-green-500 flex-shrink-0" />
            </p>
          ),
        },
        {
          title: "Favori Listesi Nasıl Kullanılır?",
          content: (
            <p className="flex items-center">
              Ürünlerdeki{" "}
              <Heart className="inline-block w-5 h-5 mx-1 text-red-500" />{" "}
              ikonuna tıklayarak favorilerinize ekleyip çıkarabilirsiniz.
              Listenize alt menüden veya &quot;Hesabım&quot; sayfasından ulaşın.
            </p>
          ),
        },
        {
          title: "Ürün Yorumları",
          content: (
            <p>
              Ürün detay sayfasında diğer kullanıcıların yorumlarını okuyabilir
              ve ürünü satın aldıysanız kendi değerlendirmenizi (puan ve yorum)
              ekleyebilirsiniz.
            </p>
          ),
        },
      ],
    },
    {
      id: "orders",
      title: "Sipariş ve Ödeme",
      icon: (
        <CreditCard className="h-6 w-6 text-primary dark:text-primary-light" />
      ),
      items: [
        {
          title: "Sepetim Nasıl Görüntülenir ve Düzenlenir?",
          content: (
            <p className="flex items-center">
              Sepet ikonuna tıklayarak sepetinize ulaşın. Burada ürün adetlerini
              güncelleyebilir veya{" "}
              <Trash2 className="inline-block w-5 h-5 mx-1 text-red-600" />{" "}
              ikonu ile ürünü sepetten çıkarabilirsiniz.
            </p>
          ),
        },
        {
          title: "Ödeme İşlemi Nasıl Tamamlanır?",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Sepetinizden &quot;Ödeme Sayfasına Git&quot; butonuna tıklayın.
              </li>
              <li className="flex items-start">
                <span className="flex-grow">
                  Kayıtlı adreslerinizden birini seçin veya yeni bir adres
                  girin.{" "}
                </span>
                <AlertCircle className="w-5 h-5 ml-2 text-orange-500 flex-shrink-0 mt-0.5" />
              </li>
              <li>
                Lütfen adres bilgilerinizin güncel ve doğru olduğundan emin
                olun.
              </li>
              <li>&quot;Iyzico ile Güvenli Öde&quot; butonuna tıklayın.</li>
              <li>
                Açılan Iyzico ödeme ekranında kart bilgilerinizi girerek işlemi
                tamamlayın. Tüm ödeme işlemleri Iyzico güvencesi altındadır.
              </li>
              <li className="flex items-start">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  Ödeme sırasında hata alırsanız (örn. limit yetersiz, kart
                  bilgisi hatalı), lütfen bilgilerinizi kontrol edip tekrar
                  deneyin veya bankanızla iletişime geçin. Başarısız ödeme
                  sonrası{" "}
                  <Link
                    to="/shop/payment-failure"
                    className="text-blue-600 hover:underline"
                  >
                    ödeme başarısız
                  </Link>{" "}
                  sayfasına yönlendirilirsiniz.
                </span>
              </li>
            </ul>
          ),
        },
        {
          title: "Siparişlerim Nasıl Takip Edilir?",
          content: (
            <p>
              &quot;Hesabım&quot; sayfasındaki &quot;Siparişler&quot;
              sekmesinden tüm siparişlerinizi ve güncel durumlarını (Onaylandı,
              Hazırlanıyor, Kargoda, Teslim Edildi, İptal Edildi)
              görebilirsiniz. Sipariş detaylarını görüntülemek için ilgili
              siparişe tıklayın.
            </p>
          ),
        },
      ],
    },
    {
      id: "support",
      title: "Yardım ve Destek",
      icon: (
        <LifeBuoy className="h-6 w-6 text-primary dark:text-primary-light" />
      ),
      content: (
        <div className="space-y-4">
          <p>
            Sıkça sorulan sorular veya iade/değişim politikamız için ilgili
            sayfaları ziyaret edebilirsiniz (Linkleri footer&apos;da
            bulabilirsiniz).
          </p>
          <p>
            Bu rehberde bulamadığınız veya çözemediğiniz bir sorunla
            karşılaşırsanız,{" "}
            <Link
              to="/shop/iletisim"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              İletişim
            </Link>{" "}
            sayfamız üzerinden veya footer&apos;daki WhatsApp/Çağrı Merkezi
            bilgilerimizden bize ulaşmaktan çekinmeyin.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent dark:from-primary-light dark:to-secondary-light">
            İşlem Rehberi
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Sitemizi kullanırken ihtiyacınız olabilecek temel adımlar ve sıkça
            sorulan soruların cevapları burada.
          </p>
        </div>

        {/* Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="mr-2 text-primary dark:text-primary-light">
                {section.icon}
              </span>
              <span>{section.title}</span>
            </a>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-16">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-20 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-gray-200 dark:border-gray-700 flex items-center text-gray-800 dark:text-white">
                <span className="p-2 mr-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary-light">
                  {section.icon}
                </span>
                {section.title}
              </h2>

              {section.content ? (
                <div className="text-gray-700 dark:text-gray-300">
                  {section.content}
                </div>
              ) : (
                <div className="space-y-6">
                  {section.items.map((item, index) => (
                    <div key={index} className="group">
                      <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                        {item.title}
                      </h3>
                      <div className="text-gray-700 dark:text-gray-300 pl-1">
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-center mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center px-4 py-2 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Yukarı Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionGuide;
