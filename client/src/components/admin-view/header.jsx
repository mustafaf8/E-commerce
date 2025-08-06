import { AlignJustify, BellRing, LogOut, User } from "lucide-react";
import { io } from "socket.io-client";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { incrementNewCount, resetNewCount } from "@/store/admin/adminMessageSlice";

function AdminHeader({ setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [liveVisitorCount, setLiveVisitorCount] = useState(null);
  const newMessageCount = useSelector((state) => state.adminMessages?.newCount || 0);

  // Get order data from store
  const { userList = [], guestOrderList = [] } = useSelector(
    (state) => state.adminOrder || {}
  );

  // Calculate new order count
  useEffect(() => {
    // Check for new orders from registered users
    const registeredNewOrders = userList.filter(
      (user) => user.hasNewOrder
    ).length;

    // Check for new orders from guests
    const newOrderStatuses = ["pending", "pending_payment"];
    const guestNewOrders = guestOrderList.filter(
      (order) => newOrderStatuses.includes(order.orderStatus) || order.isNew
    ).length;

    // Set total count
    setNewOrderCount(registeredNewOrders + guestNewOrders);
  }, [userList, guestOrderList]);

  useEffect(() => {
    const socketURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);
    const socket = io(socketURL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    socket.on("connect", () => {
      socket.emit("register_admin");
    });
    socket.on("disconnect", (reason) => {
      setLiveVisitorCount(null);
    });
    socket.on("connect_error", (error) => {
      console.error("Socket.IO bağlantı hatası:", error.message);
    });
    socket.on("visitor_count", (count) => {
      setLiveVisitorCount(count);
    });
    // Yeni mesaj bildirimi
    socket.on("new_message_received", (data) => {
      dispatch(incrementNewCount());
      toast({ title: "Yeni müşteri mesajı!", description: data.subject, variant: "default" });
    });
    return () => {
      socket.disconnect();
    };
  }, [dispatch, toast]);

  // Mesajlar sayfasına gidince yeni mesaj sayısını sıfırla
  useEffect(() => {
    if (location.pathname === "/admin/messages") {
      dispatch(resetNewCount());
    }
  }, [location, dispatch]);

  function handleLogout() {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/shop/home");
      })
      .catch((error) => {
        console.error(
          "[handleLogout] Dispatch sırasında hata oluştu veya çıkış başarısız oldu:",
          error
        );
        toast({ variant: "destructive", title: "Çıkış yapılamadı." });
      });
  }

  function handleBellClick() {
    navigate("/admin/orders");
  }

  function handleMessageBellClick() {
    navigate("/admin/messages");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white dark:bg-gray-900 px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="lg:hidden"
        >
          <AlignJustify size={20} />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2">
          {/* Yanıp sönen yeşil nokta */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-lg font-semibold text-primary hidden md:block">
            Anlık Ziyaretçi: {liveVisitorCount !== null ? liveVisitorCount : "-"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Sipariş bildirimi */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full relative"
          onClick={handleBellClick}
        >
          <BellRing size={18} />
          {newOrderCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {newOrderCount > 9 ? "9+" : newOrderCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
        {/* Mesaj bildirimi */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full relative"
          onClick={handleMessageBellClick}
        >
          <BellRing size={18} className="text-indigo-600" />
          {newMessageCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-medium text-white">
              {newMessageCount > 9 ? "9+" : newMessageCount}
            </span>
          )}
          <span className="sr-only">Mesaj Bildirimi</span>
        </Button>
        <div className="hidden md:flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1.5 text-sm font-medium">
          <User size={16} className="text-primary" />
          <span>{user?.userName || "Admin"}</span>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="gap-1 items-center text-gray-700 dark:text-gray-300"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Çıkış</span>
        </Button>
      </div>
    </header>
  );
}
AdminHeader.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default AdminHeader;
