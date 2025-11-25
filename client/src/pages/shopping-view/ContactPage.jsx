import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Headphones,
  ShieldCheck,
  MessageSquare,
  Clock3,
  ArrowRight,
} from "lucide-react";
import axios from "../../api/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prevForm) => ({
        ...prevForm,
        name: user.userName || "",
        email: user.email || "",
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
        setForm((prev) => ({ ...prev, subject: "", message: "" }));
      } else {
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      toast({
        title: "Mesaj gönderilemedi!",
        description: err?.response?.data?.message || "Bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactHighlights = [
    {
      title: "7/24 Destek",
      description: "Ödeme ve teslimat sorularınız için anında destek",
      icon: Headphones,
    },
    {
      title: "Sipariş Güvencesi",
      description: "İşlem güvenliği için gelişmiş izleme sistemi",
      icon: ShieldCheck,
    },
    {
      title: "Hızlı Yanıt",
      description: "Mesajlar ortalama 2 saat içinde yanıtlanır",
      icon: MessageSquare,
    },
  ];

  const supportHours = [
    { day: "Pazartesi - Cuma", hours: "09:00 - 22:00" },
    { day: "Cumartesi", hours: "10:00 - 18:00" },
    { day: "Pazar", hours: "12:00 - 17:00" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <section className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-14 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
            <ShieldCheck className="h-4 w-4" />
            256-bit şifrelenmiş iletişim hattı
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Müşteri Mutluluğu Ekibimizle İletişime Geçin
            </h1>
            <p className="text-base md:text-lg max-w-3xl mx-auto text-white/80">
              Sipariş durumları, iş ortaklığı ve ödeme süreçleri için uzman
              ekibimiz dakikalar içinde dönüş yapar.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {contactHighlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur"
              >
                <item.icon className="h-9 w-9 text-white/90" />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-white/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 space-y-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/40">
                <Mail className="h-5 w-5 text-indigo-700 dark:text-indigo-200" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hızlı iletişim formu
                </p>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Mesaj Gönderin
                </h2>
              </div>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Ad Soyad
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={isAuthenticated}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    E-posta
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    maxLength="50"
                    required
                    disabled={isAuthenticated}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Konu
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    maxLength="100"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Mesajınız
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  maxLength="200"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-white font-semibold shadow-lg transition hover:translate-y-0.5 disabled:opacity-60"
                aria-label="Gönder"
              >
                {loading ? "Gönderiliyor..." : "Mesajı Gönder"}
              </button>
            </form>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                <Clock3 className="h-4 w-4" />
                Destek Saatleri
              </div>
              <div className="mt-4 space-y-3">
                {supportHours.map((slot) => (
                  <div
                    key={slot.day}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm dark:border-gray-700"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {slot.day}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {slot.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-2xl shadow-xl border border-yellow-100 dark:border-yellow-700 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-yellow-500/20 p-3">
                  <MapPin className="h-6 w-6 text-yellow-700 dark:text-yellow-200" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-yellow-700 dark:text-yellow-200">
                    Merkez Ofis
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    Akademi Mah. Oyalı Sk. No:8d Selçuklu / Konya
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white/70 p-4 dark:bg-gray-900/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    İletişim
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white select-all">
                    +90 (533) 393 71 74
                  </p>
                </div>
                <div className="rounded-xl bg-white/70 p-4 dark:bg-gray-900/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Mail
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white select-all">
                    gokturklerenerji@gmail.com
                  </p>
                </div>
              </div>
              <a
                href="tel:+905333937174"
                className="inline-flex items-center justify-between w-full rounded-xl bg-yellow-500/90 px-4 py-3 text-sm font-semibold text-yellow-950 transition hover:bg-yellow-500"
              >
                Şimdi Ara
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
            <iframe
              title="Harita"
              src="https://www.google.com/maps?q=Akademi%20Mahallesi%20Oyal%C4%B1%20Sk%20No:8d%20Sel%C3%A7uklu%20Konya&output=embed"
              className="w-full h-80 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sık Sorulan Başlıklar
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                Kargo durumunu öğrenmek için sipariş numaranızı
                paylaşabilirsiniz.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                İade talebi için fatura bilgisi ve ürün fotoğrafını eklemeyi
                unutmayın.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                B2B ve toptan satınalma talepleri için konu başlığında
                "Kurumsal" belirtin.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
