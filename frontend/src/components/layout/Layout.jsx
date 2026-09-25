import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-h-screen ml-64">
        <Navbar />

        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-5 lg:p-6">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
