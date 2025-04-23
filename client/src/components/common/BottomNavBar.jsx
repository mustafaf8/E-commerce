import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, List, ShoppingCart, User, LayoutGrid } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"; // Sheet bileşenlerini import edin
import UserCartWrapper from "../shopping-view/cart-wrapper";

const BottomNavBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openCartSheet, setOpenCartSheet] = useState(false); // Sheet durumunu kontrol etmek için state ekleyin

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const navItems = [
    { to: "/shop/home", label: "Keşfet", icon: <Home size={24} /> },
    { to: "/shop/listing", label: "Listelerim", icon: <List size={24} /> },
    { to: "/shop/cart", label: "Sepetim", icon: <ShoppingCart size={24} /> },
    { to: "/shop/account", label: "Hesabım", icon: <User size={24} /> },
    {
      to: "/shop/categories",
      label: "Kategoriler",
      icon: <LayoutGrid size={24} />,
    },
  ];

  return (
    <>
      {/* Sheet bileşenini ekleyin */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            // Sepet içeriğini sadece giriş yapmışsa gönder
            isAuthenticated &&
            cartItems &&
            cartItems.items &&
            cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {/* Navbar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50 bottom-nav">
        <ul className="flex w-full justify-around items-center h-16">
          {navItems.map((item) => (
            <li
              key={item.to}
              className="flex flex-col items-center justify-center relative"
            >
              <div
                onClick={() => {
                  if (item.to === "/shop/cart") {
                    // Sepet butonu için Sheet'i aç
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
                {item.to === "/shop/cart" && cartItems?.items?.length > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                    {cartItems.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
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
