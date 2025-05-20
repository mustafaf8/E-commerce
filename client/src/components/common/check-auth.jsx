import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // console.log(
  //   `Yetkilendirme Kontrolü -> Yol: ${location.pathname}, Giriş Durumu: ${isAuthenticated}, Rol: ${user?.role}`
  // );

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      // console.log(
      //   "Yetkilendirme Kontrolü -> Ana sayfa, giriş yapılmamış, ana sayfaya yönlendiriliyor"
      // );
      return <Navigate to="/shop/home" replace />;
    } else {
      if (user?.role === "admin") {
        // console.log(
        //   "Yetkilendirme Kontrolü -> Ana sayfa, admin girişi yapılmış, yönetici paneline yönlendiriliyor"
        // );
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        // console.log(
        //   "Yetkilendirme Kontrolü -> Ana sayfa, kullanıcı girişi yapılmış, mağazaya yönlendiriliyor"
        // );
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
      // console.log(
      //   "Yetkilendirme Kontrolü -> Giriş sayfası, admin girişi yapılmış, yönetici paneline yönlendiriliyor"
      // );
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      // console.log(
      //   "Yetkilendirme Kontrolü -> Giriş sayfası, kullanıcı girişi yapılmış, mağazaya yönlendiriliyor"
      // );
      return <Navigate to="/shop/home" replace />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    // console.log(
    //   "Yetkilendirme Kontrolü -> Yönetici sayfası, admin olmayan kullanıcı, yetkisiz sayfaya yönlendiriliyor"
    // );
    return <Navigate to="/unauth-page" replace />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("/shop")
  ) {
    // console.log(
    //   "Yetkilendirme Kontrolü -> Mağaza sayfası, admin kullanıcısı, yönetici paneline yönlendiriliyor"
    // );
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
CheckAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  children: PropTypes.node,
};

export default CheckAuth;
