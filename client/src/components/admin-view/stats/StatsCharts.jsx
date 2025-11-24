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
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { STATUS_INFO } from "./StatsHeader";

const Overlay = ({ message }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-background/75 backdrop-blur-sm text-center px-4">
    <p className="text-sm font-medium text-muted-foreground">{message}</p>
  </div>
);

const isArrayEmpty = (arr) => !arr || arr.length === 0;
const isObjectEmpty = (obj) =>
  !obj || Object.values(obj).every((val) => !val || Number(val) === 0);

const mockSalesTrend = [
  { _id: "Pzt", totalRevenue: 3200, totalOrders: 12 },
  { _id: "Sal", totalRevenue: 2800, totalOrders: 10 },
  { _id: "Çar", totalRevenue: 3600, totalOrders: 15 },
  { _id: "Per", totalRevenue: 3000, totalOrders: 11 },
  { _id: "Cum", totalRevenue: 4200, totalOrders: 17 },
  { _id: "Cmt", totalRevenue: 3800, totalOrders: 14 },
  { _id: "Paz", totalRevenue: 2500, totalOrders: 9 },
];

const mockPieData = [
  { key: "placeholder1", name: "Bekleniyor", value: 3, fill: "#d4d4d8" },
  { key: "placeholder2", name: "Hazırlanıyor", value: 2, fill: "#c4c4cc" },
  { key: "placeholder3", name: "Tamamlandı", value: 4, fill: "#a1a1aa" },
];

const mockBarData = [
  { label: "Kategori A", totalRevenue: 3500 },
  { label: "Kategori B", totalRevenue: 2200 },
  { label: "Kategori C", totalRevenue: 4100 },
  { label: "Kategori D", totalRevenue: 1800 },
];

