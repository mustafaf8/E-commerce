// // import { Heart, LogIn, LogOut, ShoppingCart, UserCog } from "lucide-react"; // Menu ikonu eklendi (mobil için)
// // import {
// //   Link,
// //   useLocation,
// //   useNavigate,
// //   useSearchParams,
// // } from "react-router-dom";
// // import { Sheet, SheetTrigger } from "../ui/sheet"; // SheetContent ve SheetTrigger eklendi
// // import { Button } from "../ui/button";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "../ui/dropdown-menu";
// // import { Avatar, AvatarFallback } from "../ui/avatar";
// // import { logoutUser } from "@/store/auth-slice";
// // import UserCartWrapper from "./cart-wrapper";
// // import { useEffect, useState, useMemo } from "react"; // useMemo eklendi
// // import { fetchCartItems } from "@/store/shop/cart-slice";
// // import { Label } from "../ui/label";
// // import { toast } from "../ui/use-toast";
// // import { fetchAllCategories } from "@/store/common-slice/categories-slice";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import PropTypes from "prop-types";

// // function MenuItems({ isMobile = false, closeSheet }) {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const [searchParams, setSearchParams] = useSearchParams();
// //   const dispatch = useDispatch();

// //   const { categoryList = [], isLoading: categoriesLoading } = useSelector(
// //     (state) => state.categories || { categoryList: [], isLoading: false }
// //   );

// //   useEffect(() => {
// //     if (!categoryList.length) {
// //       dispatch(fetchAllCategories());
// //     }
// //   }, [dispatch, categoryList.length]);

// //   function handleNavigate(categorySlug = null) {
// //     sessionStorage.removeItem("filters");

// //     if (categorySlug) {
// //       const currentFilter = { category: [categorySlug] };
// //       sessionStorage.setItem("filters", JSON.stringify(currentFilter));

// //       if (location.pathname.includes("/shop/listing")) {
// //         setSearchParams(new URLSearchParams(`?category=${categorySlug}`));
// //       } else {
// //         navigate(`/shop/listing?category=${categorySlug}`);
// //       }
// //     } else {
// //       if (location.pathname.includes("/shop/listing")) {
// //         setSearchParams({});
// //       } else {
// //         navigate(`/shop/listing`);
// //       }
// //     }

// //     if (isMobile && closeSheet) {
// //       closeSheet();
// //     }
// //   }

// //   const staticMenuItems = [
// //     { id: "search", label: "Ara", path: "/shop/search" },
// //     { id: "products", label: "Tüm Ürünler", path: "/shop/listing" },
// //   ];

// //   const dynamicCategoryItems = useMemo(() => {
// //     return categoryList
// //       .filter((cat) => cat.isActive) // Sadece aktif kategorileri al
// //       .map((cat) => ({
// //         id: cat.slug, // ID olarak slug kullanılıyor
// //         label: cat.name,
// //         path: `/shop/listing?category=${cat.slug}`, // Doğrudan link oluşturuluyor
// //         isCategory: true, // Kategori olduğunu belirtmek için flag
// //       }));
// //   }, [categoryList]); // Sadece kategori listesi değiştiğinde yeniden hesapla

// //   const allMenuItems = [...staticMenuItems, ...dynamicCategoryItems];

// //   return (
// //     <nav
// //       className={`flex ${
// //         isMobile ? "flex-col space-y-4 p-4" : "items-center gap-6"
// //       }`}
// //     >
// //       {categoriesLoading && !isMobile ? (
// //         <>
// //           <Skeleton className="h-5 w-16" />
// //           <Skeleton className="h-5 w-24" />
// //           <Skeleton className="h-5 w-20" />
// //           <Skeleton className="h-5 w-16" />
// //           <Skeleton className="h-5 w-20" />
// //           <Skeleton className="h-5 w-16" />
// //           <Skeleton className="h-5 w-20" />
// //           <Skeleton className="h-5 w-16" />
// //         </>
// //       ) : (
// //         // Menü öğelerini render et
// //         allMenuItems.map((menuItem) => (
// //           <Label
// //             onClick={() => {
// //               if (
// //                 menuItem.path === "/shop/home" ||
// //                 menuItem.path === "/shop/search"
// //               ) {
// //                 navigate(menuItem.path);
// //                 if (isMobile && closeSheet) closeSheet();
// //               } else {
// //                 handleNavigate(menuItem.isCategory ? menuItem.id : null);
// //               }
// //             }}
// //             className={`text-sm font-medium cursor-pointer ${
// //               isMobile ? "py-2 border-b" : ""
// //             } hover:text-primary transition-colors`}
// //             key={menuItem.id}
// //           >
// //             {menuItem.label}
// //           </Label>
// //         ))
// //       )}
// //     </nav>
// //   );
// // }
// // // --- ---

