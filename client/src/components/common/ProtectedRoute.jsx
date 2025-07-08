import "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false, level1Only = false }) {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/shop/home" replace />;
  }

  if (level1Only && user?.adminAccessLevel !== 1 && user?.adminAccessLevel !== undefined) {
    // Non Level1 admin redirected to dashboard or home
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

import PropTypes from "prop-types";

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
  level1Only: PropTypes.bool,
};

export default ProtectedRoute;
