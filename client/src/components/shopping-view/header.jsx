// import { Heart, LogIn, LogOut, ShoppingCart, UserCog } from "lucide-react";
// import {
//   Link,
//   useLocation,
//   useNavigate,
//   useSearchParams,
// } from "react-router-dom";
// import { Sheet } from "../ui/sheet";
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { shoppingViewHeaderMenuItems } from "@/config";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "../ui/avatar";
// import { logoutUser } from "@/store/auth-slice";
// import UserCartWrapper from "./cart-wrapper";
// import { useEffect, useState } from "react";
// import { fetchCartItems } from "@/store/shop/cart-slice";
// import { Label } from "../ui/label";
// import { toast } from "../ui/use-toast";

// function MenuItems() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams, setSearchParams] = useSearchParams();

//   function handleNavigate(getCurrentMenuItem) {
//     sessionStorage.removeItem("filters");
//     const currentFilter =
//       getCurrentMenuItem.id !== "home" &&
//       getCurrentMenuItem.id !== "products" &&
//       getCurrentMenuItem.id !== "search"
//         ? {
//             category: [getCurrentMenuItem.id],
//           }
//         : null;

//     sessionStorage.setItem("filters", JSON.stringify(currentFilter));

//     location.pathname.includes("listing") && currentFilter !== null
//       ? setSearchParams(
//           new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
//         )
//       : navigate(getCurrentMenuItem.path);
//   }

//   return (
//     <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
//       {shoppingViewHeaderMenuItems.map((menuItem) => (
//         <Label
//           onClick={() => handleNavigate(menuItem)}
//           className="text-sm font-medium cursor-pointer"
//           key={menuItem.id}
//         >
//           {menuItem.label}
//         </Label>
//       ))}
//     </nav>
//   );
// }