// // function HeaderRightContent({ closeSheet }) {
// //   const { user, isAuthenticated } = useSelector((state) => state.auth);
// //   const { cartItems } = useSelector((state) => state.shopCart);
// //   const [openCartSheet, setOpenCartSheet] = useState(false);
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();

// //   function handleLogout() {
// //     dispatch(logoutUser())
// //       .unwrap()
// //       .then(() => {
// //         navigate("/auth/login");
// //         toast({
// //           title: "Çıkış yapıldı",
// //           description: "Başka bir zaman görüşmek üzere!",
// //           variant: "success",
// //         });
// //         if (closeSheet) closeSheet(); // Mobil menüyü kapat
// //       })
// //       .catch((error) => {
// //         console.error("Shop logout failed:", error);
// //         toast({
// //           variant: "destructive",
// //           title: "Çıkış yapılamadı.",
// //         });
// //       });
// //   }

// //   function handleNavigate(path) {
// //     navigate(path);
// //     if (closeSheet) closeSheet(); // Mobil menüyü kapat
// //   }

// //   useEffect(() => {
// //     if (isAuthenticated && user?.id && !cartItems?.items?.length) {
// //       // Sepet boşsa veya yoksa fetch et
// //       dispatch(fetchCartItems(user.id));
// //     }
// //   }, [dispatch, user?.id, isAuthenticated, cartItems?.items?.length]); // cartItems.items.length bağımlılığı eklendi

// //   const uniqueProductCount = cartItems?.items
// //     ? new Set(cartItems.items.map((item) => item.productId)).size
// //     : 0;

// //   return (
// //     <div className="flex lg:items-center lg:flex-row flex-col gap-4 p-4 lg:p-0 border-t lg:border-none">
// //       {/* Sepet Sheet'i (Açık/Kapalı Kontrolü) */}
// //       <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
// //         {/* Tetikleyici Buton (Sadece Sheet için, içeride render edilmez) */}
// //         <SheetTrigger asChild>
// //           <Button
// //             variant="outline"
// //             size="mustafa"
// //             className="relative inline-flex items-center w-full lg:w-auto justify-center"
// //           >
// //             <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
// //             {isAuthenticated && uniqueProductCount > 0 && (
// //               <span className="absolute top-[-5px] right-[2px] bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
// //                 {uniqueProductCount}
// //               </span>
// //             )}
// //             <p className="pl-2">Sepetim</p>
// //           </Button>
// //         </SheetTrigger>
// //         {/* Sepet İçeriği */}
// //         <UserCartWrapper
// //           setOpenCartSheet={setOpenCartSheet} // Kapatma fonksiyonunu ilet
// //           cartItems={
// //             isAuthenticated && cartItems?.items?.length > 0
// //               ? cartItems.items
// //               : []
// //           }
// //         />
// //       </Sheet>

// //       {/* Siparişlerim Butonu (Sadece masaüstünde görünsün) */}
// //       {isAuthenticated && (
// //         <Button
// //           onClick={() => handleNavigate("/shop/account")}
// //           variant="outline"
// //           size="mustafa"
// //           className="relative hidden lg:inline-flex w-full lg:w-auto justify-center"
// //         >
// //           Siparişlerim
// //         </Button>
// //       )}

