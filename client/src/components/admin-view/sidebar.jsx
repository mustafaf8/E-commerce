import {
  BadgeCheck,
  ChartNoAxesCombined,
  Home,
  LayoutDashboard,
  LayoutGrid,
  ShoppingBasket,
  Tags,
  Ticket,
  UserCog,
  Wrench,
  Users,
} from "lucide-react";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import PropTypes from "prop-types";


const adminSidebarMenuItems = [
  {
    id: "orders",
    label: "Siparişler",
    path: "/admin/orders",
    icon: <BadgeCheck size={18} />,
  },
  {
    id: "products",
    label: "Ürünler",
    path: "/admin/products",
    icon: <ShoppingBasket size={18} />,
  },
  {
    id: "dashboard",
    label: "Banner",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    id: "stats",
    label: "İstatistikler",
    path: "/admin/stats",
    icon: <ChartNoAxesCombined size={18} />,
  },
  {
    id: "coupons",
    label: "Kuponlar",
    path: "/admin/coupons",
    icon: <Ticket size={18} />,
  },
  {
    id: "categories-brands",
    label: "Kategori & Marka",
    path: "/admin/categories-brands",
    icon: <LayoutGrid size={18} />,
  },
 
  {
    id: "home-sections",
    label: "AnaSayfa Yönetimi",
    path: "/admin/home-sections",
    icon: <Home size={18} />,
  },
  {
    id: "users",
    label: "Kullanıcılar",
    path: "/admin/users",
    icon: <Users size={18} />,
  },
  {
    id: "maintenance",
    label: "Bakım Modu",
    path: "/admin/maintenance",
    icon: <Wrench size={18} />,
  },
];

// Authorization menu definition (only for Level1)
const authorizationMenuItem = {
  id: "authorization",
  label: "Yetkilendirme",
  path: "/admin/authorization",
  icon: <UserCog size={18} />, // We'll need to import UserCog icon
};

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  // Determine visible menu items based on permissions
  const visibleMenuItems = adminSidebarMenuItems.filter((item) => {
    if (user?.adminAccessLevel === 1 || user?.adminAccessLevel === undefined) return true; // Full access or not set

    // For categories-brands, check both permissions
    if (item.id === "categories-brands") {
      const categoriesPerms = user?.adminModulePermissions?.categories;
      const brandsPerms = user?.adminModulePermissions?.brands;
      return categoriesPerms?.view || brandsPerms?.view; // show if can view either
    }

    // For lower levels, check adminModulePermissions
    const perms = user?.adminModulePermissions?.[item.id];
    return perms?.view; // show if can view
  });

  // Add authorization menu only for Level 1 admins
  if (user?.adminAccessLevel === 1 || user?.adminAccessLevel === undefined) {
    visibleMenuItems.push(authorizationMenuItem);
  }

  return (
    <nav className="flex flex-col space-y-1">
      {visibleMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/80 ${
              isActive
                ? "bg-secondary text-primary"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <span className={isActive ? "text-primary" : "text-gray-500"}>
              {menuItem.icon}
            </span>
            <span>{menuItem.label}</span>
            {isActive && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  return (
    <Fragment>
      {/* This is the mobile sidebar */}
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

      {/* This is the desktop sidebar content rendered in the layout */}
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
