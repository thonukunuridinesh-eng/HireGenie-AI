function Textarea({
  label,
  error,
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

      <textarea
        className={`min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white ${className}`}
        {...props}
      />

      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export default Textarea;