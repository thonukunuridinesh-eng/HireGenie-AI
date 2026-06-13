function Input({
  label,
  error,
  icon: Icon,
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}

        <input
          className={`w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white ${
            Icon ? "pl-11" : ""
          } ${className}`}
          {...props}
        />
      </div>

      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export default Input;