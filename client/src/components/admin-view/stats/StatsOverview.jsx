import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatsOverview = ({ salesOverview }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Brüt Satış */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Brüt Satış</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {salesOverview?.totalGrossRevenue?.toFixed(2) || "0.00"}₺
          </div>
          <p className="text-xs text-muted-foreground">
            İndirimler öncesi toplam tutar
            {salesOverview?.totalDiscount > 0 && (
              <span className="block text-green-600">
                +{salesOverview.totalDiscount.toFixed(2)}₺ indirim uygulandı
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Toplam Kupon İndirimi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Toplam Kupon İndirimi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">
            -{salesOverview?.totalDiscount?.toFixed(2) || "0.00"}₺
          </div>
          <p className="text-xs text-muted-foreground">Uygulanan toplam indirim</p>
        </CardContent>
      </Card>

      {/* Net Gelir */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Net Gelir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {salesOverview?.totalNetRevenue?.toFixed(2) || "0.00"}₺
          </div>
          <p className="text-xs text-muted-foreground">İndirimler sonrası net kazanç</p>
        </CardContent>
      </Card>
      
      {/* Toplam Sipariş */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{salesOverview?.totalOrders || 0}</div>
           <p className="text-xs text-muted-foreground">
            Ort. Sipariş Değeri: {salesOverview?.averageOrderValue?.toFixed(2) || "0.00"}₺
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
