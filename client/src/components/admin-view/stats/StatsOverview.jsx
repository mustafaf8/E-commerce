import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const placeholderCardClass =
  "relative overflow-hidden border-dashed border-muted text-muted-foreground";

const OverlayMessage = ({ text }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm text-center px-4">
    <p className="text-xs font-medium text-muted-foreground">{text}</p>
  </div>
);

const formatValue = (value, isPlaceholder) => {
  if (value === undefined || value === null) return isPlaceholder ? "-" : "0";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return "-";
  return parsed.toFixed(2);
};

const StatsOverview = ({ salesOverview }) => {
  const isEmpty =
    !salesOverview ||
    [
      salesOverview.totalGrossRevenue,
      salesOverview.totalDiscount,
      salesOverview.totalNetRevenue,
      salesOverview.totalOrders,
    ].every((val) => !val || Number(val) === 0);

  const cards = [
    {
      title: "Brüt Satış",
      value: `${formatValue(salesOverview?.totalGrossRevenue, isEmpty)}₺`,
      subText:
        salesOverview?.totalDiscount > 0
          ? `+${formatValue(salesOverview.totalDiscount, false)}₺ indirim uygulandı`
          : "İndirimler öncesi toplam tutar",
    },
    {
      title: "Toplam Kupon İndirimi",
      value: `-${formatValue(salesOverview?.totalDiscount, isEmpty)}₺`,
      subText: "Uygulanan toplam indirim",
    },
    {
      title: "Net Gelir",
      value: `${formatValue(salesOverview?.totalNetRevenue, isEmpty)}₺`,
      subText: "İndirimler sonrası net kazanç",
    },
    {
      title: "Toplam Sipariş",
      value: isEmpty
        ? "-"
        : `${salesOverview?.totalOrders || 0}`,
      subText: `Ort. Sipariş Değeri: ${
        formatValue(salesOverview?.averageOrderValue, isEmpty) || "-"
      }₺`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <Card
          key={card.title}
          className={cn(isEmpty && placeholderCardClass)}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div
              className={cn(
                "text-2xl font-bold transition-opacity",
                isEmpty && "opacity-60"
              )}
            >
              {card.value}
            </div>
            <p
              className={cn(
                "text-xs text-muted-foreground",
                isEmpty && "opacity-60"
              )}
            >
              {card.subText}
            </p>
          </CardContent>
          {isEmpty && idx === 0 && (
            <OverlayMessage text="Henüz veri bulunmuyor. Satışlar başladığında kartlar burada canlanacak." />
          )}
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
