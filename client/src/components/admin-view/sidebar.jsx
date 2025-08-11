import React from "react";
import {
  BadgeCheck,
  ChartNoAxesCombined,
  Home,
  LayoutGrid,
  ShoppingBasket,
  Ticket,
  Wrench,
  Users,
  Menu,
  MessageSquare,
  FileText,
  Megaphone,
  Star,
  BarChart3,
  Shield,
  Cog,
  ChevronDown,
  FileText as LogIcon,
} from "lucide-react";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import PropTypes from "prop-types";

// Menü grupları tanımı
const menuGroups = [
  {
    id: "panel",
    title: "Panel",
    icon: <BarChart3 size={18} />,
    items: [
      {
        id: "stats",
        label: "Panel",
        path: "/admin/stats",
        icon: <BarChart3 size={16} />,
      },
    ],
  },
  {
    id: "catalog",
    title: "Katalog",
    icon: <ShoppingBasket size={18} />,
    items: [
      {
        id: "products",
        label: "Ürünler",
        path: "/admin/products",
        icon: <ShoppingBasket size={16} />,
      },
      {
        id: "categories-brands",
        label: "Kategoriler & Markalar",
        path: "/admin/categories-brands",
        icon: <LayoutGrid size={16} />,
      },
      {
        id: "reviews",
        label: "Yorum Yönetimi",
        path: "/admin/reviews",
        icon: <Star size={16} />,
      },
    ],
  },
  {
    id: "sales",
    title: "Satışlar",
    icon: <BadgeCheck size={18} />,
    items: [
      {
        id: "orders",
        label: "Siparişler",
        path: "/admin/orders",
        icon: <BadgeCheck size={16} />,
      },
    ],
  },
  {
    id: "marketing",
    title: "Pazarlama",
    icon: <Megaphone size={18} />,
    items: [
      {
        id: "promotions",
        label: "Promosyon Yönetimi",
        path: "/admin/promotions",
        icon: <Megaphone size={16} />,
      },
      {
        id: "coupons",
        label: "Kuponlar",
        path: "/admin/coupons",
        icon: <Ticket size={16} />,
      },
    ],
  },
  {
    id: "site-management",
    title: "Site Yönetimi",
    icon: <Home size={18} />,
    items: [
      {
        id: "home-sections",
        label: "Ana Sayfa Vitrini",
        path: "/admin/home-sections",
        icon: <Home size={16} />,
      },
      {
        id: "header-management",
        label: "Header Menüsü",
        path: "/admin/header-management",
        icon: <Menu size={16} />,
      },
      {
        id: "blog",
        label: "Blog & Duyurular",
        path: "/admin/blog",
        icon: <FileText size={16} />,
      },
    ],
  },
  {
    id: "users",
    title: "Kullanıcılar",
    icon: <Users size={18} />,
    items: [
      {
        id: "users",
        label: "Tüm Kullanıcılar",
        path: "/admin/users",
        icon: <Users size={16} />,
      },
      {
        id: "messages",
        label: "Müşteri Mesajları",
        path: "/admin/messages",
        icon: <MessageSquare size={16} />,
      },
    ],
  },
  {
    id: "system",
    title: "Sistem",
    icon: <Cog size={18} />,
    items: [
      {
        id: "authorization",
        label: "Yetkilendirme",
        path: "/admin/authorization",
        icon: <Shield size={16} />,
      },
      {
        id: "settings",
        label: "Genel Ayarlar",
        path: "/admin/settings",
        icon: <Cog size={16} />,
      },
      {
        id: "maintenance",
        label: "Bakım Modu",
        path: "/admin/maintenance",
        icon: <Wrench size={16} />,
      },
      {
        id: "logs",
        label: "Log Kayıtları",
        path: "/admin/logs",
        icon: <LogIcon size={16} />,
      },
    ],
  },
];

// Menü öğesi bileşeni
function MenuItem({ item, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-secondary/80 ${
        isActive
          ? "bg-secondary text-primary shadow-sm"
          : "text-gray-600 dark:text-gray-300"
      }`}
    >
      <span className={isActive ? "text-primary" : "text-gray-500"}>
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </div>
  );
}

// Menü grubu bileşeni
function MenuGroup({ group, visibleItems, location, navigate, setOpen, expandedGroups, toggleGroup }) {
  const hasVisibleItems = group.items.some(item => 
    visibleItems.some(visibleItem => visibleItem.id === item.id)
  );

  if (!hasVisibleItems) return null;

  const isExpanded = expandedGroups.includes(group.id);
  const hasActiveItem = group.items.some(item => location.pathname === item.path);

  return (
    <div>
      <div
        onClick={() => toggleGroup(group.id)}
        className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-all duration-200 hover:bg-gray-50 ${
          hasActiveItem ? "text-primary bg-primary/5" : "text-gray-700"
        }`}
      >
        <span className={hasActiveItem ? "text-primary" : "text-gray-600"}>
          {group.icon}
        </span>
        <span className="flex-1">{group.title}</span>
        <span className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown size={16} />
        </span>
      </div>
      
      {isExpanded && (
        <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-2">
          {group.items.map((item) => {
            const isVisible = visibleItems.some(visibleItem => visibleItem.id === item.id);
            if (!isVisible) return null;

            const isActive = location.pathname === item.path;
            return (
              <MenuItem
                key={item.id}
                item={item}
                isActive={isActive}
                onClick={() => {
                  navigate(item.path);
                  setOpen ? setOpen(false) : null;
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [expandedGroups, setExpandedGroups] = useState(['panel']);

  // Görünür menü öğelerini belirle
  const getVisibleItems = () => {
    const visibleItems = [];

    menuGroups.forEach(group => {
      group.items.forEach(item => {
        if (user?.adminAccessLevel === 1 || user?.adminAccessLevel === undefined) {
          // Level 1 veya tanımlanmamış - tam erişim
          visibleItems.push(item);
        } else {
          // Alt seviyeler için izin kontrolü
          if (item.id === "categories-brands") {
            const categoriesPerms = user?.adminModulePermissions?.categories;
            const brandsPerms = user?.adminModulePermissions?.brands;
            if (categoriesPerms?.view || brandsPerms?.view) {
              visibleItems.push(item);
            }
          } else {
            // Tüm diğer modüller için doğrudan ID üzerinden kontrol
            const perms = user?.adminModulePermissions?.[item.id];
            if (perms?.view) {
              visibleItems.push(item);
            }
          }
        }
      });
    });

    return visibleItems;
  };

  const visibleItems = getVisibleItems();

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Aktif sayfaya göre ilgili grubu otomatik aç
  React.useEffect(() => {
    const currentPath = location.pathname;
    const activeGroup = menuGroups.find(group => 
      group.items.some(item => item.path === currentPath)
    );
    
    if (activeGroup && !expandedGroups.includes(activeGroup.id)) {
      setExpandedGroups(prev => [...prev, activeGroup.id]);
    }
  }, [location.pathname]);

  return (
    <nav className="flex flex-col">
      {menuGroups.map((group) => (
        <MenuGroup
          key={group.id}
          group={group}
          visibleItems={visibleItems}
          location={location}
          navigate={navigate}
          setOpen={setOpen}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
        />
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  return (
    <Fragment>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-border">
              <SheetTitle className="flex items-center gap-2 text-xl font-bold">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                  <ChartNoAxesCombined size={20} className="text-white" />
                </div>
                Admin Paneli
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-auto py-4 px-3">
              <MenuItems setOpen={setOpen} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <MenuItems setOpen={setOpen} />
      </div>
    </Fragment>
  );
}

AdminSideBar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

MenuItems.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

export default AdminSideBar;
