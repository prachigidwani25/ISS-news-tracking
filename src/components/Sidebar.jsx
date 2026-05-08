import React from 'react';
import { Satellite, Newspaper, LayoutDashboard, Settings, Info } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'iss', name: 'ISS Tracking', icon: Satellite },
    { id: 'news', name: 'Global News', icon: Newspaper },
  ];

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 z-40 w-64 glass-card border-r transition-transform duration-300 lg:static lg:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      <div className="p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-4">
            Dashboard
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                  activeTab === item.id 
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" 
                    : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                <Icon size={20} className={clsx(
                  activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-primary-500"
                )} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-12 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-4">
            System
          </p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <Info size={20} />
            <span className="font-medium">About</span>
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ISS Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
