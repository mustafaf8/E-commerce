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
    // Sepeti sadece giriş yapmış kullanıcılar için çek
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user.id));
    }
    // Kullanıcı çıkış yaparsa Redux state'i (ve muhtemelen sepet) zaten sıfırlanacaktır.
  }, [dispatch, user?.id, isAuthenticated]); // isAuthenticated bağımlılıklara eklendi

  console.log(cartItems, "mustafa");

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => navigate("/shop/account")}
          variant="outline"
          size="mustafa"
          className="relative"
        >
          <p className="">Siparişlerim</p>
        </Button>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="mustafa"
          className="relative"
        >
          <ShoppingCart className="w- h-8" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <p className="pl-3">Sepetim</p>
          <span className="sr-only">Kullanıcı sepeti</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet> */}

      {/* --- Sepet Kısmı --- */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        {/* Siparişlerim butonu - Sadece giriş yapmışsa göster */}
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
          className="relative inline-flex items-center" // Hizalama için
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
          <span className="sr-only">Kullanıcı sepeti</span>
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

      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Hesap
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/wishlist")}>
            <Heart className="mr-2 h-4 w-4" />
            Favorilerim
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}

      {/* --- Avatar veya Giriş Butonu (Koşullu Render) --- */}
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

// function ShoppingHeader() {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useSelector((state) => state.auth);
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   function handleLogout() {
//     dispatch(logoutUser());
//   }
//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-background">
//       <div className="flex h-16 items-center justify-between px-4 md:px-6">
//         <Link to="/shop/home" className="flex items-center gap-2">
//           <span className="">
//             <img
//               className="w-40 ml-8 max-[1000px]:ml-0"
//               src="../src/assets/dlogo2.png"
//               alt="logo"
//             />
//           </span>
//         </Link>

//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="outline" size="icon" className="lg:hidden">
//               <Menu className="h-6 w-6" />
//               <span className="sr-only">Toggle header menu</span>
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="w-full max-w-xs">
//             <MenuItems />
//             <HeaderRightContent />
//           </SheetContent>
//         </Sheet>
//         <div className="hidden lg:block">
//           <MenuItems />
//         </div>

//         <div className="hidden lg:block">
//           <HeaderRightContent />
//         </div>
//       </div>
//       {/* Kullanıcı Dropdown Menüsü */}
//       <DropdownMenu>
//         {/* ... (DropdownMenuTrigger) */}
//         <DropdownMenuContent side="right" className="w-56">
//           <DropdownMenuLabel>Giriş Yapıldı: {user?.userName}</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={() => navigate("/shop/account")}>
//             <UserCog className="mr-2 h-4 w-4" />
//             Hesap
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => navigate("/shop/wishlist")}>
//             <Heart className="mr-2 h-4 w-4" />
//             Favorilerim
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={handleLogout}>
//             <LogOut className="mr-2 h-4 w-4" />
//             Çıkış
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </header>
//   );
// }

// export default ShoppingHeader;

// ShoppingHeader fonksiyonu dağınık görünüyordu, düzenlendi
function ShoppingHeader() {
  const navigate = useNavigate();
  // Artık burada auth state'ine doğrudan gerek yok, HeaderRightContent hallediyor

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2 mr-4">
          {" "}
          {/* Sağ tarafa boşluk için mr-4 eklendi */}
          <span className="">
            <img
              className="w-32 md:w-40" // Boyut biraz ayarlandı
              src="../src/assets/dlogo2.png" // Bu yolun public klasörüne göre doğru olduğundan emin ol veya import kullan
              alt="logo"
            />
          </span>
        </Link>

        {/* Desktop Menu Items (Ortada) */}
        <div className="hidden lg:flex flex-1 justify-center">
          {" "}
          {/* flex-1 ve justify-center ile ortala */}
          <MenuItems />
        </div>

        {/* Mobile Menu Sheet (Sağda) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            {/* Önce menü itemleri */}
            <div className="mb-6">
              <MenuItems />
            </div>
            {/* Sonra sağ içerik (login/avatar, sepet vs.) */}
            <div className="border-t pt-4">
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Right Content (Avatar/Login) (Sağda) */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
      {/* HeaderRightContent içine taşındığı için buradaki DropdownMenu kaldırıldı */}
    </header>
  );
}

export default ShoppingHeader;
