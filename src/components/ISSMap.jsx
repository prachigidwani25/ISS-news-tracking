import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Satellite } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Custom Marker Icon using Lucide Satellite
const createISSIcon = (isDarkMode) => {
  const iconHtml = renderToStaticMarkup(
    <div className={`p-2 rounded-full border-2 ${isDarkMode ? 'bg-slate-900 border-primary-400' : 'bg-white border-primary-600'} shadow-lg`}>
      <Satellite className={isDarkMode ? 'text-primary-400' : 'text-primary-600'} size={24} />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-iss-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Component to auto-center map when ISS moves
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const ISSMap = ({ latitude, longitude, history, isDarkMode }) => {
  const position = [latitude, longitude];
  const path = history.map(pos => [pos.latitude, pos.longitude]);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-inner relative">
      <MapContainer 
        center={position} 
        zoom={3} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline 
          positions={path} 
          color="#0ea5e9" 
          weight={3} 
          opacity={0.6}
          dashArray="5, 10"
        />
        <Marker 
          position={position} 
          icon={createISSIcon(isDarkMode)}
        />
        <ChangeView center={position} />
      </MapContainer>
      
      <div className="absolute bottom-4 right-4 z-[1000] glass-card p-2 rounded-lg text-[10px] text-slate-500 font-mono">
        {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
      </div>
    </div>
  );
};

export default ISSMap;
