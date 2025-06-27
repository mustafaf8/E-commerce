import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, ShoppingCart, User, LayoutGrid, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { Sheet } from "../ui/sheet";
import UserCartWrapper from "../shopping-view/cart-wrapper";
import { cn } from "@/lib/utils";

const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { items: cartProductItems } = useSelector(
    (state) => state.shopCart.cartItems
  );

  if (location.pathname.includes("/admin")) {
    return null;
  }

  const navItems = [
    { to: "/shop/home", label: "Keşfet", icon: <Home strokeWidth={1.8} /> },
    {
      to: "/shop/wishlist",
      label: "Favoriler",
      icon: <Heart strokeWidth={1.8} />,
    },
    {
      to: "/shop/cart",
      label: "Sepetim",
      icon: <ShoppingCart strokeWidth={1.8} />,
    },
    {
      to: "/shop/listing",
      label: "Kategoriler",
      icon: <LayoutGrid strokeWidth={1.8} />,
    },
    { to: "/shop/account", label: "Hesabım", icon: <User strokeWidth={1.8} /> },
  ];

  // Calculate unique product count
  const uniqueProductCount = cartProductItems
    ? new Set(cartProductItems.map((item) => item.productId)).size
    : 0;

  return (
    <>
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <UserCartWrapper setOpenCartSheet={setOpenCartSheet} />
      </Sheet>

      <div className="h-16 mb-0 md:mb-0 pb-safe-bottom"></div>
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 bottom-nav border-t border-gray-100">
        <ul className="flex w-full justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <li
                key={item.to}
                className="flex flex-1 items-center justify-center relative h-full"
              >
                <div
                  onClick={() => {
                    if (item.to === "/shop/cart") {
                      setOpenCartSheet(true);
                    } else {
                      navigate(item.to);
                    }
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <div className="relative">
                    {item.icon}
                    {item.to === "/shop/cart" && uniqueProductCount > 0 && (
                      <span className="cart-count-badge">
                        {uniqueProductCount > 9 ? "9+" : uniqueProductCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1",
                      isActive ? "font-medium" : "font-normal"
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 w-1/2 h-0.5 bg-primary rounded-full"></div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default BottomNavBar;
