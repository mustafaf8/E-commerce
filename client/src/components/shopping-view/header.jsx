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
import { Input } from "../ui/input";
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
import api from "@/api/axiosInstance";
import { useRef } from "react";

// Kategori Menüsü (Header'ın Alt Satırı İçin)
function CategorySubMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
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
    return <div className="h-10 border-t"></div>;
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
        navigate("/shop/home");
        toast({ title: "Çıkış yapıldı", variant: "success" });
      })
      .catch((error) => {
        // console.error("Shop logout failed:", error);
        toast({ variant: "destructive", title: "Çıkış yapılamadı." });
      });
  }

  const uniqueProductCount = cartItems?.items
    ? new Set(cartItems.items.map((item) => item.productId)).size
    : 0;

  return (
    <div className="flex items-center gap-3 md:gap-4">
      {isAuthenticated && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="mustafa"
              size="mustafa"
              className="flex items-center gap-2 px-2 md:px-3 py-1.5 h-auto"
            >
              <Avatar className="h-8 w-8 border">
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
              {/* Sadece küçük ekranlarda görünen bölüm (MD altı) */}
              <div className="md:hidden">
                <span className="text-sm font-medium line-clamp-1">
                  {user.userName.split(" ")[0]}
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
          className="flex items-center gap-2 px-3 md:px-4 py-2 h-auto "
        >
          <LogIn className="h-5 w-5 md:h- md:w-4 text-primary" />
          <span className="md:inline text-sm font-medium">Giriş Yap</span>
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
      path: "/shop/campaigns",
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
  const [suggestions, setSuggestions] = useState({
    products: [],
    categories: [],
    brands: [],
  });
  const [showSuggest, setShowSuggest] = useState(false);
  const [activeInput, setActiveInput] = useState(""); // 'desktop' veya 'mobile'
  const debounceRef = useRef();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const keywordFromUrl = searchParams.get("keyword");
    if (keywordFromUrl) {
      setSearchTerm(keywordFromUrl);
    } else {
      setSearchTerm("");
    }
  }, [searchParams]);

  const fetchSuggestions = (keyword) => {
    if (!keyword) {
      setSuggestions({ products: [], categories: [], brands: [] });
      return;
    }
    api
      .get(`/shop/search/suggest?keyword=${encodeURIComponent(keyword)}`)
      .then((resp) => {
        if (resp.data?.success) {
          setSuggestions(resp.data.data);
        }
      })
      .catch(() => {});
  };

  const handleSearchChange = (e, inputType) => {
    const value = e.target.value;
    setSearchTerm(value);
    setActiveInput(inputType);
    clearTimeout(debounceRef.current);
    if (value.trim() === "") {
      setShowSuggest(false);
      setSuggestions({ products: [], categories: [], brands: [] });
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value.trim());
      setShowSuggest(true);
    }, 300);
  };

  const handleSuggestionClick = (path) => {
    setShowSuggest(false);
    setSearchTerm("");
    navigate(path);
  };

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
          <Link to="/shop/home" className="flex-shrink-0">
            <img
              className="h-36 w-36 max-[690px]:h-24 max-[690px]:w-24 "
              src="/dlogo2.png"
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
                onChange={(e) => handleSearchChange(e, "desktop")}
                className="w-full rounded-md bg-muted pl-10 pr-4 py-2.5 h-11 text-sm border-transparent focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary max-md:hidden"
              />
              {/* Suggestions Dropdown - Sadece desktop için */}
              {showSuggest &&
                activeInput === "desktop" &&
                (suggestions.products.length > 0 ||
                  suggestions.categories.length > 0 ||
                  suggestions.brands.length > 0) && (
                  <div className="absolute z-50 mt-1 w-full bg-background border shadow-lg rounded-md max-h-80 overflow-y-auto ">
                    {suggestions.products.map((p) => (
                      <div
                        key={`prod-${p._id}`}
                        className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() =>
                          handleSuggestionClick(
                            `/shop/search?keyword=${encodeURIComponent(
                              p.title
                            )}`
                          )
                        }
                      >
                        Ürün: {p.title}
                      </div>
                    ))}
                    {suggestions.categories.map((c) => (
                      <div
                        key={`cat-${c.slug}`}
                        className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() =>
                          handleSuggestionClick(
                            `/shop/listing?category=${c.slug}`
                          )
                        }
                      >
                        Kategori: {c.name}
                      </div>
                    ))}
                    {suggestions.brands.map((b) => (
                      <div
                        key={`brand-${b.slug}`}
                        className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() =>
                          handleSuggestionClick(`/shop/listing?brand=${b.slug}`)
                        }
                      >
                        Marka: {b.name}
                      </div>
                    ))}
                  </div>
                )}
              <button type="submit" className="hidden"></button>
            </div>
          </form>
          <div className="flex-shrink-0">
            <MainHeaderActions />
          </div>
        </div>
      </div>
      {/* Arama Çubuğu (Sadece Küçük Ekranlarda Ayrı Satırda) */}
      <div className="lg:hidden md:hidden px-4 pb-1 pt-1 border-t dark:border-gray-700">
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ne aramıştınız?"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e, "mobile")}
              className="w-full rounded-md bg-muted/70 dark:bg-muted/30 pl-10 pr-4 py-2 h-10 text-sm border-transparent focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary"
            />
            {/* Suggestions Dropdown - Sadece mobile için */}
            {showSuggest &&
              activeInput === "mobile" &&
              (suggestions.products.length > 0 ||
                suggestions.categories.length > 0 ||
                suggestions.brands.length > 0) && (
                <div className="absolute z-50 mt-1 w-full bg-background border shadow-lg rounded-md max-h-80 overflow-y-auto">
                  {suggestions.products.map((p) => (
                    <div
                      key={`prod-${p._id}`}
                      className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() =>
                        handleSuggestionClick(
                          `/shop/search?keyword=${encodeURIComponent(p.title)}`
                        )
                      }
                    >
                      Ürün: {p.title}
                    </div>
                  ))}
                  {suggestions.categories.map((c) => (
                    <div
                      key={`cat-${c.slug}`}
                      className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() =>
                        handleSuggestionClick(
                          `/shop/listing?category=${c.slug}`
                        )
                      }
                    >
                      Kategori: {c.name}
                    </div>
                  ))}
                  {suggestions.brands.map((b) => (
                    <div
                      key={`brand-${b.slug}`}
                      className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() =>
                        handleSuggestionClick(`/shop/listing?brand=${b.slug}`)
                      }
                    >
                      Marka: {b.name}
                    </div>
                  ))}
                </div>
              )}
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
