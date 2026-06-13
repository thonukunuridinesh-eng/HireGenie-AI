function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200 ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;