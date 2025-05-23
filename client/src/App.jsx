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
import AdminCategories from "./pages/admin-view/categories"; // Yeni import
import AdminHomeSections from "./pages/admin-view/home-sections";
import AdminBrands from "./pages/admin-view/brands";
import {
  fetchCartItems,
  syncLocalCartToBackend,
} from "./store/shop/cart-slice"; // syncLocalCartToBackend ve clearCartState eklendi
import { getGuestCart } from "./lib/guestCartUtils";
import GuestCheckoutAddress from "./pages/shopping-view/GuestCheckoutAddress";
import AdminStatsPage from "./pages/admin-view/AdminStatsPage";

function App() {
  const {
    user,
    isAuthenticated,
    isLoading: authIsLoading,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
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

  if (authIsLoading)
    return <Skeleton className="w-full h-screen bg-gray-200" />;
  const isAdminPage = location.pathname.startsWith("/admin");

  // console.log("Auth Loading:", isLoading, "User:", user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
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
      {!isAdminPage && (
        <div className="bottom-nav-container lg:hidden">
          <BottomNavBar />
        </div>
      )}
    </div>
  );
}

export default App;
