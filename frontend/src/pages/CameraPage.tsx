import { useState } from 'react';
import { Plus, MapPin, RefreshCw } from 'lucide-react';
import CameraFeed from '../components/CameraFeed';
import Map2D from '../components/Map2D';

const demoCameras = [
  { id: 'c1', name: 'Entrance Camera', location: 'Main Entrance', status: 'active' as const, stream_url: '', map_x: 15, map_y: 20 },
  { id: 'c2', name: 'Workshop Cam A', location: 'Workshop A', status: 'active' as const, stream_url: '', map_x: 70, map_y: 25 },
  { id: 'c3', name: 'Storage Monitor', location: 'Storage Area', status: 'alert' as const, stream_url: '', map_x: 50, map_y: 70 },
  { id: 'c4', name: 'Corridor CAM', location: 'Main Corridor', status: 'active' as const, stream_url: '', map_x: 40, map_y: 45 },
  { id: 'c5', name: 'Exit Camera', location: 'Emergency Exit', status: 'inactive' as const, stream_url: '', map_x: 85, map_y: 80 },
  { id: 'c6', name: 'Loading Bay', location: 'Loading Dock', status: 'active' as const, stream_url: '', map_x: 25, map_y: 75 },
];

export default function CameraPage() {
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const cameras = demoCameras;

  const mapCameras = cameras
    .filter((c) => c.map_x != null && c.map_y != null)
    .map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      x: c.map_x!,
      y: c.map_y!,
    }));

  return (
    <div className="pt-[calc(64px+24px)] px-4 md:px-8 pb-12 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Cameras</h1>
          <p className="text-text-secondary text-[0.925rem] mt-1">Manage and monitor all connected cameras</p>
        </div>
        <div className="flex gap-2">
          <button
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-250 min-w-auto
              ${view === 'grid' 
                ? 'bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-px hover:shadow-[0_0_20px_rgba(99,102,241,0.3),0_4px_16px_rgba(0,0,0,0.4)]' 
                : 'bg-bg-card text-text-primary border border-border-default hover:bg-bg-card-hover hover:border-accent-primary'}`}
            onClick={() => setView('grid')}
          >
            Grid
          </button>
          <button
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-250 min-w-auto
              ${view === 'map' 
                ? 'bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-px hover:shadow-[0_0_20px_rgba(99,102,241,0.3),0_4px_16px_rgba(0,0,0,0.4)]' 
                : 'bg-bg-card text-text-primary border border-border-default hover:bg-bg-card-hover hover:border-accent-primary'}`}
            onClick={() => setView('map')}
          >
            <MapPin size={14} />
            Map
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-250 bg-bg-card text-text-primary border border-border-default hover:bg-bg-card-hover hover:border-accent-primary">
            <RefreshCw size={14} />
            Refresh
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-250 min-w-auto bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-px hover:shadow-[0_0_20px_rgba(99,102,241,0.3),0_4px_16px_rgba(0,0,0,0.4)]">
            <Plus size={14} />
            Add Camera
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-6 mb-6 px-6 py-4 bg-gradient-to-br from-[rgba(26,31,53,0.9)] to-[rgba(17,24,39,0.6)] border border-border-default rounded-xl">
        {[
          { label: 'Total', value: cameras.length, color: 'text-text-primary' },
          { label: 'Online', value: cameras.filter(c => c.status === 'active').length, color: 'text-success' },
          { label: 'Alert', value: cameras.filter(c => c.status === 'alert').length, color: 'text-danger' },
          { label: 'Offline', value: cameras.filter(c => c.status === 'inactive').length, color: 'text-text-muted' },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`text-xl font-extrabold ${color}`}>{value}</span>
            <span className="text-[0.8rem] text-text-muted">{label}</span>
          </div>
        ))}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {cameras.map((cam) => (
            <CameraFeed
              key={cam.id}
              id={cam.id}
              name={cam.name}
              location={cam.location}
              status={cam.status}
              streamUrl={cam.stream_url}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[rgba(26,31,53,0.9)] to-[rgba(17,24,39,0.6)] border border-border-default rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
          <div className="flex items-center justify-between p-5 px-6 border-b border-border-subtle">
            <h2 className="text-base font-bold text-text-primary">Camera Layout</h2>
            <span className="text-[0.8rem] text-text-muted">
              {mapCameras.length} cameras positioned
            </span>
          </div>
          <div className="p-6">
            <Map2D cameras={mapCameras} />
          </div>
        </div>
      )}
    </div>
  );
}
