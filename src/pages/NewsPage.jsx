import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import NewsCard from '../components/NewsCard';
import { Search, RotateCw, Newspaper, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const NewsPage = () => {
  const { news, newsLoading, newsError, refreshNews } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');

  const handleSearch = (e) => {
    e.preventDefault();
    refreshNews(searchQuery, sortBy);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    refreshNews(searchQuery, newSort);
  };

  const sources = (news || []).reduce((acc, article) => {
    const source = article.source.name;
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(sources),
    datasets: [{
      data: Object.values(sources),
      backgroundColor: [
        '#6366f1', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'
      ],
      borderWidth: 0,
    }]
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold">Global Space News</h2>
          <p className="text-slate-500 text-sm">Latest updates from across the cosmos</p>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <input 
            type="text" 
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        </form>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleSortChange('publishedAt')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'publishedAt' ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}
          >
            Latest
          </button>
          <button 
            onClick={() => handleSortChange('popularity')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'popularity' ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'}`}
          >
            Trending
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[400px] bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : newsError ? (
            <div className="text-center p-12 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
              <p className="text-red-500 font-medium mb-4">{newsError}</p>
              <button onClick={() => refreshNews()} className="btn-primary">Retry</button>
            </div>
          ) : (news && news.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((article, idx) => (
                <NewsCard key={idx} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <p className="text-slate-500">No articles found matching your criteria.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl sticky top-24">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <PieIcon size={20} className="text-primary-500" />
              Source Distribution
            </h3>
            {news && news.length > 0 ? (
              <div className="aspect-square">
                <Pie data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic text-center">No data for chart</p>
            )}
            <div className="mt-6 space-y-3">
              {Object.entries(sources).slice(0, 5).map(([name, count], i) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartData.datasets[0].backgroundColor[i] }}></div>
                    <span className="text-xs font-medium truncate max-w-[120px]">{name}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-bold">{count} articles</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
