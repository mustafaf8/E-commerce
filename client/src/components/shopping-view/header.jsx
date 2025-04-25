import { Heart, LogIn } from "lucide-react"; // <-- İkonu import et
import { LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/shop/home");
        toast({
          title: "Çıkış yapıldı",
          description: "Başka bir zaman görüşmek üzere!",
          variant: "success",
        });
      })
      .catch((error) => {
        console.error("Shop logout failed:", error);
      });
  }

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id, isAuthenticated]);

  // console.log(cartItems, "mustafa");

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        {isAuthenticated && (
          <Button
            onClick={() => navigate("/shop/account")}
            variant="outline"
            size="mustafa" // Özel boyutun uygun göründüğünden emin ol
            className="relative hidden sm:inline-flex" // Küçük ekranlarda gizle
          >
            Siparişlerim
          </Button>
        )}
        {/* Sepet Butonu */}
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="mustafa" // Özel boyutun uygun göründüğünden emin ol
          className="relative inline-flex items-center" //
        >
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          {/* Sepet ürün sayısını sadece giriş yapmışsa ve ürün varsa göster */}
          {isAuthenticated && (cartItems?.items?.length || 0) > 0 && (
            <span className="absolute top-[-5px] right-[2px] bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {cartItems.items.length}
            </span>
          )}
          {/* Küçük ekranlarda "Sepetim" yazısı gizlenebilir */}
          <p className="pl-2 hidden sm:block">Sepetim</p>
        </Button>
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
      {isAuthenticated && user ? (
        // ** Kullanıcı GİRİŞ YAPMIŞ ise: Avatar ve Dropdown **
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black cursor-pointer border-2 border-gray-200 hover:border-gray-400 transition duration-200 ease-in-out">
              {/* Tıklanabilir hissi için */}
              <AvatarFallback className="bg-gray-200 text-black font-extrabold">
                {/* Kullanıcı adı varsa ve boş değilse baş harfi al, yoksa "?" göster */}
                {user.userName && user.userName.length > 0
                  ? user.userName[0].toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-56">
            {" "}
            {/* Açılma yönü ayarlandı */}
            <DropdownMenuLabel>Merhaba, {user.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Hesabım
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/shop/wishlist")}>
              <Heart className="mr-2 h-4 w-4" />
              Favorilerim
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // ** Kullanıcı GİRİŞ YAPMAMIŞ ise: Giriş Yap Butonu **
        <Button
          variant="outline" // Veya farklı bir stil tercih edebilirsin
          onClick={() => navigate("/auth/login")} // Login sayfasına yönlendir
          size="mustafa" // Diğer butonlarla aynı boyutta olması iyi olabilir
          className="inline-flex items-center"
        >
          <LogIn className="mr-2 h-5 w-5" /> {/* İsteğe bağlı ikon */}
          Giriş Yap
        </Button>
      )}
      {/* --- Koşullu Render Sonu --- */}
    </div>
  );
}

function ShoppingHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { isCartOpen } = useSelector((state) => state.shopCart);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2 mr-4">
          <span className="">
            <img
              className="w-32 md:w-40" // Boyut biraz ayarlandı
              src="../src/assets/dlogo2.png" // Bu yolun public klasörüne göre doğru olduğundan emin ol veya import kullan
              alt="logo"
            />
          </span>
        </Link>

        <div className="hidden lg:flex flex-1 justify-center">
          <MenuItems />
        </div>

        {/* Mobile Menu Sheet (Sağda) */}
        {/* <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <div className="mb-6">
              <MenuItems />
            </div>
            <div className="border-t pt-4">
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet> */}

        {/* Desktop Right Content (Avatar/Login) (Sağda) */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
