import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSalesOverview,
  fetchOrderStatusDistribution,
  fetchTopSellingProducts,
  fetchSalesByCategory,
  fetchSalesByBrand,
  fetchUserSummary,
  fetchTopCustomers,
  fetchProductSummary,
  fetchSalesTrend,
  fetchUserRegistrationsTrend,
  fetchTopLikedProducts,
  fetchProfitOverview,
  fetchProfitByProduct,
  fetchProfitByCategory,
  fetchProfitByBrand,
} from "@/store/admin/statsSlice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

function AdminStatsPage() {
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("monthly");

  const {
    salesOverview,
    orderStatusDistribution,
    topSellingProducts,
    salesByCategory,
    salesByBrand,
    userSummary,
    topCustomers,
    topLikedProducts,
    salesTrend,
    userRegistrationsTrend,
    profitOverview,
    profitByProduct,
    profitByCategory,
    profitByBrand,
    isLoading,
    error,
  } = useSelector((state) => state.adminStats);

  const { productList } = useSelector((state) => state.adminProducts);

  // Low stock products (< 10)
  const lowStockProducts = productList
    ? productList.filter((p) => p.totalStock <= 10).slice(0, 5)
    : [];

  useEffect(() => {
    // fetch products for low stock list if not already loaded
    if (!productList || productList.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, productList?.length]);

  useEffect(() => {
    // Fetch stats whenever period changes
    dispatch(fetchSalesOverview(period));
    dispatch(fetchSalesTrend(period));
    dispatch(fetchOrderStatusDistribution());
    dispatch(fetchTopSellingProducts({ limit: 10 }));
    dispatch(fetchSalesByCategory());
    dispatch(fetchSalesByBrand());
    dispatch(fetchUserSummary(period));
    dispatch(fetchUserRegistrationsTrend(period));
    dispatch(fetchTopCustomers());
    dispatch(fetchTopLikedProducts());
    dispatch(fetchProductSummary());
    dispatch(fetchProfitOverview(period));
    dispatch(fetchProfitByProduct());
    dispatch(fetchProfitByCategory());
    dispatch(fetchProfitByBrand());
  }, [dispatch, period]);

  // Durum -> {label, color} tam eşleşme tablosu (sabit renk için)
  const STATUS_INFO = {
    inShipping: {
      label: "Kargoda",
      color: "#0088FE",
    },
    inProcess: {
      label: "Hazırlanıyor",
      color: "#00C49F",
    },
    delivered: {
      label: "Teslim Edildi",
      color: "#FFBB28",
    },
    cancelled: {
      label: "İptal",
      color: "#FF8042",
    },
    rejected: {
      label: "Reddedildi",
      color: "#A28CF6",
    },
    failed: {
      label: "Başarısız",
      color: "#FF6699",
    },
    pending_payment: {
      label: "Ödeme Bekliyor",
      color: "#9CA3AF",
    },
    pending: {
      label: "Beklemede",
      color: "#6366F1",
    },
    confirmed: {
      label: "Onaylandı",
      color: "#34D399",
    },
    shipped: {
      label: "Kargolandı",
      color: "#3B82F6",
    },
    refunded: {
      label: "İade",
      color: "#F43F5E",
    },
  };

  if (isLoading && !salesOverview) {
    return <Skeleton className="w-full h-screen bg-gray-100" />;
  }

  if (error) {
    return <div className="p-6 text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="p-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold">İstatistikler</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded-md p-2 text-sm"
        >
          <option value="all">Tüm Zamanlar</option>
          <option value="daily">Son 24 Saat</option>
          <option value="weekly">Son 7 Gün</option>
          <option value="monthly">Son 30 Gün</option>
        </select>
      </div>

      {/* KPI Cards */}
      {salesOverview && userSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-primary text-white">
            <CardHeader>
              <CardTitle>Toplam Gelir</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ₺{salesOverview.totalRevenue?.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-secondary text-gray-900 dark:text-white">
            <CardHeader>
              <CardTitle>Toplam Sipariş</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{salesOverview.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Yeni Kullanıcılar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userSummary.newUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ort. Sepet Tutarı</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ₺{salesOverview.averageOrderValue?.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Trend Chart */}
      {salesTrend && salesTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Satış Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[360px] w-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={salesTrend}
                  margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload || payload.length === 0)
                        return null;
                      const revenueItem = payload.find(
                        (pl) => pl.dataKey === "totalRevenue"
                      );
                      const ordersItem = payload.find(
                        (pl) => pl.dataKey === "totalOrders"
                      );
                      return (
                        <div className="rounded-md border bg-white p-2 shadow-sm text-xs">
                          <p className="font-medium max-w-[160px] truncate">
                            {label}
                          </p>
                          {ordersItem && (
                            <p>Sipariş: {ordersItem.value} adet</p>
                          )}
                          {revenueItem && (
                            <p>Gelir: ₺{revenueItem.value.toFixed(0)}</p>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#8884d8"
                    name="Gelir"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalOrders"
                    stroke="#82ca9d"
                    name="Sipariş"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Order Status & Profit Overview grid */}
      {(Object.keys(orderStatusDistribution || {}).length > 0 || profitOverview) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Order Status Pie */}
          {orderStatusDistribution && Object.keys(orderStatusDistribution).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Durumu Dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[360px] w-full rounded-md" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      {(() => {
                        const pieData = Object.entries(orderStatusDistribution).map(([key, val]) => ({
                          key,
                          name: STATUS_INFO[key]?.label || key,
                          value: val,
                          fill: STATUS_INFO[key]?.color || "#D1D5DB",
                        }));
                        return (
                          <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} label>
                            {pieData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        );
                      })()}
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}

          {/* Profit Pie Chart */}
          {profitOverview && (() => {
            const total = (profitOverview.totalRevenue || 0) + (profitOverview.totalCost || 0);
            if (total === 0) return null;
            const pieData = [
              { name: "Gelir", value: profitOverview.totalRevenue || 0, fill: "#4ade80" },
              { name: "Maliyet", value: profitOverview.totalCost || 0, fill: "#f87171" },
              { name: "Net Kar", value: profitOverview.netProfit || 0, fill: "#60a5fa" },
            ];
            return (
              <Card>
                <CardHeader>
                  <CardTitle>Kar Dağılımı</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} label>
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-profit-${idx}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      )}

      {/* User Registration Trend moved here */}
      {userRegistrationsTrend && userRegistrationsTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Kayıt Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[360px] w-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userRegistrationsTrend} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="registrations" stroke="#FF8042" name="Yeni Kullanıcı" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category & Brand Sales grid */}
      {(salesByCategory?.length > 0 || salesByBrand?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Category Sales */}
          {salesByCategory && salesByCategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Kategori Bazlı Satışlar</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[360px] w-full rounded-md" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={salesByCategory}
                      layout="vertical"
                      margin={{ left: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="totalRevenue" />
                      <YAxis type="category" dataKey="_id" width={150} />
                      <Tooltip />
                      <Bar dataKey="totalRevenue" fill="#8884d8" name="Gelir" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}

          {/* Brand Sales */}
          {salesByBrand && salesByBrand.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Marka Bazlı Satışlar</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[360px] w-full rounded-md" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={salesByBrand}
                      layout="vertical"
                      margin={{ left: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="totalRevenue" />
                      <YAxis type="category" dataKey="_id" width={150} />
                      <Tooltip />
                      <Bar dataKey="totalRevenue" fill="#82ca9d" name="Gelir" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Top Customers & Top Liked Products */}
      {(topCustomers?.length > 0 || topLikedProducts?.length > 0) && (
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
                    {/*
                    Max değer – ilerleme barının oranını hesaplamamız için gerekir.
                    "salesCount" yoksa backend'de gönderdiğiniz "totalUnits" alanını kullanın.
                  */}
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
                        const ratio = (sales / maxSales) * 100; // % genişlik
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

                            {/* Satış Adedi */}
                            <span className="ml-2 shrink-0 text-sm font-semibold">
                              {sales}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Top Liked Products */}
          {topLikedProducts && topLikedProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>En Çok Beğenilen Ürünler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const maxLike = Math.max(
                    ...topLikedProducts.map((p) => p.likeCount)
                  );
                  return topLikedProducts.map((p, idx) => {
                    const ratio = (p.likeCount / maxLike) * 100;
                    return (
                      <div
                        key={p.productId || idx}
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
                              ({p.productId || p._id})
                            </span>
                          </p>
                          <div className="mt-1 h-2 w-full rounded bg-muted/40">
                            <div
                              style={{ width: `${ratio}%` }}
                              className="h-full rounded bg-pink-500"
                            />
                          </div>
                        </div>
                        <span className="ml-2 shrink-0 text-sm font-semibold">
                          {p.likeCount}
                        </span>
                      </div>
                    );
                  });
                })()}
              </CardContent>
            </Card>
          )}

          {/* Low Stock Warning */}
          {lowStockProducts && lowStockProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Stok Uyarısı</CardTitle>
                <span className="text-sm text-muted-foreground">
                  (≤ 10 adet kalan ürünler)
                </span>
              </CardHeader>

              <CardContent className="space-y-4">
                {lowStockProducts.map((p) => {
                  const percent = (p.totalStock / 10) * 100; // 0-100
                  return (
                    <div key={p._id}>
                      {/* Ürün Başlığı + Miktar */}
                      <div className="flex justify-between font-medium mb-1">
                        <span className="truncate max-w-[200px]">
                          {p.title}
                          <span className="ml-1 text-[10px] text-muted-foreground">
                            ({p._id})
                          </span>
                        </span>
                        <span
                          className={`font-semibold ${
                            p.totalStock <= 3
                              ? "text-red-600"
                              : "text-amber-500"
                          }`}
                        >
                          {p.totalStock} adet
                        </span>
                      </div>

                      {/* Doluluk Barı */}
                      <div className="h-2 w-full rounded-md bg-muted/40">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-md ${
                            percent < 30 ? "bg-red-500" : "bg-amber-400"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminStatsPage;