// function HeaderRightContent() {
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const [openCartSheet, setOpenCartSheet] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   function handleLogout() {
//     dispatch(logoutUser())
//       .unwrap()
//       .then(() => {
//         navigate("/auth/login");
//         toast({
//           title: "Çıkış yapıldı",
//           description: "Başka bir zaman görüşmek üzere!",
//           variant: "success",
//         });
//       })
//       .catch((error) => {
//         console.error("Shop logout failed:", error);
//       });
//   }

//   useEffect(() => {
//     if (isAuthenticated && user?.id) {
//       dispatch(fetchCartItems(user.id));
//     }
//   }, [dispatch, user?.id, isAuthenticated]);

//   // console.log(cartItems, "mustafa");

//   return (
//     <div className="flex lg:items-center lg:flex-row flex-col gap-4">
//       <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
//         {isAuthenticated && (
//           <Button
//             onClick={() => navigate("/shop/account")}
//             variant="outline"
//             size="mustafa" // Özel boyutun uygun göründüğünden emin ol
//             className="relative hidden sm:inline-flex" // Küçük ekranlarda gizle
//           >
//             Siparişlerim
//           </Button>
//         )}
//         {/* Sepet Butonu */}
//         <Button
//           onClick={() => setOpenCartSheet(true)}
//           variant="outline"
//           size="mustafa" // Özel boyutun uygun göründüğünden emin ol
//           className="relative inline-flex items-center" //
//         >
//           <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
//           {/* Sepet ürün sayısını sadece giriş yapmışsa ve ürün varsa göster */}
//           {isAuthenticated && (cartItems?.items?.length || 0) > 0 && (
//             <span className="absolute top-[-5px] right-[2px] bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
//               {cartItems.items.length}
//             </span>
//           )}
//           {/* Küçük ekranlarda "Sepetim" yazısı gizlenebilir */}
//           <p className="pl-2 hidden sm:block">Sepetim</p>
//         </Button>
//         <UserCartWrapper
//           setOpenCartSheet={setOpenCartSheet}
//           cartItems={
//             // Sepet içeriğini sadece giriş yapmışsa gönder
//             isAuthenticated &&
//             cartItems &&
//             cartItems.items &&
//             cartItems.items.length > 0
//               ? cartItems.items
//               : []
//           }
//         />
//       </Sheet>
//       {isAuthenticated && user ? (
//         // ** Kullanıcı GİRİŞ YAPMIŞ ise: Avatar ve Dropdown **
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Avatar className="bg-black cursor-pointer border-2 border-gray-200 hover:border-gray-400 transition duration-200 ease-in-out">
//               {/* Tıklanabilir hissi için */}
//               <AvatarFallback className="bg-gray-200 text-black font-extrabold">
//                 {/* Kullanıcı adı varsa ve boş değilse baş harfi al, yoksa "?" göster */}
//                 {user.userName && user.userName.length > 0
//                   ? user.userName[0].toUpperCase()
//                   : "?"}
//               </AvatarFallback>
//             </Avatar>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent side="bottom" align="end" className="w-56">
//             {" "}
//             {/* Açılma yönü ayarlandı */}
//             <DropdownMenuLabel>Merhaba, {user.userName}</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => navigate("/shop/account")}>
//               <UserCog className="mr-2 h-4 w-4" />
//               Hesabım
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => navigate("/shop/wishlist")}>
//               <Heart className="mr-2 h-4 w-4" />
//               Favorilerim
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleLogout}>
//               <LogOut className="mr-2 h-4 w-4" />
//               Çıkış Yap
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ) : (
//         // ** Kullanıcı GİRİŞ YAPMAMIŞ ise: Giriş Yap Butonu **
//         <Button
//           variant="outline" // Veya farklı bir stil tercih edebilirsin
//           onClick={() => navigate("/auth/login")} // Login sayfasına yönlendir
//           size="mustafa" // Diğer butonlarla aynı boyutta olması iyi olabilir
//           className="inline-flex items-center"
//         >
//           <LogIn className="mr-2 h-5 w-5" /> {/* İsteğe bağlı ikon */}
//           Giriş Yap
//         </Button>
//       )}
//       {/* --- Koşullu Render Sonu --- */}
//     </div>
//   );
// }

// function ShoppingHeader() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { isAuthenticated, user } = useSelector((state) => state.auth);

//   function handleLogout() {
//     dispatch(logoutUser())
//       .unwrap()
//       .then(() => {
//         navigate("/auth/login"); // Login'e yönlendir
//         toast({
//           title: "Çıkış yapıldı",
//           description: "Başka bir zaman görüşmek üzere!",
//           variant: "success",
//         });
//       })
//       .catch((error) => {
//         console.error("Shop logout failed:", error);
//       });
//   }

//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-background">
//       <div className="flex h-16 items-center justify-between px-4 md:px-6">
//         <Link to="/shop/home" className="flex items-center gap-2 mr-4">
//           <span className="">
//             <img
//               className="w-32 md:w-40"
//               src="../src/assets/dlogo2.png"
//               alt="logo"
//             />
//           </span>
//         </Link>

//         <div className="hidden lg:flex flex-1 justify-center">
//           <MenuItems />
//         </div>

//         <div className="lg:hidden flex items-center ml-auto">
//           {isAuthenticated && user ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Avatar className="h-8 w-8 cursor-pointer border hover:border-gray-400">
//                   <AvatarFallback className="text-sm bg-gray-200 text-black font-bold">
//                     {user.userName && user.userName.length > 0
//                       ? user.userName[0].toUpperCase()
//                       : "?"}
//                   </AvatarFallback>
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent side="bottom" align="end" className="w-48">
//                 <DropdownMenuLabel className="text-xs px-2 py-1.5">
//                   Merhaba, {user.userName}
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   className="text-xs px-2 py-1.5"
//                   onClick={handleLogout}
//                 >
//                   <LogOut className="mr-2 h-3.5 w-3.5" /> Çıkış Yap
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <Button
//               variant="outline"
//               onClick={() => navigate("/auth/login")}
//               size="mustafa"
//               className="inline-flex items-center"
//             >
//               <LogIn className="mr-2 h-5 w-5" />
//               Giriş Yap
//             </Button>
//           )}
//         </div>

//         <div className="hidden lg:block ml-auto">
//           <HeaderRightContent />
//         </div>
//       </div>
//     </header>
//   );
// }

// export default ShoppingHeader;

import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
} from "lucide-react"; // Menu ikonu eklendi (mobil için)
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"; // SheetContent ve SheetTrigger eklendi
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
// import { shoppingViewHeaderMenuItems } from "@/config"; // <<< Sabit menü kaldırıldı
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
import { useEffect, useState, useMemo } from "react"; // useMemo eklendi
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";
// *** YENİ İMPORTLAR ***
import { fetchAllCategories } from "@/store/common-slice/categories-slice";
import { Skeleton } from "@/components/ui/skeleton"; // Yükleme durumu için
// *** --- ***

