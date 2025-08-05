import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "../common/footer";
import { useEffect } from "react";
import { io } from "socket.io-client";

function ShoppingLayout() {

  useEffect(() => {
    const socketURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);
    console.log("Socket.IO sunucusuna bağlanılıyor (ziyaretçi):", socketURL);
    
    const socket = io(socketURL, { 
        withCredentials: true,
        transports: ['websocket', 'polling']
    });

    socket.on("connect", () => {
        console.log("Socket.IO başarıyla bağlandı (ziyaretçi), ID:", socket.id);
        socket.emit("register_visitor");
        console.log("'register_visitor' olayı gönderildi.");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO bağlantısı kesildi (ziyaretçi):", reason);
    });
    
    socket.on("connect_error", (error) => {
      console.error("Socket.IO bağlantı hatası (ziyaretçi):", error.message);
    });

    return () => {
      console.log("Socket.IO bağlantısı kesiliyor (ziyaretçi)...");
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
