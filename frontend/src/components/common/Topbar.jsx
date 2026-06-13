import { Bell, Menu, Search } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";

function Topbar({ onMenuClick }) {
  const { profile } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-2xl border border-slate-200 p-3 text-slate-700 dark:border-white/10 dark:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5 md:flex">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            placeholder="Search resumes, jobs, interviews..."
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />

          <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 text-sm font-bold text-white">
              {(profile?.full_name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                {profile?.full_name || "Student"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile?.target_role || "Career Learner"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;