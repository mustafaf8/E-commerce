import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex max-h-screen w-full">
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-2 lg:px-24">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
