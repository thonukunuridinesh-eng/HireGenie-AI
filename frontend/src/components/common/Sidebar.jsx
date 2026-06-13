import {
  Award,
  BarChart3,
  Briefcase,
  Code2,
  FileText,
  Home,
  LogOut,
  Map,
  Mic,
  PenLine,
  Target
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo";

const menuItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Resume Analyzer", icon: FileText, path: "/dashboard/resume-analyzer" },
  { label: "Resume Builder", icon: PenLine, path: "/dashboard/resume-builder" },
  { label: "Mock Interview", icon: Mic, path: "/dashboard/interviews" },
  { label: "Coding Arena", icon: Code2, path: "/dashboard/coding" },
  { label: "Aptitude Hub", icon: Target, path: "/dashboard/aptitude" },
  { label: "Career Roadmap", icon: Map, path: "/dashboard/roadmap" },
  { label: "Jobs", icon: Briefcase, path: "/dashboard/jobs" },
  { label: "Certificates", icon: Award, path: "/dashboard/certificates" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" }
];

function Sidebar({ open, onClose }) {
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 border-r border-white/10 bg-slate-950 p-5 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Logo />

        <nav className="premium-scrollbar mt-8 flex h-[calc(100vh-145px)] flex-col gap-2 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-glow"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-300"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;