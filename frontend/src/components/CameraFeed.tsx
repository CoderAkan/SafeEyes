import { Camera, Video } from 'lucide-react';

interface CameraFeedProps {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'alert';
  streamUrl?: string;
  onView?: (id: string) => void;
}

export default function CameraFeed({ id, name, location, status, onView }: CameraFeedProps) {
  const statusStyles: Record<string, { dot: string, badge: string, text: string }> = {
    active: { 
      dot: 'bg-success', 
      badge: 'border-border-default text-text-primary bg-bg-secondary',
      text: 'text-success'
    },
    inactive: { 
      dot: 'bg-text-muted', 
      badge: 'border-border-default text-text-muted bg-bg-secondary',
      text: 'text-text-muted'
    },
    alert: { 
      dot: 'bg-danger animate-pulse-dot', 
      badge: 'border-danger/30 text-danger bg-danger/10',
      text: 'text-danger'
    },
  };

  const style = statusStyles[status];

  return (
    <div 
      className="bg-bg-card border border-border-default rounded-xl overflow-hidden transition-all duration-250 hover:shadow-md hover:-translate-y-0.5 hover:border-accent-primary cursor-pointer" 
      onClick={() => onView?.(id)}
    >
      <div className="w-full h-[200px] bg-bg-secondary flex items-center justify-center relative overflow-hidden">
        
        <div className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[0.7rem] font-semibold uppercase border ${style.badge}`}>
          <span className={`w-2 h-2 rounded-full inline-block ${style.dot}`} />
          <span className={style.text}>{status}</span>
        </div>
        
        <div className="text-text-muted text-[0.85rem] font-medium z-10 flex flex-col items-center gap-2">
          <Camera size={32} strokeWidth={1.5} />
          <span>Camera Feed</span>
        </div>
      </div>

      <div className="px-5 py-4">
        <h3 className="text-[0.95rem] font-semibold mb-1 text-text-primary">{name}</h3>
        <p className="text-[0.8rem] text-text-muted">{location}</p>
      </div>

      <div className="flex gap-2 px-5 pb-4">
        <button 
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-250 bg-bg-card text-text-primary border border-border-default hover:bg-bg-card-hover hover:border-accent-primary"
          onClick={(e) => { e.stopPropagation(); onView?.(id); }}
        >
          <Video size={14} />
          Live View
        </button>
      </div>
    </div>
  );
}
