import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 mb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">İletişim Bilgileri</h1>
            <p className="text-lg opacity-90 md:w-2/3 text-center">
              Bize ulaşmak için aşağıdaki iletişim kanallarını kullanabilirsiniz. Size yardımcı olmaktan memnuniyet duyarız.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
              </span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">E-posta</h3>
                <p className="text-muted-foreground">destek@deposun.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30">
                <Phone className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Telefon</h3>
                <p className="text-muted-foreground">+90 (532) 471 28 24</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30">
                <MapPin className="w-6 h-6 text-green-600 dark:text-green-300" />
              </span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Adres</h3>
                <p className="text-muted-foreground">
                  Fevziçakmak, 10777 Sk. No:1AC, 42250<br />Karatay/Konya
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 