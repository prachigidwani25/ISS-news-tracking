import React from 'react';
import { clsx } from 'clsx';

const StatsCard = ({ title, value, unit, icon: Icon, color, trend, subValue }) => {
  return (
    <div className="glass-card p-5 rounded-2xl flex flex-col gap-3 group hover:border-primary-500/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className={clsx(
          "p-3 rounded-xl",
          color === 'blue' && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
          color === 'green' && "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
          color === 'purple' && "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
          color === 'amber' && "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        )}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={clsx(
            "text-xs font-bold px-2 py-1 rounded-full",
            trend > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value}</span>
          {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
        </div>
        {subValue && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{subValue}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
