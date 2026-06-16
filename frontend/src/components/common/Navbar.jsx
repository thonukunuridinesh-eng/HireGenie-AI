import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";
import Logo from "./Logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" }
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          {isAuthenticated ? (
            <Button as={Link} to="/dashboard">
              Open Dashboard
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost">
                Login
              </Button>
              <Button as={Link} to="/register">
                Start Free
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((current) => !current)}
          className="rounded-2xl border border-white/10 bg-white/10 p-3 text-white lg:hidden"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-slate-950 px-4 py-5 lg:hidden"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-300"
              >
                {link.label}
              </a>
            ))}

            <div className="flex items-center gap-3 pt-3">
              <ThemeToggle />
              <Button as={Link} to={isAuthenticated ? "/dashboard" : "/login"}>
                {isAuthenticated ? "Dashboard" : "Login"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
