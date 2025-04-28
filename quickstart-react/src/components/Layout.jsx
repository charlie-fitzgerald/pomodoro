import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar or logo could go here */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Footer could go here */}
    </div>
  );
};

export default Layout;
