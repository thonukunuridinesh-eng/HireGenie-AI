import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 text-white shadow-glow">
        <Sparkles className="h-6 w-6" />
      </div>

      {!compact && (
        <div>
          <p className="text-lg font-bold leading-none text-slate-950 dark:text-white">
            HireGenie AI
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Career Assistant
          </p>
        </div>
      )}
    </Link>
  );
}

export default Logo;