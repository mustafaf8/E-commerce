import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";

function CheckAuth({ isAuthenticated, user, children, isLoading }) {
  const location = useLocation();

  const isPaymentAgent = user?.role === "payment_agent";

  // Auth durumu yüklenirken skeleton göster
  if (isLoading) {
    return <Skeleton className="w-full h-screen bg-gray-200" />;
  }

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" replace />;
    } else {
      if (isPaymentAgent) {
        return <Navigate to="/admin/direct-payment" replace />;
      }

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
    if (isPaymentAgent) {
      return <Navigate to="/admin/direct-payment" replace />;
    }

    if (user?.role === "admin") {
      return <Navigate to="/admin/stats" replace />;
    } else {
      return <Navigate to="/shop/home" replace />;
    }
  }

  if (isAuthenticated && location.pathname.includes("/admin")) {
    if (isPaymentAgent) {
      if (!location.pathname.startsWith("/admin/direct-payment")) {
        return <Navigate to="/admin/direct-payment" replace />;
      }
    } else if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" replace />;
    }
  }

  if (isAuthenticated && location.pathname.includes("/shop")) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/stats" replace />;
    }
    if (isPaymentAgent) {
      return <Navigate to="/admin/direct-payment" replace />;
    }
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