// //       {/* Kullanıcı Giriş/Avatar Bölümü */}
// //       {isAuthenticated && user ? (
// //         <DropdownMenu>
// //           <DropdownMenuTrigger asChild>
// //             <Avatar className="h-8 w-8 bg-black cursor-pointer border border-gray-200">
// //               <AvatarFallback className="bg-gray-200 text-black text-sm font-extrabold">
// //                 {user.userName && user.userName.length > 0
// //                   ? user.userName[0].toUpperCase()
// //                   : "?"}
// //               </AvatarFallback>
// //             </Avatar>
// //           </DropdownMenuTrigger>
// //           <DropdownMenuContent side="bottom" align="end" className="w-56">
// //             <DropdownMenuLabel>Merhaba, {user.userName}</DropdownMenuLabel>
// //             <DropdownMenuSeparator />
// //             <DropdownMenuItem onClick={() => handleNavigate("/shop/account")}>
// //               <UserCog className="mr-2 h-4 w-4" />
// //               Hesabım
// //             </DropdownMenuItem>
// //             <DropdownMenuItem onClick={() => handleNavigate("/shop/wishlist")}>
// //               <Heart className="mr-2 h-4 w-4" />
// //               Favorilerim
// //             </DropdownMenuItem>
// //             <DropdownMenuSeparator />
// //             <DropdownMenuItem onClick={handleLogout}>
// //               <LogOut className="mr-2 h-4 w-4" />
// //               Çıkış Yap
// //             </DropdownMenuItem>
// //           </DropdownMenuContent>
// //         </DropdownMenu>
// //       ) : (
// //         <Button
// //           variant="outline"
// //           onClick={() => handleNavigate("/auth/login")}
// //           size="mustafa"
// //           className="inline-flex items-center w-full lg:w-auto justify-center"
// //         >
// //           <LogIn className="mr-2 h-5 w-5" />
// //           Giriş Yap
// //         </Button>
// //       )}
// //     </div>
// //   );
// // }

// // function ShoppingHeader() {
// //   const navigate = useNavigate();
// //   const { isAuthenticated, user } = useSelector((state) => state.auth);

// //   return (
// //     <header className="sticky top-0 z-40 w-full border-b bg-background">
// //       <div className="flex h-16 items-center justify-between px-4 md:px-6">
// //         <Link to="/shop/home" className="flex items-center gap-2 mr-4">
// //           <span className="">
// //             <img
// //               className="w-32 md:w-40"
// //               src="../src/assets/dlogo2.png"
// //               alt="logo"
// //             />
// //           </span>
// //         </Link>

// //         <div className="hidden lg:flex flex-1 justify-center">
// //           <MenuItems />
// //         </div>

// //         <div className="lg:hidden flex items-center ml-auto">
// //           {isAuthenticated && user ? (
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Avatar className="h-8 w-8 cursor-pointer border hover:border-gray-400">
// //                   <AvatarFallback className="text-sm bg-gray-200 text-black font-bold">
// //                     {user.userName && user.userName.length > 0
// //                       ? user.userName[0].toUpperCase()
// //                       : "?"}
// //                   </AvatarFallback>
// //                 </Avatar>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent side="bottom" align="end" className="w-48">
// //                 <DropdownMenuLabel className="text-xs px-2 py-1.5">
// //                   Merhaba, {user.userName}
// //                 </DropdownMenuLabel>
// //                 <DropdownMenuSeparator />
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           ) : (
// //             <Button
// //               variant="outline"
// //               onClick={() => navigate("/auth/login")}
// //               size="mustafa"
// //               className="inline-flex items-center"
// //             >
// //               <LogIn className="mr-2 h-5 w-5" />
// //               Giriş Yap
// //             </Button>
// //           )}
// //         </div>

// //         <div className="hidden lg:block ml-auto">
// //           <HeaderRightContent />
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }

// // export default ShoppingHeader;

// // MenuItems.propTypes = {
// //   isMobile: PropTypes.bool,
// //   closeSheet: PropTypes.func,
// // };

// // HeaderRightContent.propTypes = {
// //   closeSheet: PropTypes.func,
// // };

