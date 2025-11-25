import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";

function CheckAuth({ isAuthenticated, user, children, isLoading }) {
  const location = useLocation();
  const pathname = location.pathname;

  const isPaymentAgent = user?.role === "payment_agent";
  const isShopRoute = pathname.startsWith("/shop");
  const isAdminRoute = pathname.startsWith("/admin");
  const isDirectPaymentRoute = pathname.startsWith("/admin/direct-payment");

  // Auth durumu yüklenirken skeleton göster
  if (isLoading) {
    return <Skeleton className="w-full h-screen bg-gray-200" />;
  }

  if (pathname === "/") {
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
    (pathname.includes("/auth/login") || pathname.includes("/auth/register"))
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

  // payment agents must never reach /shop or non-direct-payment /admin screens; replace:true prevents cached views
  if (
    isAuthenticated &&
    isPaymentAgent &&
    !isDirectPaymentRoute &&
    (isShopRoute || isAdminRoute)
  ) {
    return <Navigate to="/admin/direct-payment" replace />;
  }

  if (isAuthenticated && isAdminRoute) {
    if (isPaymentAgent) {
      if (!isDirectPaymentRoute) {
        return <Navigate to="/admin/direct-payment" replace />;
      }
    } else if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" replace />;
    }
  }

  if (isAuthenticated && isShopRoute) {
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
