import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatsTables = ({ topCustomers, topSellingProducts, lowStockProducts }) => {
  return (
    <>
      {/* Top Customers & Top Liked Products */}
      {(topCustomers?.length > 0 || topSellingProducts?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Customers */}
          {topCustomers && topCustomers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>En Çok Sipariş Veren Müşteriler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCustomers.slice(0, 6).map((c, idx) => {
                  const initials = (c.name || c.email || "M")[0].toUpperCase();
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-md border p-3 hover:shadow-sm transition-shadow"
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
                          ₺{c.totalSpent.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Top Selling & Low Stock side-by-side */}
          {(topSellingProducts?.length > 0 || lowStockProducts?.length > 0) && (
            <div className="grid grid-cols-1 gap-4">
              {/* Top Selling Products */}
              {topSellingProducts?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>En Çok Satan Ürünler</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {(() => {
                      const filteredTopProducts = topSellingProducts.filter(
                        (p) => (p.salesCount || p.totalUnits || 0) > 0
                      );
                      if (filteredTopProducts.length === 0) return null;
                      const maxSales = Math.max(
                        ...filteredTopProducts.map(
                          (p) => p.salesCount || p.totalUnits
                        )
                      );

                      return filteredTopProducts.slice(0, 10).map((p, idx) => {
                        const sales = p.salesCount || p.totalUnits;
                        const ratio = (sales / maxSales) * 100;
                        return (
                          <div
                            key={p._id || idx}
                            className="flex items-center gap-4 overflow-hidden"
                          >
                            {/* Sıra Numarası */}
                            <span className="w-5 text-sm font-semibold text-muted-foreground">
                              {idx + 1}.
                            </span>

                            {/* Ürün Görseli */}
                            {p.image && (
                              <img
                                src={p.image}
                                alt={p.title}
                                className="h-12 w-12 rounded object-cover"
                              />
                            )}

                            {/* Başlık + Progress */}
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-medium">
                                {p.title}
                                <span className="ml-1 text-[10px] text-muted-foreground">
                                  ({p.productId || p._id})
                                </span>
                              </p>

                              {/* İlerleme Çubuğu */}
                              <div className="mt-1 h-2 w-full rounded bg-muted/40">
                                <div
                                  style={{ width: `${ratio}%` }}
                                  className="h-full rounded bg-primary"
                                />
                              </div>
                            </div>

                            {/* Satış Sayısı */}
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="text-sm font-semibold">
                                {sales} adet
                              </span>
                              {p.salePrice && (
                                <span className="text-xs text-muted-foreground">
                                  ₺{p.salePrice}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Low Stock Products */}
              {lowStockProducts && lowStockProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Düşük Stok Ürünleri</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lowStockProducts.map((p, idx) => (
                      <div
                        key={p._id}
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
                            <p className="truncate text-sm font-medium">
                              {p.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Stok: {p.totalStock} adet
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            p.totalStock <= 5
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {p.totalStock <= 5 ? "Kritik" : "Düşük"}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StatsTables;
