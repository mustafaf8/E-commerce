import { FileText, User, ShoppingCart, CreditCard, Truck, RotateCcw, Scale, Phone } from "lucide-react";

const DistanceSalesContract = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-12 mb-6 text-center">
        <div className="container mx-auto px-4">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Mesafeli Satış Sözleşmesi
              </h1>
              <p className="text-xl opacity-90">
                Online alışveriş sürecinde sizin ve bizim hak ve 
                yükümlülüklerimizi düzenleyen sözleşme şartları.
              </p>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Contract Parties */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <User className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sözleşme Tarafları
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                SATICI BİLGİLERİ
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                <p><strong>Unvan:</strong> Göktürkler Enerji</p>
                <p><strong>Adres:</strong> Akademi Mah. Oyalı Sk. No:8d Selçuklu/ Konya</p>
                <p><strong>Telefon:</strong> +90 533 393 71 74</p>
                <p><strong>E-posta:</strong> gokturklerenerji@gmail.com</p>
              
                <p><strong>V.D./V.N.:</strong> [SELÇUK (KONYA)/7350776184]</p>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                ALICI BİLGİLERİ
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-400">
                <p>Sözleşme, sipariş verme anında sisteme kaydettiğiniz bilgiler üzerinden düzenlenir:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Ad, Soyad/Ticaret Unvanı</li>
                  <li>Adres Bilgileri</li>
                  <li>Telefon Numarası</li>
                  <li>E-posta Adresi</li>
                  <li>Vergi No / TC Kimlik No</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Product and Order Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            Ürün ve Sipariş Bilgileri
          </h2>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                Ürün Özellikleri ve Fiyat Bilgileri
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
                <li>• Sipariş verdiğiniz ürünlerin temel özellikleri web sitemizde belirtilmiştir.</li>
                <li>• Listelenen fiyatlar KDV dahildir.</li>
                <li>• Kampanya ve indirim koşulları sipariş anında geçerli olanlar esas alınır.</li>
                <li>• Ürün resimleri temsilidir, renk tonları cihazınıza göre farklılık gösterebilir.</li>
                <li>• Teknik özellikler üretici firma bilgileri doğrultusundadır.</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                Sipariş Süreci
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-500">Ürün Seçimi</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-500">Sepete Ekleme</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-500">Ödeme İşlemi</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">4</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-500">Sipariş Onayı</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
            Ödeme Koşulları
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">
                Kabul Edilen Ödeme Yöntemleri
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Kredi Kartı (Visa, MasterCard, American Express)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Banka Kartı
                </li>              
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Havale/EFT
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Taksitli Ödeme Seçenekleri
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">
                Ödeme Güvenliği
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
                <li>• Tüm ödemeler 256-bit SSL güvenlik sertifikası ile korunmaktadır.</li>
                <li>• Kredi kartı bilgileriniz kayıt altına alınmaz.</li>
                <li>• 3D Secure doğrulama sistemi kullanılmaktadır.</li>
                <li>• PCI DSS güvenlik standartlarına uygun işlem yapılmaktadır.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Önemli Ödeme Notları:
            </h4>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Havale/EFT ödemelerinde, ödeme dekontu gokturklerenerji@gmail.com adresine gönderilmelidir.</li>
              <li>• Taksit seçenekleri banka kampanyalarına bağlı olarak değişebilir.</li>
              <li>• Yurt dışı kartlar ile ödeme kabul edilmemektedir.</li>
            </ul>
          </div>
        </div>

        {/* Delivery Terms */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-2" />
            Teslimat Koşulları
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                  Teslimat Süreleri
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• Aynı gün: Saat 14:00'a kadar</li>
                  <li>• 1-2 gün: Büyük şehirler</li>
                  <li>• 2-3 gün: Diğer iller</li>
                  <li>• 3-5 gün: Uzak bölgeler</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                  Kargo Ücretleri
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• 200 TL üzeri: Ücretsiz</li>
                  <li>• 200 TL altı: 19,90 TL</li>
                  <li>• Aynı gün: +15 TL</li>
                  <li>• Büyük boy: Özel fiyat</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                  Teslimat Şartları
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• Kimlik ibrazı gerekli</li>
                  <li>• Adrese teslim</li>
                  <li>• SMS/e-posta bilgilendirme</li>
                  <li>• Ücretsiz 3 deneme hakkı</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                ⚠️ Teslimat Gecikmeleri
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Hava koşulları, doğal afetler, grev gibi mücbir sebeplerden dolayı teslimat gecikebilir. 
                Bu durumlarda SATICI sorumlu tutulamaz ve ALICI herhangi bir tazminat talebinde bulunamaz.
              </p>
            </div>
          </div>
        </div>

        {/* Return/Cancellation Rights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <RotateCcw className="h-6 w-6 text-teal-600 dark:text-teal-400 mr-2" />
            Cayma ve İade Hakkı
          </h2>

          <div className="space-y-6">
            <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-3">
                14 Günlük Cayma Hakkı
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Tüketicinin Korunması Hakkında Kanun uyarınca, ürünü teslim aldığınız tarihten 
                itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin 
                sözleşmeden cayma hakkınız bulunmaktadır.
              </p>
              <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded">
                <p className="text-teal-800 dark:text-teal-200 text-sm">
                  💡 Cayma hakkı süresi, ürünün size veya belirlediğiniz üçüncü kişiye teslim edildiği günden itibaren başlar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                  ✅ Cayma Hakkı Kullanılabilir
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• Ambalajı açılmamış ürünler</li>
                  <li>• Deneme amaçlı kullanılmış ürünler</li>
                  <li>• Orijinal ambalajında ürünler</li>
                  <li>• Etiketleri sökülmemiş ürünler</li>
                  <li>• Hijyen şartları uygun ürünler</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3">
                  ❌ Cayma Hakkı Kullanılamaz
                </h4>
                <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
                  <li>• Kişisel hijyen ürünleri</li>
                  <li>• Kullanılmış kozmetik ürünler</li>
                  <li>• Özel üretim ürünler</li>
                  <li>• Dijital içerik ve yazılımlar</li>
                  <li>• Mühürlü ses/görüntü kayıtları</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Obligations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Scale className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            Tarafların Hak ve Yükümlülükleri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
                SATICI'nın Yükümlülükleri
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
                <li>• Ürünü sözleşme şartlarına uygun olarak teslim etmek</li>
                <li>• Ürün hakkında doğru ve eksiksiz bilgi vermek</li>
                <li>• Yasal garanti şartlarını yerine getirmek</li>
                <li>• Kişisel verileri korumak ve gizliliği sağlamak</li>
                <li>• Cayma hakkı taleplerini yasal sürede işleme almak</li>
                <li>• Müşteri hizmetleri desteği sağlamak</li>
              </ul>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
                ALICI'nın Yükümlülükleri
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-400 space-y-2">
                <li>• Sipariş bedelini zamanında ödemek</li>
                <li>• Doğru ve güncel bilgiler vermek</li>
                <li>• Ürünü teslim almak veya alacak kişiyi yetkilendirmek</li>
                <li>• Ürünü amacına uygun kullanmak</li>
                <li>• İade işlemlerinde gerekli koşulları sağlamak</li>
                <li>• Site kullanım kurallarına uymak</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dispute Resolution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Phone className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
            Uyuşmazlık Çözümü ve Yetkili Mahkeme
          </h2>

          <div className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3">
                Şikayet ve İtiraz Başvuruları
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Satın aldığınız ürün veya hizmetle ilgili şikayetlerinizi aşağıdaki yollarla iletebilirsiniz:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tüketici Hakem Heyetleri</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Satın alınan ürünün değerine göre</li>
                    <li>• İkamet edilen yer Hakem Heyeti'ne</li>
                    <li>• www.tuketici.gov.tr</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tüketici Mahkemeleri</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Parasal sınırlar dışındaki uyuşmazlıklar</li>
                    <li>• İkamet edilen yer mahkemeleri</li>
                    <li>• Yasal süre: 3 yıl</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Sözleşme Hükümleri:
              </h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Bu sözleşme elektronik ortamda düzenlenmiş olup, Türk Hukuku'na tabidir.</li>
                <li>• Sözleşme şartlarından birinin geçersiz olması diğer şartları etkilemez.</li>
                <li>• Özel indirim ve kampanya koşulları ayrıca belirtilir.</li>
                <li>• Sözleşme, sipariş onayı ile birlikte yürürlüğe girer.</li>
                <li>• İletişim: gokturklerenerji@gmail.com / +90 533 393 71 74</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceSalesContract; 