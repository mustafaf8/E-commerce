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
import { fetchAllCategories } from "@/store/common-slice/categories-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "../ui/use-toast";
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
      <div className="flex items-center justify-center gap-x-3 md:gap-x-4 overflow-x-auto no-scrollbar px-4 md:px-6 h-10">
        {Array.from({ length: 10 }).map((_, i) => (
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
        variant="mustafa"
        size="mustafa"
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

  useEffect(() => {
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
    ? new Set(cartItems.items.map((item) => item.productId)).size
    : 0;

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="mustafa"
              className="flex items-center gap-2 px-2 md:px-3 py-1.5 h-auto"
            >
            <Avatar className="h-7 w-7 md:h-8 md:w-8 border">
                <AvatarFallback className="bg-secondary text-xs md:text-sm font-semibold text-primary">
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
         onClick={() => navigate("/auth/login")}
         variant="secondary"
         className="flex items-center gap-2 px-3 md:px-4 py-2 h-auto max-lg:hidden"
       >
        <LogIn className="h-5 w-5 md:h- md:w-4 text-primary" />
         <span className="hidden md:inline text-sm font-medium">
         Giriş Yap
         </span>
       
       </Button>
      )}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            className="flex items-center gap-2 px-3 md:px-4 py-2 h-auto max-lg:hidden"
          >
            <ShoppingCart className="w-5 h-5" />
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
      action: handleOrdersClick,
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
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
      <TopStrip />
      <div className="container mx-auto px-4 md:px-20">
        <div className="flex h-20 items-center justify-between gap-4 md:gap-6">
          {/* Logo */}
          <Link to="/shop/home" className="flex-shrink-0">
            <img
              className="h-10 md:h-12 w-auto"
              src="/src/assets/dlogo2.png"
              alt="logo"
            />
          </Link>
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
