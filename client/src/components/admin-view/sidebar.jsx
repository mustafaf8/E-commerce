import {
  BadgeCheck,
  ChartNoAxesCombined,
  Home,
  LayoutDashboard,
  LayoutGrid,
  ShoppingBasket,
  Tags,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import PropTypes from "prop-types";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Banner",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Ürünler",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Siparişler",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "brands",
    label: "Markalar",
    path: "/admin/brands",
    icon: <Tags size={20} />,
  },

  {
    id: "categories",
    label: "Kategoriler",
    path: "/admin/categories",
    icon: <LayoutGrid size={20} />,
  },

  {
    id: "home-sections",
    label: "AnaSayfa Yönetimi",
    path: "/admin/home-sections",
    icon: <Home size={20} />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className=" mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b">
            <SheetTitle className="flex text-2xl font-extrabold gap-2 mt-5 mb-5">
              <ChartNoAxesCombined size={30} />
              Admin Paneli
            </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen} />
        </div>
      </SheetContent>
    </Sheet>
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
