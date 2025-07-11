import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">İletişim Bilgileri</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* İletişim Bilgileri */}
        <div className="space-y-6">
          
          
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 mt-1 text-primary" />
            <div>
              <h3 className="font-medium">E-posta</h3>
              <p className="text-muted-foreground">destek@deposun.com</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 mt-1 text-primary" />
            <div>
              <h3 className="font-medium">Telefon</h3>
              <p className="text-muted-foreground">+90 (532) 471 28 24</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 mt-1 text-primary" />
            <div>
              <h3 className="font-medium">Adres</h3>
              <p className="text-muted-foreground">
                Fevziçakmak, 10777 Sk. No:1AC, 42250<br />
                Karatay/Konya
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 