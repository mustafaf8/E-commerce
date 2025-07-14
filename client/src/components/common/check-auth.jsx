import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";

function CheckAuth({ isAuthenticated, user, children, isLoading }) {
  const location = useLocation();

  // Auth durumu yüklenirken skeleton göster
  if (isLoading) {
    return <Skeleton className="w-full h-screen bg-gray-200" />;
  }

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" replace />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/stats" replace />;
      } else {
        return <Navigate to="/shop/home" replace />;
      }
    }
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/auth/login") ||
      location.pathname.includes("/auth/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/stats" replace />;
    } else {
      return <Navigate to="/shop/home" replace />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    return <Navigate to="/unauth-page" replace />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("/shop")
  ) {
    return <Navigate to="/admin/stats" replace />;
  }

  return <>{children}</>;
}

CheckAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  children: PropTypes.node,
  isLoading: PropTypes.bool,
};

export default CheckAuth;
