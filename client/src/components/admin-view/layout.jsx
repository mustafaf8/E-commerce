// import { Outlet } from "react-router-dom";
// import AdminSideBar from "./sidebar";
// import AdminHeader from "./header";
// import { useState } from "react";

// function AdminLayout() {
//   const [openSidebar, setOpenSidebar] = useState(false);

//   return (
//     <div className="flex min-h-screen w-full">
//       <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
//       <div className="flex flex-1 flex-col">
//         <AdminHeader setOpen={setOpenSidebar} />
//         <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminLayout;

// src/components/admin-view/layout.jsx
import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    // Ana kapsayıcı: Ekranı kaplar ve flex
    <div className="flex min-h-screen w-full">
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      {/* Sağ İçerik Alanı (Header + Main) */}
      {/* flex-1: Kalan alanı kapla */}
      {/* flex-col: İçerikleri dikey sırala */}
      {/* min-w-0: Flex item'ın içerikten dolayı küçülmesini engellemesini önler (ÇOK ÖNEMLİ!) */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader setOpen={setOpenSidebar} />

        {/* Ana İçerik Alanı (<Outlet /> burada render edilir) */}
        {/* flex-1: Kalan dikey alanı kapla */}
        {/* flex-col flex: İçerikleri dikey sırala */}
        {/* overflow-hidden: Bu elementin sınırları dışına taşan içeriği GİZLE (Yatay taşmayı engeller) */}
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6 overflow-hidden">
          {/* AdminProducts gibi sayfalar buraya gelecek */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
