import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, ShoppingCart, User, LayoutGrid, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { Sheet } from "../ui/sheet";
import UserCartWrapper from "../shopping-view/cart-wrapper";

const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { items: cartProductItems } = useSelector(
    (state) => state.shopCart.cartItems
  );

  const navItems = [
    { to: "/shop/home", label: "Keşfet", icon: <Home size={24} /> },
    { to: "/shop/wishlist", label: "Beğendiklerim", icon: <Heart size={24} /> },
    { to: "/shop/cart", label: "Sepetim", icon: <ShoppingCart size={24} /> },
    {
      to: "/shop/listing",
      label: "Kategoriler",
      icon: <LayoutGrid size={24} />,
    },
    { to: "/shop/account", label: "Hesabım", icon: <User size={24} /> },
  ];

  // Benzersiz ürün sayısını hesapla (doğrudan cartProductItems üzerinden)
  const uniqueProductCount = cartProductItems
    ? new Set(cartProductItems.map((item) => item.productId)).size
    : 0;

  return (
    <>
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <UserCartWrapper setOpenCartSheet={setOpenCartSheet} />
      </Sheet>

      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50 bottom-nav ">
        <ul className="flex w-full justify-around items-center h-16">
          {navItems.map((item) => (
            <li
              key={item.to}
              className="flex flex-col items-center justify-center relative"
            >
              <div
                onClick={() => {
                  if (item.to === "/shop/cart") {
                    setOpenCartSheet(true);
                  } else {
                    navigate(item.to);
                  }
                }}
                className={`flex flex-col items-center justify-center h-full w-full text-gray-600 hover:text-orange-500 ${
                  location.pathname.startsWith(item.to) ? "text-orange-500" : ""
                } cursor-pointer`}
              >
                {item.icon}
                {/* cartProductItems kullanarak kontrol et */}
                {item.to === "/shop/cart" &&
                  cartProductItems &&
                  cartProductItems.length > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                      {uniqueProductCount > 0
                        ? uniqueProductCount
                        : cartProductItems.length > 0
                        ? "!"
                        : ""}
                    </span>
                  )}
                <span className="text-xs">{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default BottomNavBar;
