import { Loader2 } from "lucide-react";

function Button({
  children,
  as: Component = "button",
  type = "button",
  variant = "primary",
  loading = false,
  className = "",
  disabled = false,
  onClick,
  tabIndex,
  ...props
}) {
  const isDisabled = disabled || loading;
  const isNativeButton = Component === "button";
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400";

  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 text-white shadow-glow hover:-translate-y-0.5 hover:shadow-xl",
    secondary:
      "border border-white/15 bg-white/10 text-white hover:bg-white/15 dark:text-white",
    ghost:
      "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
    danger:
      "bg-rose-500 text-white hover:bg-rose-600"
  };

  const handleClick = (event) => {
    if (isDisabled && !isNativeButton) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  const componentProps = isNativeButton
    ? {
        type,
        disabled: isDisabled
      }
    : {
        "aria-disabled": isDisabled || undefined,
        tabIndex: isDisabled ? -1 : tabIndex
      };

  return (
    <Component
      className={`${baseClasses} ${variants[variant]} ${
        isDisabled ? "cursor-not-allowed opacity-60" : ""
      } ${className}`}
      onClick={handleClick}
      {...componentProps}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Component>
  );
}

export default Button;
