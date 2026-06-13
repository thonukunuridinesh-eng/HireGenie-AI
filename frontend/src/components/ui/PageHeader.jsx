function PageHeader({ badge, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {badge && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            {badge}
          </p>
        )}

        <h1 className="text-3xl font-bold text-slate-950 dark:text-white md:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

export default PageHeader;