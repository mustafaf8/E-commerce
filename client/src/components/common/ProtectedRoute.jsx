import "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    console.log(
      `ProtectedRoute (${
        adminOnly ? "Admin" : "User"
      }) -> Not authenticated, redirecting to login from ${location.pathname}`
    );
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    console.log(
      `ProtectedRoute (Admin) -> Not an admin (role: ${user?.role}), redirecting to home from ${location.pathname}`
    );

    return <Navigate to="/shop/home" replace />;
  }

  return children;
}

import PropTypes from "prop-types";

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
