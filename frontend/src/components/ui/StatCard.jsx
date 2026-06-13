import { motion } from "framer-motion";

import Card from "./Card";

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl" />

        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <h3 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
              {value}
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>

          {Icon && (
            <div className="rounded-2xl bg-indigo-500/15 p-3 text-indigo-300">
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export default StatCard;