// import { Heart, LogIn, LogOut, ShoppingCart, UserCog } from "lucide-react";
// import {
//   Link,
//   useLocation,
//   useNavigate,
//   useSearchParams,
// } from "react-router-dom";
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
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
// import { Sheet, SheetTrigger } from "../ui/sheet";
// import { useEffect, useState, useMemo } from "react";
// import { fetchCartItems } from "@/store/shop/cart-slice";
// import { Label } from "../ui/label";
// import { toast } from "../ui/use-toast";
// import { fetchAllCategories } from "@/store/common-slice/categories-slice";
// import { Skeleton } from "@/components/ui/skeleton";
// import PropTypes from "prop-types";

// // MenuItems bileşeni artık sadece dinamik kategori linklerini yönetecek
// function DynamicCategoryMenuItems() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const dispatch = useDispatch();

//   const { categoryList = [], isLoading: categoriesLoading } = useSelector(
//     (state) => state.categories || { categoryList: [], isLoading: false }
//   );

//   useEffect(() => {
//     if (!categoryList.length) {
//       dispatch(fetchAllCategories());
//     }
//   }, [dispatch, categoryList.length]);

//   function handleNavigate(categorySlug) {
//     // categorySlug artık null olamaz, hep bir kategoriye gidilecek
//     sessionStorage.removeItem("filters");
//     const currentFilter = { category: [categorySlug] };
//     sessionStorage.setItem("filters", JSON.stringify(currentFilter));

//     if (location.pathname.includes("/shop/listing")) {
//       setSearchParams(new URLSearchParams(`?category=${categorySlug}`));
//     } else {
//       navigate(`/shop/listing?category=${categorySlug}`);
//     }
//   }

//   const dynamicCategoryItems = useMemo(() => {
//     return categoryList
//       .filter((cat) => cat.isActive)
//       .map((cat) => ({
//         id: cat.slug,
//         label: cat.name,
//         path: `/shop/listing?category=${cat.slug}`, // Path artık kullanılmayabilir, handleNavigate var
//         isCategory: true, // Bu hala handleNavigate için önemli
//       }));
//   }, [categoryList]);

//   return (
//     <nav className="flex items-center gap-x-4 md:gap-x-6">
//       {" "}
//       {/* Yatayda boşluklar ayarlandı */}
//       {categoriesLoading ? (
//         <>
//           <Skeleton className="h-5 w-16" />
//           <Skeleton className="h-5 w-24" />
//           <Skeleton className="h-5 w-20" />
//           {/* Daha fazla skeleton eklenebilir */}
//         </>
//       ) : (
//         dynamicCategoryItems.map((menuItem) => (
//           <Label
//             onClick={() => handleNavigate(menuItem.id)} // Direkt slug'ı gönderiyoruz
//             className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
//             key={menuItem.id}
//           >
//             {menuItem.label}
//           </Label>
//         ))
//       )}
//     </nav>
//   );
// }
// // DynamicCategoryMenuItems için PropTypes eklenebilir (eğer prop alıyorsa)

// // Sağ taraftaki statik linkler (Ara, Tüm Ürünler) için ayrı bir bileşen
// function StaticRightMenuItems() {
//   const navigate = useNavigate();
//   const staticLinks = [
//     { id: "products", label: "Tüm Ürünler", path: "/shop/listing" },
//     { id: "search", label: "Ara", path: "/shop/search" },
//   ];

//   return (
//     <nav className="flex items-center gap-x-3 md:gap-x-4">
//       {" "}
//       {/* Yatayda boşluklar ayarlandı */}
//       {staticLinks.map((link) => (
//         <Button
//           variant="ghost" // Buton olarak daha iyi görünebilir
//           size="sm"
//           onClick={() => navigate(link.path)}
//           className="text-sm font-medium text-muted-foreground hover:text-primary px-2 md:px-3"
//           key={link.id}
//         >
//           {link.label}
//         </Button>
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
//           variant: "success",
//         });
//       })
//       .catch((error) => {
//         console.error("Shop logout failed:", error);
//         toast({
//           variant: "destructive",
//           title: "Çıkış yapılamadı.",
//         });
//       });
//   }

//   function handleNavigate(path) {
//     navigate(path);
//   }

//   useEffect(() => {
//     if (isAuthenticated && user?.id && !cartItems?.items?.length) {
//       dispatch(fetchCartItems(user.id));
//     }
//   }, [dispatch, user?.id, isAuthenticated, cartItems?.items?.length]);

