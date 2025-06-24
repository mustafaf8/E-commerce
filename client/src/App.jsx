import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Bileşenleri ve yardımcıları import et
import { Skeleton } from "@/components/ui/skeleton";
import { checkAuth } from "./store/auth-slice";
import {
  fetchCartItems,
  syncLocalCartToBackend,
} from "./store/shop/cart-slice";
import { getGuestCart } from "./lib/guestCartUtils";
import { fetchMaintenanceStatus } from "./store/common-slice/maintenance-slice";

// Layout ve korumalı rota gibi her zaman gerekli olabilecek bileşenleri statik olarak import et
import AuthLayout from "./components/auth/layout";
import AdminLayout from "./components/admin-view/layout";
import ShoppingLayout from "./components/shopping-view/layout";
import CheckAuth from "./components/common/check-auth";
import ProtectedRoute from "./components/common/ProtectedRoute";
import CookieConsentBanner from "./components/common/CookieConsentBanner";
import BottomNavBar from "./components/common/BottomNavBar";
import MaintenancePage from "./pages/MaintenancePage";
import PaymentFailurePage from "./pages/shopping-view/PaymentFailurePage";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingHome from "./pages/shopping-view/home";

// --- PERFORMANS OPTIMIZASYONU: Sayfa bileşenlerini React.lazy ile tembel yükleme ---
const AuthLogin = lazy(() => import("./pages/auth/login"));
const AuthRegister = lazy(() => import("./pages/auth/register"));
const AdminDashboard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const AdminCategories = lazy(() => import("./pages/admin-view/categories"));
const AdminHomeSections = lazy(() =>
  import("./pages/admin-view/home-sections")
);
const AdminBrands = lazy(() => import("./pages/admin-view/brands"));
const AdminStatsPage = lazy(() => import("./pages/admin-view/AdminStatsPage"));

const NotFound = lazy(() => import("./pages/not-found"));
const ShoppingListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const UnauthPage = lazy(() => import("./pages/unauth-page"));
const SearchProducts = lazy(() => import("./pages/shopping-view/search"));

const ShoppingWishlist = lazy(() => import("./pages/shopping-view/wishlist"));
const AboutUs = lazy(() => import("./components/shopping-view/about-us"));
const Partners = lazy(() => import("./pages/shopping-view/Partners"));
const KVKK = lazy(() => import("./pages/shopping-view/KVKK"));
const InfoSecurityPolicy = lazy(() =>
  import("./pages/shopping-view/InfoSecurityPolicy")
);
const TransactionGuide = lazy(() =>
  import("./pages/shopping-view/TransactionGuide")
);
const GuestCheckoutAddress = lazy(() =>
  import("./pages/shopping-view/GuestCheckoutAddress")
);

function App() {
  const {
    user,
    isAuthenticated,
    isLoading: authIsLoading,
  } = useSelector((state) => state.auth);

  const { status: maintenanceStatus, isLoading: maintenanceLoading } =
    useSelector((state) => state.maintenance);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchMaintenanceStatus());
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!authIsLoading) {
      if (isAuthenticated && user?.id) {
        const localCart = getGuestCart();
        if (localCart && localCart.items && localCart.items.length > 0) {
          dispatch(syncLocalCartToBackend());
        } else {
          dispatch(fetchCartItems(user.id));
        }
      } else {
        dispatch(fetchCartItems());
      }
    }
  }, [dispatch, user?.id, isAuthenticated, authIsLoading]);

  // Auth veya bakım durumu kontrol edilirken yüklenme ekranı göster
  // hesapla/client/src/App.jsx
  if (authIsLoading || maintenanceLoading || !maintenanceStatus) {
    return <Skeleton className="w-full h-screen bg-gray-200" />;
  }

  const isAdminPage = location.pathname.startsWith("/admin");
  // Bakım modu aktifse ve admin sayfasında değilse, bakım sayfasını göster
  if (maintenanceStatus.isActive && !isAdminPage) {
    return <MaintenancePage status={maintenanceStatus} />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* --- PERFORMANS OPTIMIZASYONU: Rotaları Suspense ile sarmalama --- */}
      {/* lazy ile yüklenen bileşenler için bir "yükleniyor" durumu (fallback) sağlar */}
      <Suspense fallback={<Skeleton className="w-full h-screen bg-gray-200" />}>
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
              ></CheckAuth>
            }
          />
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="home-sections" element={<AdminHomeSections />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="stats" element={<AdminStatsPage />} />
          </Route>

          <Route path="/shop" element={<ShoppingLayout />}>
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="hakkimizda" element={<AboutUs />} />
            <Route path="ortaklarimiz" element={<Partners />} />
            <Route path="kvkk" element={<KVKK />} />
            <Route path="bilgi-guvenligi" element={<InfoSecurityPolicy />} />
            <Route path="islem-rehberi" element={<TransactionGuide />} />
            <Route
              path="guest-checkout-address"
              element={<GuestCheckoutAddress />}
            />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="payment-failure" element={<PaymentFailurePage />} />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <ShoppingCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <ShoppingAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="wishlist"
              element={
                <ProtectedRoute>
                  <ShoppingWishlist />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!isAdminPage && <CookieConsentBanner />}
      {!isAdminPage && (
        <div className="bottom-nav-container lg:hidden">
          <BottomNavBar />
        </div>
      )}
    </div>
  );
}

export default App;
