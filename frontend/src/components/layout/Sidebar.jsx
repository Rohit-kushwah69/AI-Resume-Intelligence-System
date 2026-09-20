import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Target,
  Settings,
  Upload,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Resumes",
    path: "/resumes",
    icon: FileText,
  },
  {
    name: "Upload Resume",
    path: "/resumes/upload",
    icon: Upload,
  },
  {
    name: "Jobs",
    path: "/jobs",
    icon: Briefcase,
  },
  {
    name: "Candidates",
    path: "/candidates",
    icon: Users,
  },
  {
    name: "Matching",
    path: "/matching",
    icon: Target,
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
      
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
          🤖
        </div>

        <div>
          <h1 className="text-lg font-bold text-slate-800">
            Resume AI
          </h1>
          <p className="text-xs text-slate-500">
            Intelligence System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-0 w-full border-t border-slate-200 p-4">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Settings size={19} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;