const StatsCharts = ({
  salesTrend,
  orderStatusDistribution,
  profitOverview,
  salesByCategory,
  salesByBrand,
  userRegistrationsTrend,
  isLoading,
}) => {
  const salesTrendEmpty = isArrayEmpty(salesTrend);
  const orderDistributionEmpty = isObjectEmpty(orderStatusDistribution);
  const categoryEmpty = isArrayEmpty(salesByCategory);
  const brandEmpty = isArrayEmpty(salesByBrand);
  const userTrendEmpty = isArrayEmpty(userRegistrationsTrend);

  const profitEmpty =
    !profitOverview ||
    (profitOverview.totalRevenue === 0 &&
      profitOverview.totalCost === 0 &&
      profitOverview.netProfit === 0);

  const placeholderMessage =
    "Henüz veri bulunmuyor. Satışlar başladığında grafikler burada canlanacak.";

  return (
    <>
      <Card className="relative">
        <CardHeader>
          <CardTitle>Satış Trendi</CardTitle>
        </CardHeader>
        <CardContent className={salesTrendEmpty ? "opacity-50 grayscale" : ""}>
          {isLoading ? (
            <Skeleton className="h-[360px] w-full rounded-md" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={salesTrendEmpty ? mockSalesTrend : salesTrend}
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
                        {ordersItem && <p>Sipariş: {ordersItem.value} adet</p>}
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
                  stroke={salesTrendEmpty ? "#a1a1aa" : "#8884d8"}
                  name="Gelir"
                />
                <Line
                  type="monotone"
                  dataKey="totalOrders"
                  stroke={salesTrendEmpty ? "#c4c4cc" : "#82ca9d"}
                  name="Sipariş"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
        {salesTrendEmpty && !isLoading && (
          <Overlay message={placeholderMessage} />
        )}
      </Card>
      {/* Order Status & Profit Overview grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Order Status Pie */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>Sipariş Durumu Dağılımı</CardTitle>
          </CardHeader>
          <CardContent
            className={orderDistributionEmpty ? "opacity-50 grayscale" : ""}
          >
            {isLoading ? (
              <Skeleton className="h-[360px] w-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={
                      orderDistributionEmpty
                        ? mockPieData
                        : Object.entries(orderStatusDistribution || {}).map(
                            ([key, val]) => ({
                              key,
                              name: STATUS_INFO[key]?.label || key,
                              value: val,
                              fill: STATUS_INFO[key]?.color || "#D1D5DB",
                            })
                          )
                    }
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    label
                  >
                    {(orderDistributionEmpty
                      ? mockPieData
                      : Object.entries(orderStatusDistribution || {}).map(
                          ([key]) => ({
                            fill: STATUS_INFO[key]?.color || "#D1D5DB",
                          })
                        )
                    ).map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={
                          orderDistributionEmpty
                            ? entry.fill
                            : entry.fill || "#D1D5DB"
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          {orderDistributionEmpty && !isLoading && (
            <Overlay message={placeholderMessage} />
          )}
        </Card>

        {/* Profit Pie Chart */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>Kar Dağılımı</CardTitle>
          </CardHeader>
          <CardContent className={profitEmpty ? "opacity-50 grayscale" : ""}>
            {(() => {
              if (isLoading && !profitOverview) {
                return <Skeleton className="h-[360px] w-full rounded-md" />;
              }
              const profitData =
                profitEmpty && !isLoading
                  ? {
                      totalRevenue: 4500,
                      totalCost: 3000,
                      netProfit: 1500,
                    }
                  : profitOverview || {
                      totalRevenue: 0,
                      totalCost: 0,
                      netProfit: 0,
                    };

              const revenue = profitData.totalRevenue || 0;
              const cost = profitData.totalCost || 0;
              const profit = profitData.netProfit || 0;

              // Create pie data with absolute values for better visualization
              const pieData = [
                {
                  name: "Gelir",
                  value: Math.abs(revenue),
                  fill: "#4ade80",
                  originalValue: revenue,
                },
                {
                  name: "Maliyet",
                  value: Math.abs(cost),
                  fill: "#f87171",
                  originalValue: cost,
                },
                {
                  name: "Net Kar",
                  value: Math.abs(profit),
                  fill: profit >= 0 ? "#60a5fa" : "#ef4444",
                  originalValue: profit,
                },
              ];

              return (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-md border bg-white p-2 shadow-sm text-xs">
                              <p className="font-medium">{data.name}</p>
                              <p>₺{data.originalValue.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Pie
                      data={profitEmpty ? mockPieData : pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      label={({ name, originalValue }) =>
                        profitEmpty
                          ? `${name}`
                          : `${name}: ₺${originalValue.toFixed(0)}`
                      }
                    >
                      {(profitEmpty ? mockPieData : pieData).map(
                        (entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        )
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              );
            })()}
          </CardContent>
          {profitEmpty && !isLoading && (
            <Overlay message={placeholderMessage} />
          )}
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="relative">
          <CardHeader>
            <CardTitle>Kategori Bazlı Satışlar</CardTitle>
          </CardHeader>
          <CardContent className={categoryEmpty ? "opacity-50 grayscale" : ""}>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryEmpty ? mockBarData : salesByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={categoryEmpty ? "label" : "category"}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || payload.length === 0)
                        return null;
                      const revenueItem = payload[0];
                      return (
                        <div className="rounded-md border bg-white p-2 shadow-sm text-xs">
                          <p className="font-medium">{label}</p>
                          <p>Gelir: ₺{revenueItem.value?.toFixed(0) || 0}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="totalRevenue"
                    fill={categoryEmpty ? "#d4d4d8" : "#8884d8"}
                    name="Gelir"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          {categoryEmpty && !isLoading && (
            <Overlay message={placeholderMessage} />
          )}
        </Card>

        <Card className="relative">
          <CardHeader>
            <CardTitle>Marka Bazlı Satışlar</CardTitle>
          </CardHeader>
          <CardContent className={brandEmpty ? "opacity-50 grayscale" : ""}>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={brandEmpty ? mockBarData : salesByBrand}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={brandEmpty ? "label" : "brand"}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || payload.length === 0)
                        return null;
                      const revenueItem = payload[0];
                      return (
                        <div className="rounded-md border bg-white p-2 shadow-sm text-xs">
                          <p className="font-medium">{label}</p>
                          <p>Gelir: ₺{revenueItem.value?.toFixed(0) || 0}</p>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="totalRevenue"
                    fill={brandEmpty ? "#c4c4cc" : "#82ca9d"}
                    name="Gelir"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          {brandEmpty && !isLoading && <Overlay message={placeholderMessage} />}
        </Card>
      </div>
      <Card className="relative">
        <CardHeader>
          <CardTitle>Kullanıcı Kayıt Trendi</CardTitle>
        </CardHeader>
        <CardContent className={userTrendEmpty ? "opacity-50 grayscale" : ""}>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full rounded-md" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={userTrendEmpty ? mockSalesTrend : userRegistrationsTrend}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0)
                      return null;
                    const registrationsItem = payload.find(
                      (pl) => pl.dataKey === "registrations"
                    );
                    return (
                      <div className="rounded-md border bg-white p-2 shadow-sm text-xs">
                        <p className="font-medium max-w-[160px] truncate">
                          {label}
                        </p>
                        {registrationsItem && (
                          <p>Yeni Kullanıcı: {registrationsItem.value} kişi</p>
                        )}
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke={userTrendEmpty ? "#a1a1aa" : "#8884d8"}
                  name="Yeni Kullanıcılar"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
        {userTrendEmpty && !isLoading && (
          <Overlay message={placeholderMessage} />
        )}
      </Card>
    </>
  );
};

export default StatsCharts;
