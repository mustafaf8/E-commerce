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

    return <Navigate to="/shop/home" replace />;
  }

  // Tüm kontrollerden geçtiyse, istenen sayfayı (children) göster.
  return children;
}

import PropTypes from "prop-types";

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
