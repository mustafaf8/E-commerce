// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate, useLocation } from "react-router-dom";

// function ProtectedRoute({ children }) {
//   const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
//   const location = useLocation();

//   // Auth durumu hala yükleniyorsa bir yükleme göstergesi gösterilebilir
//   if (isLoading) {
//     // veya daha iyi bir yükleme bileşeni
//     return <div>Yükleniyor...</div>;
//   }

//   // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir.
//   // state: { from: location } -> Kullanıcı giriş yaptıktan sonra geldiği sayfaya geri dönebilmesi için.
//   if (!isAuthenticated) {
//     console.log(
//       `ProtectedRoute -> Not authenticated, redirecting to login from ${location.pathname}`
//     );
//     return <Navigate to="/auth/login" state={{ from: location }} replace />;
//   }

//   // Kullanıcı giriş yapmışsa, istenen sayfayı (children) göster.
//   return children;
// }

// export default ProtectedRoute;

// client/src/components/common/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// Artık `adminOnly` adında bir prop alacak
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // Auth durumu hala yükleniyorsa
  if (isLoading) {
    return <div>Yükleniyor...</div>; // Veya Skeleton göster
  }

  // 1. Giriş Yapmamışsa -> Login'e Yönlendir
  if (!isAuthenticated) {
    console.log(
      `ProtectedRoute (${
        adminOnly ? "Admin" : "User"
      }) -> Not authenticated, redirecting to login from ${location.pathname}`
    );
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 2. Admin Gerekli AMA Kullanıcı Admin Değilse -> Ana Sayfaya Yönlendir
  if (adminOnly && user?.role !== "admin") {
    console.log(
      `ProtectedRoute (Admin) -> Not an admin (role: ${user?.role}), redirecting to home from ${location.pathname}`
    );
    // Yetkisiz erişim sayfasına veya direkt ana sayfaya yönlendirebilirsiniz
    // return <Navigate to="/unauth-page" replace />;
    return <Navigate to="/shop/home" replace />;
  }

  // Tüm kontrollerden geçtiyse, istenen sayfayı (children) göster.
  return children;
}

export default ProtectedRoute;
