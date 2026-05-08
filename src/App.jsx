import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';
import ISSPage from './pages/ISSPage';
import NewsPage from './pages/NewsPage';

function App() {
  const [activeTab, setActiveTab] = useState('iss'); // 'iss' or 'news'
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <DashboardProvider>
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setSidebarOpen(false);
            }} 
            isOpen={isSidebarOpen}
          />
          
          <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
            <Navbar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              {activeTab === 'iss' ? <ISSPage /> : <NewsPage />}
            </main>
          </div>

          <ChatBot />
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl',
              duration: 4000,
            }}
          />
        </div>
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;
