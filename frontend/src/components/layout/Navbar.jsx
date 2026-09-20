import { Bell, Search, UserCircle } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      
      {/* Search */}
      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search resumes, jobs, candidates..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <UserCircle size={25} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Admin
            </p>
            <p className="text-xs text-slate-400">
              Resume Manager
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;