import { useEffect } from "react";
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

export const useStatsData = (period, dateRange, canView) => {
  const dispatch = useDispatch();

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

  const { productList } = useSelector((state) => state.adminProducts);

  // Low stock products (< 10)
  // Low stock products (daha geniş kapsam)
const lowStockProducts = productList
? productList
    .filter((p) => p.totalStock <= 9) 
    .sort((a, b) => a.totalStock - b.totalStock) // En düşük stoktan başla
    .slice(0, 10) // İlk 10 ürünü göster
: [];



  // Test için manuel veri (eğer profitOverview boşsa)
  const testProfitOverview = profitOverview || {
    totalRevenue: 15000,
    totalCost: 8000,
    netProfit: 7000
  };

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

  return {
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
    profitOverview: testProfitOverview,
    isLoading,
    error,
    lowStockProducts,
  };
};