//   const uniqueProductCount = cartItems?.items
//     ? new Set(cartItems.items.map((item) => item.productId)).size
//     : 0;

//   return (
//     <div className="flex items-center gap-2 md:gap-3">
//       <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
//         <SheetTrigger asChild>
//           <Button
//             variant="ghost" // İkon butonları için 'ghost' daha uygun
//             size="icon"
//             className="relative p-1" // Padding ayarlandı
//           >
//             <ShoppingCart className="w-16 h-16 " />
//             {isAuthenticated && uniqueProductCount > 0 && (
//               <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-red-600 text-white text-[10px] rounded-full px-1.5 py-0.5 leading-tight font-bold">
//                 {uniqueProductCount}
//               </span>
//             )}
//             <span className="sr-only">Sepetim</span>
//           </Button>
//         </SheetTrigger>
//         <UserCartWrapper
//           setOpenCartSheet={setOpenCartSheet}
//           cartItems={
//             isAuthenticated && cartItems?.items?.length > 0
//               ? cartItems.items
//               : []
//           }
//         />
//       </Sheet>

//       {isAuthenticated && (
//         <Button
//           onClick={() => handleNavigate("/shop/account")}
//           variant="ghost" // Siparişlerim için de ghost olabilir veya outline
//           size="sm" // Daha kompakt
//           className="relative hidden lg:inline-flex px-2 md:px-3 text-muted-foreground hover:text-primary"
//         >
//           Siparişlerim
//         </Button>
//       )}

//       {isAuthenticated && user ? (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Avatar className="h-8 w-8 cursor-pointer border hover:opacity-80">
//               <AvatarFallback className="bg-muted text-sm font-semibold">
//                 {user.userName && user.userName.length > 0
//                   ? user.userName[0].toUpperCase()
//                   : "?"}
//               </AvatarFallback>
//             </Avatar>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent side="bottom" align="end" className="w-56">
//             <DropdownMenuLabel>Merhaba, {user.userName}</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => handleNavigate("/shop/account")}>
//               <UserCog className="mr-2 h-4 w-4" />
//               Hesabım
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => handleNavigate("/shop/wishlist")}>
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
//         <Button
//           variant="outline"
//           onClick={() => handleNavigate("/auth/login")}
//           size="sm"
//           className="inline-flex items-center px-2 md:px-3"
//         >
//           <LogIn className="mr-1.5 h-4 w-4" />
//           Giriş
//         </Button>
//       )}
//     </div>
//   );
// }
// HeaderRightContent.propTypes = {
//   /* Proplar varsa eklenecek */
// };

// function ShoppingHeader() {
//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-background">
//       <div className="flex h-16 items-center justify-between px-4 md:px-6">
//         {/* Logo (Sola Yaslı) */}
//         <Link to="/shop/home" className="flex items-center gap-2">
//           {" "}
//           {/* mr-auto kaldırıldı */}
//           <span className="">
//             <img
//               className="w-32 md:w-40"
//               src="/src/assets/dlogo2.png" // Bu yolu projenize göre doğrulayın
//               alt="logo"
//             />
//           </span>
//         </Link>

//         {/* Dinamik Kategori Menüsü (Ortada, sadece masaüstünde) */}
//         <div className="hidden lg:flex flex-1 justify-center">
//           <DynamicCategoryMenuItems />
//         </div>

//         {/* Sağ Bölüm: Statik Linkler (Ara, Tüm Ürünler) ve HeaderRightContent (Sepet, Avatar/Giriş) */}
//         <div className="flex items-center gap-2 md:gap-4 ml-auto">
//           <div className="hidden lg:flex">
//             <StaticRightMenuItems />
//           </div>
//           {/* Sepet, Avatar/Giriş (Her zaman görünür) */}
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
  ShoppingCart,
  UserCog,
  Search,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input"; // Arama çubuğu için
import { useDispatch, useSelector } from "react-redux";
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
import { Sheet, SheetTrigger } from "../ui/sheet";
import { useEffect, useState, useMemo } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllCategories } from "@/store/common-slice/categories-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "../ui/use-toast";
import PropTypes from "prop-types";
import OrderTrackingModal from "./OrderTrackingModal";

