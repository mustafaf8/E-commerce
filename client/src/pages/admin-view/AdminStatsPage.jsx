import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useAdminPermission from "@/hooks/useAdminPermission";
import { useStatsData } from "@/components/admin-view/stats/useStatsData";
import StatsHeader from "@/components/admin-view/stats/StatsHeader";
import StatsOverview from "@/components/admin-view/stats/StatsOverview";
import StatsCharts from "@/components/admin-view/stats/StatsCharts";
import StatsTables from "@/components/admin-view/stats/StatsTables";

function AdminStatsPage() {
  const [period, setPeriod] = useState("monthly");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showPicker, setShowPicker] = useState(false);
  const [dataType, setDataType] = useState("orders");

  const canView = useAdminPermission('stats');
  const canManage = useAdminPermission('stats', 'manage');

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
    lowStockProducts,
  } = useStatsData(period, dateRange, canView);

  if (!canView) {
    return (
      <div className="p-4 text-center bg-red-50 text-red-700 rounded-md">
        Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  if (isLoading && !salesOverview) {
    return <Skeleton className="w-full h-screen bg-gray-100" />;
  }

  if (error) {
    return <div className="p-6 text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="p-4 space-y-8">
      <StatsHeader
        period={period}
        setPeriod={setPeriod}
        dateRange={dateRange}
        setDateRange={setDateRange}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        dataType={dataType}
        setDataType={setDataType}
      />

      <StatsOverview salesOverview={salesOverview} />

      <StatsCharts
        salesTrend={salesTrend}
        orderStatusDistribution={orderStatusDistribution}
        profitOverview={profitOverview}
        salesByCategory={salesByCategory}
        salesByBrand={salesByBrand}
        userRegistrationsTrend={userRegistrationsTrend}
        isLoading={isLoading}
      />

      <StatsTables
        topCustomers={topCustomers}
        topSellingProducts={topSellingProducts}
        lowStockProducts={lowStockProducts}
      />
    </div>
  );
}

export default AdminStatsPage;
