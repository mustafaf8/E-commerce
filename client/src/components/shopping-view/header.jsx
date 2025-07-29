import {
  Heart,
  LogIn,
  LogOut,
  ShoppingCart,
  UserCog,
  Search,
  ChevronDown,
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { useEffect, useState, useMemo, Fragment } from "react";
import { fetchAllCategories } from "@/store/common-slice/categories-slice";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "../ui/use-toast";
import OrderTrackingModal from "./OrderTrackingModal";
import api from "@/api/axiosInstance";
import { useRef } from "react";
import PropTypes from "prop-types";

// Hover ile açılır menü bileşeni
const HoverMenu = ({ children, trigger, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms gecikme ile kapat
  };

  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full left-0 z-50 min-w-[220px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 transform transition-all duration-300 ease-out opacity-100 translate-y-0 scale-100"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Hover menü öğesi
const HoverMenuItem = ({ children, onClick, className = "" }) => {
  return (
    <div
      className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 text-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Hover alt menü bileşeni
const HoverSubMenu = ({ children, trigger, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const subMenuRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const handleSubMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleSubMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      {isOpen && (
        <div 
          ref={subMenuRef}
          className="absolute left-full top-0 z-50 min-w-[220px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 transform transition-all duration-300 ease-out opacity-100 translate-x-0 scale-100"
          onMouseEnter={handleSubMenuMouseEnter}
          onMouseLeave={handleSubMenuMouseLeave}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Recursive (Özyineli) Menü Bileşeni
const RecursiveMenuItem = ({ category, handleNavigate }) => {
  // Eğer kategorinin alt dalları varsa, bir alt menü oluştur
  if (category.children && category.children.length > 0) {
    return (
      <div className="dropdown-hover relative">
        <div className="category-menu-item px-4 py-3 cursor-pointer text-sm flex items-center justify-between">
          <span>{category.name}</span>
          <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
        </div>
        <div className="dropdown-content absolute left-full top-0 z-50 min-w-[220px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2">
          {/* "Tümünü Gör" linki, ana dala gitmek için */}
          <div 
            className="submenu-item px-4 py-3 cursor-pointer text-sm"
            onClick={() => handleNavigate(category.slug)}
          >
            Tüm {category.name}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          {/* Alt dalları için kendini tekrar çağır */}
          {category.children.map((child) => (
            <RecursiveMenuItem
              key={child._id}
              category={child}
              handleNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>
    );
  }

  // Eğer alt dalı yoksa, direkt tıklanabilir bir menü öğesi oluştur
  return (
    <div 
      className="submenu-item px-4 py-3 cursor-pointer text-sm"
      onClick={() => handleNavigate(category.slug)}
    >
      {category.name}
    </div>
  );
};

RecursiveMenuItem.propTypes = {
  category: PropTypes.object.isRequired,
  handleNavigate: PropTypes.func.isRequired,
};

function CategorySubMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryList = [], isLoading: categoriesLoading } = useSelector(
    (state) => state.categories || {}
  );

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleNavigate = (slug) => {
    navigate(`/shop/listing?category=${slug}`);
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center gap-x-3 md:gap-x-4 h-10 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-24 rounded" />
        ))}
      </div>
    );
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-x-1 md:gap-x-2 h-12 bg-muted/30 dark:bg-muted/10">
      {categoryList.map((category) =>
        category.children && category.children.length > 0 ? (
          // Ana Kategori (Alt dalları var) - Hover menü
          <HoverMenu
            key={category._id}
            trigger={
              <Button
                variant="mustafa"
                size="mustafa"
                className="text-sm font-medium text-muted-foreground hover:text-primary px-2 whitespace-nowrap flex items-center gap-1"
              >
                {category.name}
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </Button>
            }
          >
            {/* Ana kategorinin kendisine gitmek için link */}
            <div 
              className="category-menu-item px-4 py-3 cursor-pointer text-sm"
              onClick={() => handleNavigate(category.slug)}
            >
              Tüm {category.name}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            {/* Alt dallar için recursive bileşeni çağır */}
            {category.children.map((subCategory) => (
              <RecursiveMenuItem
                key={subCategory._id}
                category={subCategory}
                handleNavigate={handleNavigate}
              />
            ))}
          </HoverMenu>
        ) : (
          // Tekil Ana Kategori (Alt dalı yok)
          <Button
            key={category._id}
            variant="mustafa"
            size="mustafa"
            onClick={() => handleNavigate(category.slug)}
            className="text-sm font-medium text-muted-foreground hover:text-primary px-2 whitespace-nowrap"
          >
            {category.name}
          </Button>
        )
      )}
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
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    // Kur bilgisini çek
    api
      .get("/common/currency/rate")
      .then((response) => {
        if (response.data.success) {
          setExchangeRate(response.data.data.rate);
        }
      })
      .catch((error) => {
        console.error("Döviz kuru alınırken hata oluştu:", error);
      });
  }, []); // Sadece bileşen ilk yüklendiğinde çalışır

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
      <div className="bg-gray-100 dark:bg-gray-800 text-xs text-muted-foreground max-[690px]:text-[10px]">
        <div className="container mx-auto px-4 md:px-20 h-8 flex justify-between items-center">
          {/* Sol Taraf (Boşluk veya Başka Bir Şey) */}
          <div></div>

          {/* Orta ve Sağ Taraf Linkler */}
          <div className="flex items-center gap-x-4 md:gap-x-6">
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
            {exchangeRate && (
              <span className="font-semibold text-primary">
                1 USD = {Number(exchangeRate).toFixed(2)} TL
              </span>
            )}
          </div>
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
