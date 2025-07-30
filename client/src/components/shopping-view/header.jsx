import {
  LogIn,
  LogOut,
  ShoppingCart,
  UserCog,
  Search,
  ChevronDown,
  Heart
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
  DropdownMenuPortal,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
    }, 50);
  };

  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 50);
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
          className="absolute top-full left-0 z-[99999999] min-w-[220px] max-w-[280px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          {children}
        </div>
      )}
    </div>
  );
};



// Recursive (Özyineli) Menü Bileşeni
const RecursiveMenuItem = ({ category, handleNavigate }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSubMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSubMenuOpen(false);
    }, 10);
  };

  const handleSubMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleSubMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsSubMenuOpen(false);
    }, 10);
  };

  // Eğer kategorinin alt dalları varsa, bir alt menü oluştur
  if (category.children && category.children.length > 0) {
    return (
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="category-menu-item px-4 py-3 cursor-pointer text-sm flex items-center justify-between">
          <span className="break-words flex-1">{category.name}</span>
          <ChevronDown className="h-4 w-4 rotate-[-90deg] flex-shrink-0 ml-2" />
        </div>
        {isSubMenuOpen && (
          <div 
            className="absolute left-full top-0 z-[99999999] min-w-[220px] max-w-[280px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2"
            onMouseEnter={handleSubMenuMouseEnter}
            onMouseLeave={handleSubMenuMouseLeave}
          >
            {/* "Tümünü Gör" linki, ana dala gitmek için */}
            <div 
              className="submenu-item px-4 py-3 cursor-pointer text-sm"
              onClick={() => handleNavigate(category.slug)}
            >
              <span className="break-words">Tüm {category.name}</span>
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
        )}
      </div>
    );
  }

  // Eğer alt dalı yoksa, direkt tıklanabilir bir menü öğesi oluştur
  return (
    <div 
      className="submenu-item px-4 py-3 cursor-pointer text-sm"
      onClick={() => handleNavigate(category.slug)}
    >
      <span className="break-words">{category.name}</span>
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
    <nav className="flex items-center justify-center gap-x-1 md:gap-x-2 min-h-12  dark:bg-muted/10 overflow-x-auto px-2 category-menu-container relative z-[99999999] bg-background">
      {categoryList.map((category) =>
        category.children && category.children.length > 0 ? (
          // Ana Kategori (Alt dalları var) - Hover menü
          <HoverMenu
            key={category._id}
            trigger={
              <Button
                variant="mustafa"
                size="mustafa"
                className="text-sm font-medium text-muted-foreground hover:text-primary px-2 whitespace-normal flex items-center gap-1 min-w-0 max-w-32 text-center h-auto py-2"
              >
                <span className="break-words">{category.name}</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 flex-shrink-0" />
              </Button>
            }
          >
            {/* Ana kategorinin kendisine gitmek için link */}
            <div 
              className="category-menu-item px-4 py-3 cursor-pointer text-sm"
              onClick={() => handleNavigate(category.slug)}
            >
              <span className="break-words">Tüm {category.name}</span>
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
            className="text-sm font-medium text-muted-foreground hover:text-primary px-2 whitespace-normal min-w-0 max-w-32 text-center h-auto py-2"
          >
            <span className="break-words">{category.name}</span>
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
          <DropdownMenuPortal>
            <DropdownMenuContent side="bottom" align="end" className="w-56 z-[9999999999]">
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
          </DropdownMenuPortal>
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
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState({
    products: [],
    categories: [],
    brands: [],
  });
  const [showSuggest, setShowSuggest] = useState(false);
  const [activeInput, setActiveInput] = useState("");
  const debounceRef = useRef();
  const [searchParams] = useSearchParams();
  
  // Account, wishlist ve checkout sayfalarında kategori menüsünü gizle
  const shouldShowCategoryMenu = !location.pathname.includes('/shop/account') && !location.pathname.includes('/shop/wishlist') && !location.pathname.includes('/shop/checkout') && !location.pathname.includes('/shop/campaigns');

  // Portal dışına tıklandığında ve ESC tuşu ile suggestions'ı kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Eğer suggestions açıksa ve tıklanan element suggestions içinde değilse
      if (showSuggest && !event.target.closest('.search-suggestions-portal')) {
        setShowSuggest(false);
        setSuggestions({ products: [], categories: [], brands: [] });
      }
    };

    const handleKeyDown = (event) => {
      // ESC tuşu ile kapat
      if (event.key === 'Escape' && showSuggest) {
        setShowSuggest(false);
        setSuggestions({ products: [], categories: [], brands: [] });
      }
    };

    // Event listener'ları ekle
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSuggest]);

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
    <header className="sticky top-0 z-[99999999] w-full border-b bg-background shadow-sm">
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
                  suggestions.brands.length > 0) &&
                createPortal(
                  <div className="search-suggestions-portal fixed z-[9999999999] bg-background border shadow-lg rounded-md max-h-80 overflow-y-auto" style={{
                    top: '100px',
                    left: 'calc(50% - 320px)',
                    width: '600px',
                    maxWidth: '90vw'
                  }}>
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
                        {p.title}
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
                        {c.name}
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
                        {b.name}
                      </div>
                    ))}
                  </div>,
                  document.body
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
                suggestions.brands.length > 0) &&
              createPortal(
                <div className="search-suggestions-portal fixed z-[9999999999] bg-background border shadow-lg rounded-md max-h-80 overflow-y-auto" style={{
                  top: '160px',
                  left: '20px',
                  right: '20px',
                  width: 'calc(100vw - 40px)'
                }}>
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
                      {p.title}
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
                      {c.name}
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
                      {b.name}
                    </div>
                  ))}
                </div>,
                document.body
              )}
          </div>
        </form>
      </div>

      {/* Kategori Menü Satırı (Sadece masaüstünde header'ın altında) */}
      {shouldShowCategoryMenu && (
        <div className="hidden lg:block border-t border-border relative z-[99999999]">
          <CategorySubMenu />
        </div>
      )}
    </header>
  );
}

export default ShoppingHeader;