// Kategori Menüsü (Header'ın Alt Satırı İçin)
function CategorySubMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { categoryList = [], isLoading: categoriesLoading } = useSelector(
    (state) => state.categories || { categoryList: [], isLoading: false }
  );

  useEffect(() => {
    if (!categoryList.length) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, categoryList.length]);

  function handleNavigateToCategory(categorySlug) {
    sessionStorage.removeItem("filters");
    const currentFilter = { category: [categorySlug] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("/shop/listing")) {
      setSearchParams(new URLSearchParams(`?category=${categorySlug}`));
    } else {
      navigate(`/shop/listing?category=${categorySlug}`);
    }
  }

  const activeCategories = useMemo(() => {
    return categoryList
      .filter((cat) => cat.isActive)
      .map((cat) => ({
        id: cat.slug,
        label: cat.name,
      }));
  }, [categoryList]);

  if (categoriesLoading) {
    return (
      <div className="flex items-center gap-x-3 md:gap-x-4 overflow-x-auto no-scrollbar px-4 md:px-6 h-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-20 rounded" />
        ))}
      </div>
    );
  }

  if (!activeCategories.length) {
    return <div className="h-10 border-t"></div>; // Kategori yoksa boş bir satır (tasarıma göre ayarlanabilir)
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-4 overflow-x-auto no-scrollbar px-4 md:px-6 h-10 bg-muted/30 dark:bg-muted/10">
      {activeCategories.map((category) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleNavigateToCategory(category.id)}
          className="text-sm font-medium text-muted-foreground hover:text-primary px-2 whitespace-nowrap"
          key={category.id}
        >
          {category.label}
        </Button>
      ))}
    </nav>
  );
}

