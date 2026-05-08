import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Satellite, Newspaper, MessageSquare, Menu, X } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, isSidebarOpen, setSidebarOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg lg:hidden"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <Satellite className="text-primary-500" size={28} />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hidden sm:block">
            ISS News Orbit
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
