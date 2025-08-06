import { useEffect, useState } from "react";
import axios from "@/api/axiosInstance";
import { useToast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";

export default function UserMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ subject: "", message: "" });
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/shop/messages");
      setMessages(res.data.messages || []);
    } catch (err) {
      toast({ title: "Mesajlar alınamadı", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const payload = {
        ...form,
        userId: user.id,
        name: user.userName,
        email: user.email,
      };

      await axios.post("/contact/send", payload);
      toast({ title: "Mesajınız gönderildi!", variant: "success" });
      setForm({ subject: "", message: "" });
      fetchMessages();
    } catch (err) {
      toast({ title: "Mesaj gönderilemedi!", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="font-bold text-lg mb-2">Yeni Mesaj Gönder</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Konu</label>
            <input name="subject" value={form.subject} onChange={handleChange} required className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-900 dark:border-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mesaj</label>
            <textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="w-full px-3 py-2 rounded border border-gray-300 dark:bg-gray-900 dark:border-gray-700" />
          </div>
          <button type="submit" disabled={sending} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-60">
            {sending ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="font-bold text-lg mb-4">Mesaj Geçmişim</h2>
        {loading ? (
          <div>Yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div>Hiç mesajınız yok.</div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg._id} className="border-b pb-4">
                <div className="font-semibold text-indigo-700">Konu: {msg.subject}</div>
                <div className="text-gray-700 dark:text-gray-200 mt-1">{msg.message}</div>
                <div className="text-xs text-gray-400 mt-1">Gönderim: {new Date(msg.createdAt).toLocaleString("tr-TR")}</div>
                {msg.replies && msg.replies.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.replies.map((rep, i) => (
                      <div key={i} className="bg-indigo-50 dark:bg-indigo-900/30 rounded p-2">
                        <div className="text-sm text-indigo-900 dark:text-indigo-100">Admin: {rep.message}</div>
                        <div className="text-xs text-gray-400 mt-1">Yanıt: {new Date(rep.createdAt).toLocaleString("tr-TR")}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${msg.status === 'replied' ? 'bg-green-100 text-green-700' : msg.status === 'read' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-700'}`}>
                    {msg.status === 'replied' ? 'Yanıtlandı' : msg.status === 'read' ? 'Okundu' : 'Yeni'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

