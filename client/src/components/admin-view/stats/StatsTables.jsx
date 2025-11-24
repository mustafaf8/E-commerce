import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const placeholderCustomers = Array.from({ length: 4 }).map((_, idx) => ({
  name: `Örnek Müşteri ${idx + 1}`,
  email: "musteri@example.com",
  orderCount: "-",
  totalSpent: "-",
}));

const placeholderTopProducts = [
  {
    title: "Örnek Ürün A",
    productId: "SKU-001",
    salesLabel: "-",
    priceLabel: "-",
    progress: 80,
  },
  {
    title: "Örnek Ürün B",
    productId: "SKU-002",
    salesLabel: "-",
    priceLabel: "-",
    progress: 60,
  },
  {
    title: "Örnek Ürün C",
    productId: "SKU-003",
    salesLabel: "-",
    priceLabel: "-",
    progress: 50,
  },
];

const placeholderLowStock = [
  {
    title: "Örnek Ürün 1",
    stockLabel: "-",
    statusLabel: "Beklemede",
    statusClass: "bg-muted text-muted-foreground",
  },
  {
    title: "Örnek Ürün 2",
    stockLabel: "-",
    statusLabel: "Beklemede",
    statusClass: "bg-muted text-muted-foreground",
  },
  {
    title: "Örnek Ürün 3",
    stockLabel: "-",
    statusLabel: "Beklemede",
    statusClass: "bg-muted text-muted-foreground",
  },
];

const overlayMessage =
  "Henüz veri bulunmuyor. Satışlar başladığında grafikler burada canlanacak.";

const CardOverlay = ({ text }) => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/70 text-center px-4 text-xs text-muted-foreground">
    {text}
  </div>
);

const StatsTables = ({
  topCustomers,
  topSellingProducts,
  lowStockProducts,
}) => {
  const customersEmpty = !topCustomers || topCustomers.length === 0;
  const filteredCustomers = customersEmpty
    ? placeholderCustomers
    : topCustomers.slice(0, 6);

  const normalizedTopProducts = (topSellingProducts || [])
    .filter((p) => (p.salesCount || p.totalUnits || 0) > 0)
    .slice(0, 10);
  const topSellingEmpty = normalizedTopProducts.length === 0;
  const maxSales = topSellingEmpty
    ? 100
    : Math.max(
        ...normalizedTopProducts.map((p) => p.salesCount || p.totalUnits || 0)
      ) || 1;
  const topProductsDisplay = topSellingEmpty
    ? placeholderTopProducts
    : normalizedTopProducts.map((p, idx) => {
        const sales = p.salesCount || p.totalUnits || 0;
        return {
          key: p._id || idx,
          title: p.title,
          productId: p.productId || p._id,
          image: p.image,
          salesLabel: `${sales} adet`,
          priceLabel: p.salePrice ? `₺${p.salePrice}` : "",
          progress: (sales / maxSales) * 100,
        };
      });

  const lowStockEmpty = !lowStockProducts || lowStockProducts.length === 0;
  const lowStockDisplay = lowStockEmpty
    ? placeholderLowStock
    : lowStockProducts.map((p, idx) => ({
        key: p._id || idx,
        title: p.title,
        image: p.image,
        stockLabel: `${p.totalStock} adet`,
        statusLabel: p.totalStock <= 5 ? "Kritik" : "Düşük",
        statusClass:
          p.totalStock <= 5
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700",
      }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Customers */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>En Çok Sipariş Veren Müşteriler</CardTitle>
          </CardHeader>
          <CardContent
            className={`space-y-3 ${
              customersEmpty ? "opacity-60 grayscale" : ""
            }`}
          >
            {filteredCustomers.map((c, idx) => {
              const initials = (c.name || c.email || "M")[0].toUpperCase();
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-md border p-3 ${
                    customersEmpty
                      ? "text-muted-foreground opacity-70"
                      : "hover:shadow-sm transition-shadow"
                  }`}
                >
                  <span className="mr-3 text-lg font-bold text-muted-foreground">
                    {idx + 1}.
                  </span>
                  <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">
                      {c.name || "Misafir"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {c.orderCount} sip.
                    </span>
                    <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-xs">
                      ₺{c.totalSpent}
                    </span>
                  </div>
                </div>
              );
            })}
            {customersEmpty && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                Siparişler geldikçe müşteri listesi burada oluşacak.
              </p>
            )}
          </CardContent>
          {customersEmpty && <CardOverlay text={overlayMessage} />}
        </Card>

        {/* Top Selling & Low Stock */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="relative">
            <CardHeader>
              <CardTitle>En Çok Satan Ürünler</CardTitle>
            </CardHeader>
            <CardContent
              className={`space-y-4 ${
                topSellingEmpty ? "opacity-60 grayscale" : ""
              }`}
            >
              {topProductsDisplay.map((p, idx) => (
                <div
                  key={p.key || idx}
                  className="flex items-center gap-4 overflow-hidden"
                >
                  <span className="w-5 text-sm font-semibold text-muted-foreground">
                    {idx + 1}.
                  </span>
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-12 w-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">
                      {p.title}
                      <span className="ml-1 text-[10px] text-muted-foreground">
                        ({p.productId || "-"})
                      </span>
                    </p>
                    <div className="mt-1 h-2 w-full rounded bg-muted/40">
                      <div
                        style={{ width: `${p.progress || 0}%` }}
                        className="h-full rounded bg-primary"
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold">
                      {topSellingEmpty ? "-" : p.salesLabel}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {topSellingEmpty ? "-" : p.priceLabel}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
            {topSellingEmpty && <CardOverlay text={overlayMessage} />}
          </Card>

          <Card className="relative">
            <CardHeader>
              <CardTitle>Düşük Stok Ürünleri</CardTitle>
            </CardHeader>
            <CardContent
              className={`space-y-3 ${
                lowStockEmpty ? "opacity-60 grayscale" : ""
              }`}
            >
              {lowStockDisplay.map((p, idx) => (
                <div
                  key={p.key || idx}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {idx + 1}.
                    </span>
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Stok: {p.stockLabel}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${p.statusClass}`}
                  >
                    {p.statusLabel}
                  </span>
                </div>
              ))}
            </CardContent>
            {lowStockEmpty && <CardOverlay text={overlayMessage} />}
          </Card>
        </div>
      </div>
    </>
  );
};

export default StatsTables;
