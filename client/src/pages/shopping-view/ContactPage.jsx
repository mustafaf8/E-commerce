import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import axios from "@/api/axiosInstance";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("contact/send", formData);
      
      if (response.data.success) {
        toast({
          title: "Başarılı!",
          description: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
          variant: "success",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(response.data.message || "Bir hata oluştu");
      }
    } catch (error) {
      toast({
        title: "Başarılı!",
          description: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
          variant: "success",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-center">Bize Ulaşın</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* İletişim Bilgileri */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2>
          
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

        {/* İletişim Formu */}
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Mesaj Gönderin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Adınız ve soyadınız"
                required
                maxLength={50}
                pattern="^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,}$"
                title="Lütfen geçerli bir ad soyad giriniz"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="E-posta adresiniz"
                required
                maxLength={50}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Konu</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Mesajınızın konusu"
                required
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mesajınız</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mesajınızı buraya yazın..."
                required
                maxLength={500}
                rows={5}
                className="resize-none"
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 