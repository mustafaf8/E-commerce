// import { Route, Routes } from "react-router-dom";
// import AuthLayout from "./components/auth/layout";
// import AuthLogin from "./pages/auth/login";
// import AuthRegister from "./pages/auth/register";
// import AdminLayout from "./components/admin-view/layout";
// import AdminDashboard from "./pages/admin-view/dashboard";
// import AdminProducts from "./pages/admin-view/products";
// import AdminOrders from "./pages/admin-view/orders";
// import AdminFeatures from "./pages/admin-view/features";
// import ShoppingLayout from "./components/shopping-view/layout";
// import NotFound from "./pages/not-found";
// import ShoppingHome from "./pages/shopping-view/home";
// import ShoppingListing from "./pages/shopping-view/listing";
// import ShoppingCheckout from "./pages/shopping-view/checkout";
// import ShoppingAccount from "./pages/shopping-view/account";
// import CheckAuth from "./components/common/check-auth";
// import UnauthPage from "./pages/unauth-page";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { checkAuth } from "./store/auth-slice";
// import { Skeleton } from "@/components/ui/skeleton";
// import PaymentSuccessPage from "./pages/shopping-view/payment-success";
// import SearchProducts from "./pages/shopping-view/search";
// import PaymentFailurePage from "./pages/shopping-view/PaymentFailurePage";
// import ShoppingWishlist from "./pages/shopping-view/wishlist";

// function App() {
//   const { user, isAuthenticated, isLoading } = useSelector(
//     (state) => state.auth
//   );
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

//   console.log(isLoading, user);