// --- MenuItems Bileşeni Güncellemesi ---
function MenuItems({ isMobile = false, closeSheet }) {
  // Mobil durum ve sheet kapatma prop'ları
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  // *** Kategorileri Redux'tan Çek ***
  const { categoryList = [], isLoading: categoriesLoading } = useSelector(
    (state) => state.categories || { categoryList: [], isLoading: false }
  );

  // Kategorileri ilk yüklemede çekmek için useEffect
  useEffect(() => {
    // Eğer kategoriler henüz yüklenmediyse fetch et
    if (!categoryList.length) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, categoryList.length]); // Sadece dispatch ve liste uzunluğu değiştiğinde çalışsın

  // --- Navigasyon Fonksiyonu Güncellemesi (Slug Kullanımı) ---
  function handleNavigate(categorySlug = null) {
    sessionStorage.removeItem("filters"); // Önceki filtreleri temizle

    if (categorySlug) {
      // Kategori linkine tıklandıysa
      const currentFilter = { category: [categorySlug] };
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));

      // Eğer zaten listing sayfasındaysak URL'i güncelle, değilse sayfaya git
      if (location.pathname.includes("/shop/listing")) {
        setSearchParams(new URLSearchParams(`?category=${categorySlug}`));
      } else {
        navigate(`/shop/listing?category=${categorySlug}`);
      }
    } else {
      // "Tüm Ürünler" veya "Ana Sayfa" gibi genel bir linke tıklandıysa
      // Kategori filtresi olmadan listing sayfasına git
      if (location.pathname.includes("/shop/listing")) {
        setSearchParams({}); // Parametreleri temizle
      } else {
        navigate(`/shop/listing`);
      }
    }

    // Eğer mobil menüdeyse, menüyü kapat
    if (isMobile && closeSheet) {
      closeSheet();
    }
  }
  // --- ---

  // Sabit menü öğeleri (Ana Sayfa ve Tüm Ürünler)
  const staticMenuItems = [
    { id: "products", label: "Tüm Ürünler", path: "/shop/listing" },
    { id: "search", label: "Ara", path: "/shop/search" }, // Arama linki de eklenebilir
  ];

  // Dinamik kategori menü öğeleri oluşturma
  const dynamicCategoryItems = useMemo(() => {
    return categoryList
      .filter((cat) => cat.isActive) // Sadece aktif kategorileri al
      .map((cat) => ({
        id: cat.slug, // ID olarak slug kullanılıyor
        label: cat.name,
        path: `/shop/listing?category=${cat.slug}`, // Doğrudan link oluşturuluyor
        isCategory: true, // Kategori olduğunu belirtmek için flag
      }));
  }, [categoryList]); // Sadece kategori listesi değiştiğinde yeniden hesapla

  // Tüm menü öğelerini birleştir
  const allMenuItems = [...staticMenuItems, ...dynamicCategoryItems];

  return (
    <nav
      className={`flex ${
        isMobile ? "flex-col space-y-4 p-4" : "items-center gap-6"
      }`}
    >
      {categoriesLoading && !isMobile ? (
        // Masaüstü yükleme iskeleti
        <>
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </>
      ) : (
        // Menü öğelerini render et
        allMenuItems.map((menuItem) => (
          <Label
            onClick={() => {
              if (
                menuItem.path === "/shop/home" ||
                menuItem.path === "/shop/search"
              ) {
                navigate(menuItem.path);
                if (isMobile && closeSheet) closeSheet();
              } else {
                handleNavigate(menuItem.isCategory ? menuItem.id : null);
              }
            }}
            className={`text-sm font-medium cursor-pointer ${
              isMobile ? "py-2 border-b" : ""
            } hover:text-primary transition-colors`}
            key={menuItem.id}
          >
            {menuItem.label}
          </Label>
        ))
      )}
    </nav>
  );
}
// --- ---

