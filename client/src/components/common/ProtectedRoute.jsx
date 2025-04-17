import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Auth durumu hala yükleniyorsa bir yükleme göstergesi gösterilebilir
  if (isLoading) {
    // veya daha iyi bir yükleme bileşeni
    return <div>Yükleniyor...</div>;
  }

  // Kullanıcı giriş yapmamışsa, login sayfasına yönlendir.
  // state: { from: location } -> Kullanıcı giriş yaptıktan sonra geldiği sayfaya geri dönebilmesi için.
  if (!isAuthenticated) {
    console.log(
      `ProtectedRoute -> Not authenticated, redirecting to login from ${location.pathname}`
    );
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Kullanıcı giriş yapmışsa, istenen sayfayı (children) göster.
  return children;
}

export default ProtectedRoute;
