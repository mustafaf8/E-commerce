import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import PaymentFailurePage from "./pages/shopping-view/PaymentFailurePage";
import ShoppingWishlist from "./pages/shopping-view/wishlist";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AboutUs from "./components/shopping-view/about-us";
import BottomNavBar from "./components/common/BottomNavBar";
import Partners from "./pages/shopping-view/Partners"; // Yeni
import KVKK from "./pages/shopping-view/KVKK"; // Yeni
import InfoSecurityPolicy from "./pages/shopping-view/InfoSecurityPolicy";
import TransactionGuide from "./pages/shopping-view/TransactionGuide";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-full h-screen bg-gray-200" />; // Daha genel bir skeleton

  // console.log("Auth Loading:", isLoading, "User:", user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Kök dizin yönlendirmesi: Kullanıcıyı durumuna göre yönlendirir */}
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />

        {/* Auth Rotaları: Giriş yapmışsa /shop/home'a yönlendirir */}
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

        {/* === YENİ ADMİN ROTALARI KORUMASI === */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Artık bu alt rotalar otomatik olarak korunuyor */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        {/* === ADMİN KORUMASI SONU === */}

        {/* Mağaza Rotaları */}
        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<SearchProducts />} />
          {/* --- FOOTER SAYFALARI --- */}
          <Route path="hakkimizda" element={<AboutUs />} />
          <Route path="ortaklarimiz" element={<Partners />} /> {/* Yeni */}
          <Route path="kvkk" element={<KVKK />} /> {/* Yeni */}
          <Route path="bilgi-guvenligi" element={<InfoSecurityPolicy />} />
          <Route path="islem-rehberi" element={<TransactionGuide />} />
          {/* === GİRİŞ GEREKTİREN Mağaza Rotaları === */}
          <Route
            path="payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment-failure"
            element={
              <ProtectedRoute>
                <PaymentFailurePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              // Sadece giriş yapmış olmayı gerektirir (adminOnly varsayılan false)
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
          {/* === GİRİŞ GEREKTİREN ROTALAR SONU === */}
        </Route>

        {/* Yetkisiz Erişim Sayfası */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        {/* Bulunamayan Sayfalar */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="bottom-nav-container">
        <BottomNavBar />
      </div>
    </div>
  );
}

export default App;