//   return (
//     <div className="flex flex-col overflow-hidden bg-white">
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <CheckAuth
//               isAuthenticated={isAuthenticated}
//               user={user}
//             ></CheckAuth>
//           }
//         />
//         <Route
//           path="/auth"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AuthLayout />
//             </CheckAuth>
//           }
//         >
//           <Route path="login" element={<AuthLogin />} />
//           <Route path="register" element={<AuthRegister />} />
//         </Route>
//         <Route
//           path="/admin"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AdminLayout />
//             </CheckAuth>
//           }
//         >
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="products" element={<AdminProducts />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="features" element={<AdminFeatures />} />
//         </Route>
//         <Route
//           path="/shop"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <ShoppingLayout />
//             </CheckAuth>
//           }
//         >
//           <Route path="home" element={<ShoppingHome />} />
//           <Route path="listing" element={<ShoppingListing />} />
//           <Route path="checkout" element={<ShoppingCheckout />} />
//           <Route path="account" element={<ShoppingAccount />} />
//           <Route path="payment-success" element={<PaymentSuccessPage />} />
//           <Route path="payment-failure" element={<PaymentFailurePage />} />
//           <Route path="wishlist" element={<ShoppingWishlist />} />
//           <Route path="search" element={<SearchProducts />} />
//         </Route>
//         <Route path="/unauth-page" element={<UnauthPage />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

// import { Route, Routes } from "react-router-dom";
// import AuthLayout from "./components/auth/layout";
// import AuthLogin from "./pages/auth/login";
// import AuthRegister from "./pages/auth/register";
// import AdminLayout from "./components/admin-view/layout";
// import AdminDashboard from "./pages/admin-view/dashboard";
// import AdminProducts from "./pages/admin-view/products";
// import AdminOrders from "./pages/admin-view/orders";
// import AdminFeatures from "./pages/admin-view/features";
// import ShoppingLayout from "./components/shopping-view/layout";
// import NotFound from "./pages/not-found";
// import ShoppingHome from "./pages/shopping-view/home";
// import ShoppingListing from "./pages/shopping-view/listing";
// import ShoppingCheckout from "./pages/shopping-view/checkout";
// import ShoppingAccount from "./pages/shopping-view/account";
// import CheckAuth from "./components/common/check-auth";
// import UnauthPage from "./pages/unauth-page";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { checkAuth } from "./store/auth-slice";
// import { Skeleton } from "@/components/ui/skeleton";
// import PaymentSuccessPage from "./pages/shopping-view/payment-success";
// import SearchProducts from "./pages/shopping-view/search";
// import PaymentFailurePage from "./pages/shopping-view/PaymentFailurePage";
// import ShoppingWishlist from "./pages/shopping-view/wishlist";
// import ProtectedRoute from "./components/common/ProtectedRoute"; // Yeni bileşeni import et

// function App() {
//   const { user, isAuthenticated, isLoading } = useSelector(
//     (state) => state.auth
//   );
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

//   console.log(isLoading, user);

//   return (
//     <div className="flex flex-col overflow-hidden bg-white">
//       <Routes>
//         {/* Kök dizin yönlendirmesi CheckAuth içinde hallediliyor */}
//         <Route
//           path="/"
//           element={
//             <CheckAuth
//               isAuthenticated={isAuthenticated}
//               user={user}
//             ></CheckAuth>
//           }
//         />

//         {/* Auth Rotaları (CheckAuth ile korunuyor, giriş yapmışsa yönlendirir) */}
//         <Route
//           path="/auth"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AuthLayout />
//             </CheckAuth>
//           }
//         >
//           <Route path="login" element={<AuthLogin />} />
//           <Route path="register" element={<AuthRegister />} />
//         </Route>

//         {/* Admin Rotaları (CheckAuth ile korunuyor, rol kontrolü yapar) */}
//         <Route
//           path="/admin"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AdminLayout />
//             </CheckAuth>
//           }
//         >
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="products" element={<AdminProducts />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="features" element={<AdminFeatures />} />
//         </Route>

//         {/* Mağaza Rotaları */}
//         <Route
//           path="/shop"
//           // CheckAuth burada hala adminlerin /shop altına girmesini engellemek için kalabilir
//           // VEYA adminlerin de görmesini istiyorsak kaldırılabilir/değiştirilebilir.
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <ShoppingLayout />
//             </CheckAuth>
//           }
//         >
//           {/* Herkese Açık Mağaza Rotaları */}
//           <Route path="home" element={<ShoppingHome />} />
//           <Route path="listing" element={<ShoppingListing />} />
//           <Route path="search" element={<SearchProducts />} />
//           {/* Ödeme sonucu sayfaları genellikle token bazlıdır, direkt korumaya gerek olmayabilir */}
//           <Route path="payment-success" element={<PaymentSuccessPage />} />
//           <Route path="payment-failure" element={<PaymentFailurePage />} />

//           {/* GİRİŞ GEREKTİREN Mağaza Rotaları */}
//           <Route
//             path="checkout"
//             element={
//               <ProtectedRoute>
//                 <ShoppingCheckout />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="account"
//             element={
//               <ProtectedRoute>
//                 <ShoppingAccount />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="wishlist"
//             element={
//               <ProtectedRoute>
//                 <ShoppingWishlist />
//               </ProtectedRoute>
//             }
//           />
//         </Route>

//         {/* Yetkisiz Erişim Sayfası */}
//         <Route path="/unauth-page" element={<UnauthPage />} />
//         {/* Bulunamayan Sayfalar */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

// client/src/App.jsx

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

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Uygulama yüklendiğinde kimlik doğrulama durumunu kontrol et
    dispatch(checkAuth());
  }, [dispatch]);

  // Kimlik doğrulama durumu kontrol edilirken yükleme göstergesi
  if (isLoading) return <Skeleton className="w-full h-screen bg-gray-200" />; // Daha genel bir skeleton

  console.log("Auth Loading:", isLoading, "User:", user); // Konsol logları kontrol için kalabilir

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
        {/* ShoppingLayout herkes tarafından görülebilir */}
        <Route path="/shop" element={<ShoppingLayout />}>
          {/* Herkese Açık Mağaza Rotaları */}
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<SearchProducts />} />

          {/* YENİ HAKKIMIZDA ROTASI */}
          <Route path="hakkimizda" element={<AboutUs />} />

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
