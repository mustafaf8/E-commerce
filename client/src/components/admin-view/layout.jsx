import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="admin-layout flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 border-r border-border bg-white dark:bg-gray-900 shadow-sm">
        <div className="h-full py-6 px-4">
          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M3 3v18h18"></path>
                <path d="M7 12v5"></path>
                <path d="M11 8v9"></path>
                <path d="M15 4v13"></path>
                <path d="M19 8v9"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold">Admin Paneli</h1>
          </div>
          <div className="space-y-1">
            {/* Sidebar items are in the sidebar component */}
            <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex flex-col bg-secondary/40 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
