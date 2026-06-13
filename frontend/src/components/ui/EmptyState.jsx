import { Sparkles } from "lucide-react";

import Card from "./Card";

function EmptyState({
  title = "No data available",
  description = "Your activity will appear here once you start using HireGenie AI."
}) {
  return (
    <Card className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
        <Sparkles className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </Card>
  );
}

export default EmptyState;