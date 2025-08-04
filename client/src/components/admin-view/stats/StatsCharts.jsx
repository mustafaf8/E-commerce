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

const StatsCharts = ({ 
  salesTrend, 
  orderStatusDistribution, 
  profitOverview, 
  salesByCategory, 
  salesByBrand, 
  userRegistrationsTrend,
  isLoading 
}) => {
  return (
    <>
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
                const profitData = profitOverview;
                
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
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={100}
                        label={({ name, originalValue }) => `${name}: ₺${originalValue.toFixed(0)}`}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      


      {/* Category & Brand Sales - Bar Charts */}
      {(salesByCategory?.length > 0 || salesByBrand?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Category Sales - Bar Chart */}
          {salesByCategory && salesByCategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Kategori Bazlı Satışlar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
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
                      fill="#8884d8"
                      name="Gelir"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Brand Sales - Bar Chart */}
          {salesByBrand && salesByBrand.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Marka Bazlı Satışlar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByBrand}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="brand" 
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
                      fill="#82ca9d"
                      name="Gelir"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Kullanıcı Kayıt Trendi */}
      {userRegistrationsTrend && userRegistrationsTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kullanıcı Kayıt Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userRegistrationsTrend}>
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
                  stroke="#8884d8"
                  name="Yeni Kullanıcılar"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default StatsCharts;