function HeaderRightContent({ closeSheet }) {
  // closeSheet prop'u eklendi
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/auth/login");
        toast({
          title: "Çıkış yapıldı",
          description: "Başka bir zaman görüşmek üzere!",
          variant: "success",
        });
        if (closeSheet) closeSheet(); // Mobil menüyü kapat
      })
      .catch((error) => {
        console.error("Shop logout failed:", error);
        toast({
          // Toast eklendi
          variant: "destructive",
          title: "Çıkış yapılamadı.",
        });
      });
  }

  function handleNavigate(path) {
    navigate(path);
    if (closeSheet) closeSheet(); // Mobil menüyü kapat
  }

  useEffect(() => {
    if (isAuthenticated && user?.id && !cartItems?.items?.length) {
      // Sepet boşsa veya yoksa fetch et
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id, isAuthenticated, cartItems?.items?.length]); // cartItems.items.length bağımlılığı eklendi

  const uniqueProductCount = cartItems?.items
    ? new Set(cartItems.items.map((item) => item.productId)).size
    : 0;

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4 p-4 lg:p-0 border-t lg:border-none">
      {/* Sepet Sheet'i (Açık/Kapalı Kontrolü) */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        {/* Tetikleyici Buton (Sadece Sheet için, içeride render edilmez) */}
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="mustafa"
            className="relative inline-flex items-center w-full lg:w-auto justify-center"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            {isAuthenticated && uniqueProductCount > 0 && (
              <span className="absolute top-[-5px] right-[2px] bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {uniqueProductCount}
              </span>
            )}
            <p className="pl-2">Sepetim</p>
          </Button>
        </SheetTrigger>
        {/* Sepet İçeriği */}
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet} // Kapatma fonksiyonunu ilet
          cartItems={
            isAuthenticated && cartItems?.items?.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {/* Siparişlerim Butonu (Sadece masaüstünde görünsün) */}
      {isAuthenticated && (
        <Button
          onClick={() => handleNavigate("/shop/account")}
          variant="outline"
          size="mustafa"
          className="relative hidden lg:inline-flex w-full lg:w-auto justify-center"
        >
          Siparişlerim
        </Button>
      )}

      {/* Kullanıcı Giriş/Avatar Bölümü */}
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full lg:w-auto justify-center"
            >
              <Avatar className="h-6 w-6 bg-black cursor-pointer border border-gray-200">
                <AvatarFallback className="bg-gray-200 text-black text-xs font-extrabold">
                  {user.userName && user.userName.length > 0
                    ? user.userName[0].toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden lg:inline">{user.userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-56">
            <DropdownMenuLabel>Merhaba, {user.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Hesabım
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate("/shop/wishlist")}>
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
        <Button
          variant="outline"
          onClick={() => handleNavigate("/auth/login")}
          size="mustafa"
          className="inline-flex items-center w-full lg:w-auto justify-center"
        >
          <LogIn className="mr-2 h-5 w-5" />
          Giriş Yap
        </Button>
      )}
    </div>
  );
}

function ShoppingHeader() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobil menü state'i

  // Mobil menüyü kapatma fonksiyonu
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2 mr-4">
          <span className="">
            <img
              className="w-32 md:w-40"
              // src="../src/assets/dlogo2.png" // Doğru yolu kontrol edin
              src="/src/assets/dlogo2.png" // Proje kök dizinine göre yol
              alt="logo"
            />
          </span>
        </Link>

        {/* Masaüstü Menü (Geniş ekranlarda görünür) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <MenuItems isMobile={false} />
        </div>

        {/* Mobil Menü Tetikleyici (Küçük ekranlarda görünür) */}
        <div className="lg:hidden flex items-center ml-auto">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menüyü Aç</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[80vw] max-w-[300px] p-0 flex flex-col"
            >
              {/* Mobil Menü İçeriği */}
              {/* Logo (Mobil Menüde) */}
              <div className="p-4 border-b">
                <Link to="/shop/home" onClick={closeMobileMenu}>
                  <img
                    className="w-32"
                    src="/src/assets/dlogo2.png"
                    alt="logo"
                  />
                </Link>
              </div>
              <div className="flex-grow overflow-y-auto">
                <MenuItems isMobile={true} closeSheet={closeMobileMenu} />
              </div>
              {/* Mobil Menü Sağ İçerik (Giriş/Avatar/Sepet vb.) */}
              <HeaderRightContent closeSheet={closeMobileMenu} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Masaüstü Sağ İçerik (Geniş ekranlarda görünür) */}
        <div className="hidden lg:flex items-center ml-auto">
          {/* HeaderRightContent'i direkt render etmek yerine içeriğini buraya taşıyabiliriz */}
          {/* Veya HeaderRightContent'i prop olmadan çağırabiliriz */}
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
