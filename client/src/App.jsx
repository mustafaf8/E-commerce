import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
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
const AdminCategoriesBrands = lazy(() => import("./pages/admin-view/categories-brands"));
const AdminHomeSections = lazy(() =>
  import("./pages/admin-view/home-sections")
);
const AdminStatsPage = lazy(() => import("./pages/admin-view/AdminStatsPage"));
const AdminAuthorization = lazy(() => import("./pages/admin-view/authorization"));
const AdminMaintenanceMode = lazy(() => import("./pages/admin-view/maintenance-mode"));

const NotFound = lazy(() => import("./pages/not-found"));
const ShoppingListing = lazy(() => import("./pages/shopping-view/listing"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const UnauthPage = lazy(() => import("./pages/unauth-page"));
const SearchProducts = lazy(() => import("./pages/shopping-view/search"));
const ContactPage = lazy(() => import("./pages/shopping-view/ContactPage"));

const ShoppingWishlist = lazy(() => import("./pages/shopping-view/wishlist"));
const AboutUs = lazy(() => import("./components/shopping-view/about-us"));
const KVKK = lazy(() => import("./pages/shopping-view/KVKK"));
const InfoSecurityPolicy = lazy(() =>
  import("./pages/shopping-view/InfoSecurityPolicy")
);
const TransactionGuide = lazy(() =>
  import("./pages/shopping-view/TransactionGuide")
);
const SSLCertificate = lazy(() =>
  import("./pages/shopping-view/SSLCertificate")
);
const DeliveryReturnTerms = lazy(() =>
  import("./pages/shopping-view/DeliveryReturnTerms")
);
const PrivacyPolicy = lazy(() =>
  import("./pages/shopping-view/PrivacyPolicy")
);
const DistanceSalesContract = lazy(() =>
  import("./pages/shopping-view/DistanceSalesContract")
);
const GuestCheckoutAddress = lazy(() =>
  import("./pages/shopping-view/GuestCheckoutAddress")
);
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ProductSpecsPage = lazy(() => import("./pages/shopping-view/ProductSpecsPage"));

function App() {
  const {
    user,
    isAuthenticated,
    isLoading: authIsLoading,
  } = useSelector(
    (state) =>
      state.auth || { isAuthenticated: false, isLoading: true, user: null }
  );

  const { status: maintenanceStatus, isLoading: maintenanceLoading } =
    useSelector(
      (state) =>
        state.maintenance || { status: { isActive: false }, isLoading: true }
    );

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
                isLoading={authIsLoading}
              ></CheckAuth>
            }
          />
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={authIsLoading}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="stats" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="categories-brands" element={<AdminCategoriesBrands />} />
            <Route path="home-sections" element={<AdminHomeSections />} />
            <Route path="stats" element={<AdminStatsPage />} />
            <Route
              path="authorization"
              element={
                <ProtectedRoute adminOnly={true} level1Only={true}>
                  <AdminAuthorization />
                </ProtectedRoute>
              }
            />
            <Route path="maintenance" element={<AdminMaintenanceMode />} />
          </Route>

          <Route path="/shop" element={<ShoppingLayout />}>
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="hakkimizda" element={<AboutUs />} />
            <Route path="iletisim" element={<ContactPage />} />
            <Route path="kvkk" element={<KVKK />} />
            <Route path="bilgi-guvenligi" element={<InfoSecurityPolicy />} />
            <Route path="islem-rehberi" element={<TransactionGuide />} />
            <Route path="ssl-sertifikasi" element={<SSLCertificate />} />
            <Route path="teslimat-iade" element={<DeliveryReturnTerms />} />
            <Route path="gizlilik-sozlesmesi" element={<PrivacyPolicy />} />
            <Route path="mesafeli-satis" element={<DistanceSalesContract />} />
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
              path="account/*" // account altındaki tüm rotaları kapsar
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
            {/* Bu yeni rota, diğerlerini etkilemeden eklendi */}
            <Route path="product/:id/specs" element={<ProductSpecsPage />} />
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
