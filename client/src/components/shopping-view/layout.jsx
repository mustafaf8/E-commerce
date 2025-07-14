import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "../common/footer";
import { useEffect } from "react";
import { io } from "socket.io-client";

function ShoppingLayout() {
  // Ziyaretçi bağlantısı: sayfa yüklendiğinde sunucuya bildirim gönder
  useEffect(() => {
    const socketURL = import.meta.env.DEV
      ? "http://localhost:5000"
      : window.location.origin;

    const socket = io(socketURL, { withCredentials: true });
    socket.emit("register_visitor");

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <ShoppingHeader />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ShoppingLayout;
