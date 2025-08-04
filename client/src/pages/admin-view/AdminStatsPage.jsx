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
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import useAdminPermission from "@/hooks/useAdminPermission";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import axios from "axios";
import { saveAs } from "file-saver";


function AdminStatsPage() {
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("monthly");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showPicker, setShowPicker] = useState(false);
  const [dataType, setDataType] = useState("orders");

  const canView = useAdminPermission('stats');
  const canManage = useAdminPermission('stats', 'manage');

  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

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
    isLoading,
    error,
  } = useSelector((state) => state.adminStats);

  // Test için manuel veri (eğer profitOverview boşsa)
  const testProfitOverview = profitOverview || {
    totalRevenue: 15000,
    totalCost: 8000,
    netProfit: 7000
  };

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
  }, [dispatch, productList]);

  useEffect(() => {
    if (!canView) return;

    const options = dateRange.from && dateRange.to ? { dateRange: { startDate: dateRange.from.toISOString(), endDate: dateRange.to.toISOString() } } : { period };

    dispatch(fetchSalesOverview(options));
    dispatch(fetchSalesTrend(options));
    dispatch(fetchOrderStatusDistribution());
    dispatch(fetchTopSellingProducts({ limit: 10 }));
    dispatch(fetchSalesByCategory());
    dispatch(fetchSalesByBrand());
    dispatch(fetchUserSummary(options));
    dispatch(fetchUserRegistrationsTrend(options));
    dispatch(fetchTopCustomers());
    dispatch(fetchTopLikedProducts());
    dispatch(fetchProductSummary());
    dispatch(fetchProfitOverview(options));
    dispatch(fetchProfitByProduct());
    dispatch(fetchProfitByCategory());
    dispatch(fetchProfitByBrand());
  }, [dispatch, period, dateRange, canView]);


  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-semibold">İstatistikler</h1>

          {/* Tarih Aralığı Picker */}
          <div className="relative">
            <button
              onClick={() => setShowPicker((p) => !p)}
              className="border rounded-md px-3 py-1.5 text-sm bg-white"
            >
              {dateRange.from && dateRange.to
                ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                : "Tarih Aralığı Seç"}
            </button>
            {showPicker && (
              <div className="absolute z-50 mt-2 bg-white border shadow-lg">
                <DayPicker
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                  }}
                />
                <div className="flex justify-end p-2 border-t">
                  <button
                    className="text-sm text-primary px-3 py-1"
                    onClick={() => setShowPicker(false)}
                  >
                    Kapat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Ya tarih yoksa periyod seçici */}
          {!dateRange.from && (
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
          )}
        </div>

        {/* Rapor İndir */}
        <div className="flex items-center gap-2">
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="orders">Siparişler</option>
            <option value="products">Ürünler</option>
          </select>
          <button
            onClick={async () => {
              try {
                const body = {
                  dataType,
                  startDate: dateRange.from ? dateRange.from.toISOString() : null,
                  endDate: dateRange.to ? dateRange.to.toISOString() : null,
                };

                const response = await axios.post(
                  "/api/admin/stats/export",
                  body,
                  {
                    responseType: "blob",
                    withCredentials: true,
                  }
                );

                const blob = new Blob([response.data], {
                  type: "text/csv;charset=utf-8;",
                });
                saveAs(blob, `${dataType}-report.csv`);
              } catch (err) {
                console.error("CSV indirme hatası", err);
              }
            }}
            className="bg-primary text-white rounded-md px-4 py-2 text-sm"
          >
            Raporu İndir
          </button>
        </div>
      </div>

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
      {(Object.keys(orderStatusDistribution || {}).length > 0 ||
        profitOverview) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Order Status Pie */}
          {orderStatusDistribution &&
            Object.keys(orderStatusDistribution).length > 0 && (
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
                          const pieData = Object.entries(
                            orderStatusDistribution
                          ).map(([key, val]) => ({
                            key,
                            name: STATUS_INFO[key]?.label || key,
                            value: val,
                            fill: STATUS_INFO[key]?.color || "#D1D5DB",
                          }));
                          return (
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={60}
                              outerRadius={100}
                              label
                            >
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
          <Card>
            <CardHeader>
              <CardTitle>Kar Dağılımı</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const profitData = profitOverview || testProfitOverview;
                
                if (!profitData) {
                  return (
                    <div className="text-center text-muted-foreground">
                      Kar verisi yükleniyor...
                    </div>
                  );
                }
                
                const revenue = profitData.totalRevenue || 0;
                const cost = profitData.totalCost || 0;
                const profit = profitData.netProfit || 0;
                
                // Create pie data with absolute values for better visualization
                const pieData = [
                  {
                    name: "Gelir",
                    value: Math.abs(revenue),
                    fill: "#4ade80",
                    originalValue: revenue
                  },
                  {
                    name: "Maliyet", 
                    value: Math.abs(cost),
                    fill: "#f87171",
                    originalValue: cost
                  },
                  {
                    name: "Net Kar",
                    value: Math.abs(profit),
                    fill: profit >= 0 ? "#60a5fa" : "#ef4444",
                    originalValue: profit
                  },
                ];
                
                // Check if we have any non-zero data
                const hasData = pieData.some(item => item.value > 0);
                
                if (!hasData) {
                  return (
                    <div className="text-center text-muted-foreground">
                      <p>Kar verisi bulunamadı</p>
                      <p className="text-xs mt-2">
                        Gelir: ₺{revenue.toFixed(2)} | 
                        Maliyet: ₺{cost.toFixed(2)} | 
                        Net Kar: ₺{profit.toFixed(2)}
                      </p>
                    </div>
                  );
                }
                
                return (
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (!active || !payload || payload.length === 0) return null;
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-lg border bg-white p-3 shadow-lg">
                                <p className="font-semibold text-sm">{data.name}</p>
                                <p className="text-sm">
                                  ₺{data.originalValue.toFixed(2)}
                                </p>
                              </div>
                            );
                          }}
                        />
                        <Legend />
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={100}
                          label={({ name, originalValue }) => 
                            `${name}: ₺${originalValue.toFixed(2)}`
                          }
                        >
                          {pieData.map((entry, idx) => (
                            <Cell
                              key={`cell-profit-${idx}`}
                              fill={entry.fill}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Summary below chart */}
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      <p>
                        Toplam Gelir: ₺{revenue.toFixed(2)} | 
                        Toplam Maliyet: ₺{cost.toFixed(2)} | 
                        Net Kar: ₺{profit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
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
                <LineChart
                  data={userRegistrationsTrend}
                  margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="registrations"
                    stroke="#FF8042"
                    name="Yeni Kullanıcı"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category & Brand Sales grid */}
      {(salesByCategory?.length > 0 || salesByBrand?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Category Sales - Modern Area Chart */}
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
                    <AreaChart
                      data={salesByCategory.slice(0, 8)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="categoryGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="_id" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload || payload.length === 0) return null;
                          return (
                            <div className="rounded-lg border bg-white p-3 shadow-lg">
                              <p className="font-semibold text-sm">{label}</p>
                              <p className="text-sm text-blue-600">
                                Gelir: ₺{payload[0].value.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Satış: {salesByCategory.find(item => item._id === label)?.totalUnits || 0} adet
                              </p>
                            </div>
                          );
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalRevenue"
                        stroke="#8884d8"
                        strokeWidth={2}
                        fill="url(#categoryGradient)"
                        name="Gelir"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}

          {/* Brand Sales - Area Chart (same as Category) */}
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
                    <AreaChart
                      data={salesByBrand.slice(0, 8)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="_id" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload || payload.length === 0) return null;
                          return (
                            <div className="rounded-lg border bg-white p-3 shadow-lg">
                              <p className="font-semibold text-sm">{label}</p>
                              <p className="text-sm text-green-600">
                                Gelir: ₺{payload[0].value.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Satış: {salesByBrand.find(item => item._id === label)?.totalUnits || 0} adet
                              </p>
                            </div>
                          );
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="totalRevenue"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        fill="url(#brandGradient)"
                        name="Gelir"
                      />
                    </AreaChart>
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
