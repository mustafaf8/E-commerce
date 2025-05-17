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
  // --- YENİ MENÜ ÖĞESİ ---
  {
    id: "brands", // Benzersiz bir id
    label: "Markalar", // Menüde görünecek isim
    path: "/admin/brands", // Gideceği yol (route)
    icon: <Tags size={20} />, // İkonu ayarla
  },
  // --- KATEGORİ YÖNETİMİ (Eğer eklenmediyse bunu da ekle) ---
  {
    id: "categories",
    label: "Kategoriler",
    path: "/admin/categories",
    icon: <LayoutGrid size={20} />, // Örneğin LayoutGrid ikonu
  },
  // --- ANA SAYFA BÖLÜMLERİ (Eğer eklenmediyse bunu da ekle) ---
  {
    id: "home-sections",
    label: "AnaSayfa Yönetimi",
    path: "/admin/home-sections",
    icon: <Home size={20} />, // Örneğin Home ikonu
  },
  // --- ---
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
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Paneli</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminSideBar;
