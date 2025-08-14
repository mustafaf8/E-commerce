import { useState , useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import axios from "../../api/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm(prevForm => ({
        ...prevForm,
        name: user.userName || "",
        email: user.email || ""
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (isAuthenticated && user) {
        payload.userId = user.id;
      }

      await axios.post("/contact/send", payload);
      toast({ title: "Mesajınız başarıyla gönderildi!", variant: "success" });

      if (isAuthenticated) {
        setForm(prev => ({ ...prev, subject: "", message: "" }));
      } else {
        setForm({ name: "", email: "", subject: "", message: "" });
      }
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast({ title: "Mesaj gönderilemedi!", description: err?.response?.data?.message || "Bir hata oluştu.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12 mb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">İletişim</h1>
            <p className="text-lg opacity-90 md:w-2/3 text-center">
              Bize ulaşmak için aşağıdaki formu doldurabilirsiniz. Size yardımcı olmaktan memnuniyet duyarız.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Şirket Bilgileri - Modern Kart */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-2xl shadow-lg p-8 flex flex-col gap-8 border border-yellow-200 dark:border-yellow-700">
              {/* Adres */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <MapPin className="text-yellow-600 w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1 tracking-wide">ADRES</div>
                  <div className="text-gray-700 dark:text-gray-200 leading-relaxed text-base">
                    Fevziçakmak, 10777. Sk.<br />No:1AC, 42250 Karatay/Konya
                  </div>
                </div>
              </div>
              {/* Telefon */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Phone className="text-yellow-600 w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1 tracking-wide">İLETİŞİM NUMARASI</div>
                  <div className="text-yellow-700 dark:text-yellow-300 font-semibold text-base select-all">+90 (532) 471 28 24</div>
                </div>
              </div>
              {/* Mail */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Mail className="text-yellow-600 w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1 tracking-wide">MAIL ADRESİ</div>
                  <div className="text-yellow-700 dark:text-yellow-300 font-semibold text-base select-all">destek@depsoun.com</div>
                </div>
              </div>
            </div>
          </div>
           {/* Mesaj Gönderme Formu */}
           <div className="flex-1">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Ad Soyad</label>
                {/* GÜNCELLEME: Kullanıcı giriş yapmışsa bu alan doldurulur ve değiştirilemez. */}
                <input name="name" value={form.name} onChange={handleChange} required disabled={isAuthenticated} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">E-posta</label>
                {/* GÜNCELLEME: Kullanıcı giriş yapmışsa bu alan doldurulur ve değiştirilemez. */}
                <input name="email" type="email" value={form.email} onChange={handleChange} maxLength="50" required disabled={isAuthenticated} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:bg-gray-100 dark:disabled:bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Konu</label>
                <input name="subject" value={form.subject} onChange={handleChange} required maxLength="100" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Mesajınız</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} maxLength="200" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-60" aria-label="Gönder">
                {loading ? "Gönderiliyor..." : "Gönder"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 