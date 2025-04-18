import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function AdminHeader({ setOpen }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleLogout() {
    console.log("[handleLogout] Function called. Dispatching logoutUser...");
    dispatch(logoutUser())
      .unwrap() // .unwrap() kullanmak promise'in sonucunu (fulfilled/rejected) yakalamayı kolaylaştırır
      .then(() => {
        // Dispatch başarılı olduğunda (Redux state güncellendiğinde) çalışır
        console.log(
          "[handleLogout] logoutUser dispatch successful. Navigating..."
        );
        navigate("/shop/home"); // <-- 3. Başarılı çıkış sonrası yönlendir
      })
      .catch((error) => {
        // Eğer logoutUser thunk'ı reject olursa veya ağ hatası olursa burası çalışır
        console.error(
          "[handleLogout] Error during dispatch or logout failed:",
          error
        );

        toast({ variant: "destructive", title: "Çıkış yapılamadı." });
      });
  }

  // return (
  //   <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
  //     <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
  //       <AlignJustify />
  //       <span className="sr-only">Toggle Menu</span>
  //     </Button>
  //     <div className="flex flex-1 justify-end">
  //       <Button
  //         onClick={handleLogout}
  //         className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
  //       >
  //         <LogOut />
  //         Çıkış
  //       </Button>
  //     </div>
  //   </header>
  // );

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end items-center">
        {user && (
          <div className="hidden sm:flex items-center mr-4 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Admin {user.userName}
            </span>
          </div>
        )}
        {/* === YENİ EKLENECEK KISIM SONU === */}
        {/* Mevcut Çıkış Butonu */}
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          {/* LogOut ikonunun boyutunu opsiyonel olarak ayarlayabilirsiniz */}
          <LogOut size={16} />
          Çıkış
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