// Sağ Üst Köşe İkonları ve Linkler (Hesabım, Sepetim)
function MainHeaderActions() {
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
        toast({ title: "Çıkış yapıldı", variant: "success" });
      })
      .catch((error) => {
        console.error("Shop logout failed:", error);
        toast({ variant: "destructive", title: "Çıkış yapılamadı." });
      });
  }

  // useEffect(() => {
  //   if (isAuthenticated && user?.id && !cartItems?.items?.length) {
  //     dispatch(fetchCartItems(user.id));
  //   }
  // }, [dispatch, user?.id, isAuthenticated, cartItems?.items?.length]);

  // const uniqueProductCount = cartItems?.items
  //   ? new Set(cartItems.items.map((item) => item.productId)).size
  //   : 0;
  useEffect(() => {
    // Bu effect App.jsx'e taşındığı için burada tekrar çağrılmasına gerek olmayabilir.
    // Eğer App.jsx'teki sepet yönetimi yeterliyse bu bloğu kaldırabilirsiniz.
    // Değilse, aşağıdaki gibi bırakabilirsiniz:
    if (isAuthenticated && user?.id) {
      // console.log("Header: Authenticated, fetching cart for user:", user.id);
      // dispatch(fetchCartItems(user.id)); // Giriş yapmış kullanıcı için
    } else if (!isAuthenticated) {
      // console.log("Header: Guest, fetching/initializing cart from localStorage");
      // dispatch(fetchCartItems()); // Misafir kullanıcı için (userId olmadan)
    }
  }, [dispatch, user?.id, isAuthenticated]); // cartItems?.items?.length bağımlılığını kaldırdım, gereksiz döngüye neden olabilir.
  // isAuthenticated ve user?.id yeterli olmalı.
  // ...
  const uniqueProductCount = cartItems?.items
    ? new Set(cartItems.items.map((item) => item.productId)).size // productId string veya obje olabilir, dikkat.
    : 0;

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {/* Hesabım / Giriş Yap */}
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 md:px-3 py-1.5 h-auto"
            >
              <Avatar className="h-7 w-7 md:h-8 md:w-8 border">
                <AvatarFallback className="bg-muted text-xs md:text-sm font-semibold">
                  {user.userName && user.userName.length > 0
                    ? user.userName[0].toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-xs text-muted-foreground">Hesabım</span>
                <span className="text-sm font-medium line-clamp-1">
                  {user.userName}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-56">
            <DropdownMenuLabel>Merhaba, {user.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Hesabım & Siparişlerim
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
        <Button
          variant="ghost"
          onClick={() => navigate("/auth/login")}
          className="flex flex-col items-center px-2 md:px-3 py-1 h-auto"
        >
          <LogIn className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
          <span className="text-xs mt-0.5 text-muted-foreground">
            Giriş Yap
          </span>
        </Button>
      )}

      {/* Sepetim */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            className="flex items-center gap-2 px-3 md:px-4 py-2 h-auto max-lg:hidden"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden md:inline text-sm font-medium">
              Sepetim
            </span>
            {uniqueProductCount > 0 && (
              <span className=" bg-red-500 text-primary-foreground text-xs rounded-full px-2 py-1 font-bold">
                {uniqueProductCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            isAuthenticated && cartItems?.items?.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
    </div>
  );
}

function TopStrip() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // handleOrdersClick fonksiyonunu stripLinks'ten ÖNCE tanımlayın
  const handleOrdersClick = (e) => {
    if (isAuthenticated) {
      navigate("/shop/account");
    } else {
      e.preventDefault();
      setIsTrackingModalOpen(true);
    }
  };

  const stripLinks = [
    {
      id: "orders",
      label: "Siparişlerim",
      path: "/shop/account",
      action: handleOrdersClick, // Şimdi handleOrdersClick tanımlı
    },
    {
      id: "super-price",
      label: "Süper Fiyat",
      path: "/shop/listing?tag=super-fiyat",
    },
    {
      id: "campaigns",
      label: "Kampanyalar",
      path: "/shop/listing?tag=kampanya",
    },
  ];

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-800 text-xs text-muted-foreground hidden lg:block">
        <div className="container mx-auto px-4 md:px-20 h-8 flex justify-end items-center gap-x-4 md:gap-x-6">
          {stripLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              onClick={link.action}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
    </>
  );
}
function ShoppingHeader() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const keywordFromUrl = searchParams.get("keyword");
    if (keywordFromUrl) {
      setSearchTerm(keywordFromUrl);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Formun varsayılan submit davranışını engelle
    if (searchTerm.trim()) {
      navigate(`/shop/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      {/* En Üst İnce Şerit (Sadece masaüstü için) */}
      <TopStrip />

      {/* Ana Header Satırı */}
      <div className="container mx-auto px-4 md:px-20">
        <div className="flex h-20 items-center justify-between gap-4 md:gap-6">
          {/* Logo */}
          <Link to="/shop/home" className="flex-shrink-0">
            <img
              className="h-10 md:h-12 w-auto" // Boyut ayarlandı
              src="/src/assets/dlogo2.png"
              alt="logo"
            />
          </Link>

          {/* Arama Çubuğu (Ortada ve Esnek) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-grow mx-4 min-w-0 max-w-2xl"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground max-lg:hidden" />
              <Input
                type="search"
                placeholder="Ürün, kategori veya marka ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md bg-muted pl-10 pr-4 py-2.5 h-11 text-sm border-transparent focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary max-lg:hidden"
              />
              <button type="submit" className="hidden"></button>
            </div>
          </form>

          {/* Sağdaki Aksiyonlar (Hesabım, Sepetim) */}
          <div className="flex-shrink-0">
            <MainHeaderActions />
          </div>
        </div>
      </div>
      {/* Arama Çubuğu (Sadece Küçük Ekranlarda Ayrı Satırda) */}
      <div className="lg:hidden px-4 pb-1 pt-1 border-t dark:border-gray-700">
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ne aramıştınız?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md bg-muted/70 dark:bg-muted/30 pl-10 pr-4 py-2 h-10 text-sm border-transparent focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary"
            />
          </div>
        </form>
      </div>

      {/* Kategori Menü Satırı (Sadece masaüstünde header'ın altında) */}
      <div className="hidden lg:block border-t border-border">
        <CategorySubMenu />
      </div>
    </header>
  );
}

export default ShoppingHeader;
