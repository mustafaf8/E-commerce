// import { Navigate, useLocation } from "react-router-dom";

// function CheckAuth({ isAuthenticated, user, children }) {
//   const location = useLocation();

//   console.log(location.pathname, isAuthenticated);

//   if (location.pathname === "/") {
//     if (!isAuthenticated) {
//       return <Navigate to="/auth/login" />;
//     } else {
//       if (user?.role === "admin") {
//         return <Navigate to="/admin/dashboard" />;
//       } else {
//         return <Navigate to="/shop/home" />;
//       }
//     }
//   }

//   if (
//     !isAuthenticated &&
//     !(
//       location.pathname.includes("/login") ||
//       location.pathname.includes("/register")
//     )
//   ) {
//     return <Navigate to="/auth/login" />;
//   }

//   if (
//     isAuthenticated &&
//     (location.pathname.includes("/login") ||
//       location.pathname.includes("/register"))
//   ) {
//     if (user?.role === "admin") {
//       return <Navigate to="/admin/dashboard" />;
//     } else {
//       return <Navigate to="/shop/home" />;
//     }
//   }

//   if (
//     isAuthenticated &&
//     user?.role !== "admin" &&
//     location.pathname.includes("admin")
//   ) {
//     return <Navigate to="/unauth-page" />;
//   }

//   if (
//     isAuthenticated &&
//     user?.role === "admin" &&
//     location.pathname.includes("shop")
//   ) {
//     return <Navigate to="/admin/dashboard" />;
//   }

//   return <>{children}</>;
// }

// export default CheckAuth;

import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(
    `CheckAuth -> Path: ${location.pathname}, IsAuth: ${isAuthenticated}, Role: ${user?.role}`
  );

  // 1. Kök dizin ("/") yönlendirmesi (Bu kısım aynı kalabilir)
  if (location.pathname === "/") {
    // Kullanıcı giriş yapmamışsa login'e yönlendir (VEYA ana sayfaya yönlendirebiliriz?)
    // Şimdilik login'e yönlendirme kalsın, istersen bunu /shop/home olarak değiştirebiliriz.
    if (!isAuthenticated) {
      console.log(
        "CheckAuth -> / path, not authenticated, redirecting to login"
      );
      return <Navigate to="/auth/login" replace />;
    } else {
      // Kullanıcı giriş yapmışsa rolüne göre yönlendir
      if (user?.role === "admin") {
        console.log(
          "CheckAuth -> / path, admin authenticated, redirecting to admin dashboard"
        );
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        console.log(
          "CheckAuth -> / path, user authenticated, redirecting to shop home"
        );
        return <Navigate to="/shop/home" replace />;
      }
    }
  }

  // 2. Giriş yapmış kullanıcıları login/register sayfalarından uzaklaştır (Bu kısım aynı kalabilir)
  if (
    isAuthenticated &&
    (location.pathname.includes("/auth/login") ||
      location.pathname.includes("/auth/register"))
  ) {
    if (user?.role === "admin") {
      console.log(
        "CheckAuth -> Auth page, admin authenticated, redirecting to admin dashboard"
      );
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      console.log(
        "CheckAuth -> Auth page, user authenticated, redirecting to shop home"
      );
      return <Navigate to="/shop/home" replace />;
    }
  }

  // 3. Normal kullanıcıların admin paneline erişimini engelle (Bu kısım aynı kalabilir)
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("/admin")
  ) {
    console.log(
      "CheckAuth -> Admin path, non-admin authenticated, redirecting to unauth"
    );
    return <Navigate to="/unauth-page" replace />;
  }

  // 4. Admin kullanıcıların mağaza bölümüne erişimini engelle (Bu kısım aynı kalabilir)
  //    Not: İstersen adminlerin de mağazayı görebilmesini sağlayabiliriz, bu kuralı kaldırarak.
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("/shop")
  ) {
    console.log(
      "CheckAuth -> Shop path, admin authenticated, redirecting to admin dashboard"
    );
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 5. KALDIRILAN KISIM: Eskiden burada kimliği doğrulanmamış kullanıcılar login'e yönlendiriliyordu.
  //    Artık bu genel kural yok. Koruma, belirli routelara veya eylemlere eklenecek.
  /*
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/auth/login") ||
      location.pathname.includes("/auth/register")
    )
  ) {
     console.log("CheckAuth -> Non-auth path, not authenticated, redirecting to login");
     return <Navigate to="/auth/login" replace />;
  }
  */

  // Yukarıdaki koşulların hiçbiri eşleşmezse, alt bileşenleri göster
  // console.log("CheckAuth -> No redirect needed, rendering children");
  return <>{children}</>;
}

export default CheckAuth;
