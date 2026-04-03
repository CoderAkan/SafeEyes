import { Camera } from 'lucide-react';

interface CameraMarker {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'alert';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

interface Map2DProps {
  cameras: CameraMarker[];
  onCameraClick?: (id: string) => void;
}

export default function Map2D({ cameras, onCameraClick }: Map2DProps) {
  const markerStyles: Record<string, string> = {
    active: 'bg-success text-white',
    inactive: 'bg-text-muted text-white',
    alert: 'bg-danger text-white animate-pulse-marker',
  };

  return (
    <div className="relative w-full h-[360px] bg-bg-secondary rounded-xl border border-border-default overflow-hidden">

      {/* Floor plan label */}
      <div className="absolute top-4 left-4 text-[0.75rem] text-text-muted font-semibold uppercase tracking-widest z-10">
        Floor Plan — Level 1
      </div>

      {/* Room outlines */}
      <div className="absolute top-[15%] left-[10%] w-[35%] h-[40%] border border-dashed border-accent-primary/15 rounded-lg">
        <span className="absolute top-2 left-3 text-[0.65rem] text-text-muted uppercase">
          Main Hall
        </span>
      </div>

      <div className="absolute top-[15%] left-[55%] w-[35%] h-[30%] border border-dashed border-accent-primary/15 rounded-lg">
        <span className="absolute top-2 left-3 text-[0.65rem] text-text-muted uppercase">
          Workshop A
        </span>
      </div>

      <div className="absolute top-[60%] left-[20%] w-[60%] h-[30%] border border-dashed border-accent-primary/15 rounded-lg">
        <span className="absolute top-2 left-3 text-[0.65rem] text-text-muted uppercase">
          Storage Area
        </span>
      </div>

      {/* Camera markers */}
      {cameras.map((cam) => (
        <div
          key={cam.id}
          className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 z-20 text-[0.75rem] hover:scale-125 -translate-x-1/2 -translate-y-1/2 group ${markerStyles[cam.status]}`}
          style={{
            left: `${cam.x}%`,
            top: `${cam.y}%`,
          }}
          onClick={() => onCameraClick?.(cam.id)}
          title={cam.name}
        >
          <Camera size={14} />
          <span className="absolute -bottom-6 flex whitespace-nowrap text-[0.7rem] font-medium text-white bg-accent-primary px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {cam.name}
          </span>
        </div>
      ))}

      {cameras.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted text-[0.85rem] text-center">
          No cameras placed on map
        </div>
      )}
    </div>
  );
}
