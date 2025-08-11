import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaignCoupons } from "@/store/common-slice/coupons-slice";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Percent,
  Calendar,
  Gift,
  Sparkles,
  Tag,
  Clock,
  TrendingUp,
  Crown,
  Star,
  Zap,
} from "lucide-react";

function formatDiscount(coupon) {
  if (coupon.discountType === "percentage") {
    return {
      value: `%${coupon.discountValue}`,
      text: "İndirim",
      icon: Percent,
    };
  }
  return {
    value: `${coupon.discountValue}₺`,
    text: "İndirim",
    icon: TrendingUp,
  };
}

function formatDate(dateString) {
  if (!dateString) return "Süresiz";
  return new Date(dateString).toLocaleDateString("tr-TR");
}

export default function Campaigns() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { coupons, isLoading, error } = useSelector(
    (state) => state.campaignCoupons
  );

  useEffect(() => {
    dispatch(fetchCampaignCoupons());
  }, [dispatch]);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "🎉 Kupon Kopyalandı!",
        description: `${code} kodu panoya kopyalandı. Alışverişinizde kullanabilirsiniz.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      toast({
        title: "🎉 Kupon Kopyalandı!",
        description: `${code} kodu panoya kopyalandı.`,
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Gift className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-800" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Özel Kampanyalar
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Size özel hazırladığımız harika indirim fırsatlarını kaçırmayın!
            Kupon kodlarını kopyalayıp alışverişinizde kullanın.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              >
                <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Bir hata oluştu
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => dispatch(fetchCampaignCoupons())}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Tekrar Dene
            </Button>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Yakında Harika Kampanyalar!
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
              Şu anda aktif kampanya bulunmuyor, ancak çok yakında size özel
              fırsatlar hazırlıyoruz!
            </p>
            <div className="flex items-center justify-center gap-2 text-purple-600">
              <Clock className="w-5 h-5" />
              <span className="font-medium">
                Güncellemeler için takipte kalın
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coupons.map((coupon, index) => {
              const discount = formatDiscount(coupon);
              const DiscountIcon = discount.icon;

              return (
                <div
                  key={coupon._id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Premium Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 border-0 shadow-lg">
                      <Crown className="w-3 h-3 mr-1" />
                      ÖZEL
                    </Badge>
                  </div>

                  {/* Discount Header */}
                  <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4 text-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative text-center">
                      <div className="text-4xl font-bold tracking-tight">
                        {discount.value}
                      </div>
                      <div className="text-lg font-medium text-white/90">
                        {discount.text}
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-2 left-2 w-4 h-4 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Coupon Image */}
                    {coupon.imageUrl && (
                      <div className="mb-4 -mt-2">
                        <img
                          src={coupon.imageUrl}
                          alt="Kampanya Görseli"
                          className="w-full h-32 object-cover rounded-xl bg-gray-50 shadow-sm"
                        />
                      </div>
                    )}

                    {/* Description */}
                    {coupon.description && (
                      <p className="text-gray-600 text-center mb-4 leading-relaxed">
                        {coupon.description}
                      </p>
                    )}

                    {/* Coupon Code Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-4 mb-4 border border-purple-100">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2 flex items-center justify-center gap-1">
                          <Tag className="w-4 h-4" />
                          Kupon Kodu
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <span className="font-mono font-bold text-xl text-purple-700 tracking-wider bg-white px-3 py-1 rounded-lg border-2 border-purple-200">
                            {coupon.code}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Copy Button */}
                    <Button
                      onClick={() => handleCopy(coupon.code)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105"
                      size="lg"
                    >
                      <Copy className="w-5 h-5 mr-2" />
                      Kodu Kopyala
                    </Button>

                    {/* Validity Period */}
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {coupon.expiryDate
                            ? `${formatDate(coupon.expiryDate)} tarihine kadar`
                            : "Süresiz geçerli"}
                        </span>
                      </div>
                    </div>

                    {/* Minimum Purchase */}
                    {coupon.minPurchase > 0 && (
                      <div className="mt-2 text-center">
                        <div className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          Min. {coupon.minPurchase}₺ alışveriş
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
