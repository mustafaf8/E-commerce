import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex max-h-screen w-full">
      <div className="h-screen border-black border-2"></div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
