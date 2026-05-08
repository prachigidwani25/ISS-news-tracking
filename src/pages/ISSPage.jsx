import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { useTheme } from '../context/ThemeContext';
import StatsCard from '../components/StatsCard';
import ISSMap from '../components/ISSMap';
import { Navigation, Zap, MapPin, Users, RotateCw, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ISSPage = () => {
  const { 
    issData, 
    issHistory, 
    astros, 
    locationName, 
    issLoading, 
    issError, 
    refreshISS 
  } = useDashboard();
  const { isDarkMode } = useTheme();

  // Velocity Chart Data
  const velocityChartData = {
    labels: issHistory.map(d => new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    datasets: [
      {
        label: 'Velocity (km/h)',
        data: issHistory.map(d => d.speed),
        fill: true,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        pointRadius: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { display: false },
      x: { display: false }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {issError && (
        <div className="p-4 bg-red-100 border border-red-200 text-red-600 rounded-xl flex items-center justify-between">
          <p className="font-medium">{issError}</p>
          <button onClick={refreshISS} className="text-sm underline font-bold">Try Again</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">International Space Station</h2>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            Real-time orbital tracking
            {issData && (
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                Last Update: {new Date(issData.timestamp * 1000).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={refreshISS}
          className="btn-primary flex items-center justify-center gap-2 self-start"
        >
          <RotateCw size={18} /> Refresh Telemetry
        </button>
      </div>

      {issLoading && !issData ? (
        <div className="flex flex-col items-center justify-center h-[40vh] bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse">
           <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-slate-500">Establishing Satellite Link...</p>
        </div>
      ) : issData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard 
                title="Latitude" 
                value={`${issData.latitude.toFixed(4)}°`} 
                icon={Navigation} 
                color="blue"
              />
              <StatsCard 
                title="Longitude" 
                value={`${issData.longitude.toFixed(4)}°`} 
                icon={Navigation} 
                color="purple"
                className="rotate-90"
              />
              <StatsCard 
                title="Current Speed" 
                value={`${issData.speed || 0} km/h`} 
                icon={Zap} 
                color="amber"
              />
            </div>

            <ISSMap 
              latitude={issData.latitude} 
              longitude={issData.longitude} 
              history={issHistory}
              isDarkMode={isDarkMode}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-primary-500" />
                  Current Overpass
                </h3>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                  {locationName}
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl overflow-hidden relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary-500" />
                    Velocity Trend
                  </h3>
                </div>
                <div className="h-[60px] w-full">
                  <Line data={velocityChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl h-full">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Users size={20} className="text-primary-500" />
                Astronauts in Space ({astros?.number || 0})
              </h3>
              <div className="space-y-3">
                {astros?.people?.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-transparent hover:border-primary-500/30 transition-all">
                    <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-xs">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{person.craft}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-100 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 font-medium">Telemetry data unavailable. Please click refresh above.</p>
        </div>
      )}
    </div>
  );
};

export default ISSPage;
