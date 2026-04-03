import { Flame, HardHat, AlertTriangle } from 'lucide-react';

interface IncidentCardProps {
  id: string;
  type: string;
  severity: string;
  description: string;
  cameraName?: string;
  location?: string;
  confidence: number;
  status: string;
  createdAt: string;
  onClick?: (id: string) => void;
}

const typeIcons: Record<string, any> = {
  fire: Flame,
  ppe_violation: HardHat,
  unsafe_behavior: AlertTriangle,
};

const typeLabels: Record<string, string> = {
  fire: 'Fire Detected',
  ppe_violation: 'PPE Violation',
  unsafe_behavior: 'Unsafe Behavior',
};

const typeStyles: Record<string, string> = {
  fire: 'bg-danger/10 text-danger',
  ppe_violation: 'bg-warning/10 text-warning',
  unsafe_behavior: 'bg-bg-secondary text-accent-primary',
};

const severityStyles: Record<string, string> = {
  critical: 'bg-danger text-white border-danger',
  high: 'bg-white text-danger border-danger',
  medium: 'bg-white text-warning border-warning',
  low: 'bg-white text-success border-success',
};

export default function IncidentCard({
  id,
  type,
  severity,
  description,
  location,
  confidence,
  createdAt,
  onClick,
}: IncidentCardProps) {
  const Icon = typeIcons[type] || AlertTriangle;
  const label = typeLabels[type] || type;
  const style = typeStyles[type] || typeStyles.unsafe_behavior;
  const severityStyle = severityStyles[severity] || severityStyles.low;

  const timeAgo = formatTimeAgo(createdAt);

  return (
    <div 
      className="flex items-center gap-4 px-5 py-4 bg-bg-card border border-border-default rounded-xl transition-all duration-150 cursor-pointer hover:shadow-sm hover:border-accent-primary hover:bg-bg-card-hover" 
      onClick={() => onClick?.(id)}
    >
      <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${style}`}>
        <Icon size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[0.9rem] font-semibold text-text-primary mb-0.5">{label}</h3>
        <p className="text-[0.8rem] text-text-muted truncate">{description || location || 'No description'} • {Math.round(confidence * 100)}% confidence</p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider border ${severityStyle}`}>
          {severity}
        </span>
        <span className="text-[0.75rem] text-text-muted">{timeAgo}</span>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
