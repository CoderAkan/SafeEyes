import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
  type: 'fire' | 'ppe_violation' | 'unsafe_behavior' | string;
}

interface BoundingBoxViewerProps {
  boxes: BoundingBox[];
  imageUrl?: string;
}

const typeColors: Record<string, string> = {
  fire: 'var(--color-danger)',
  ppe_violation: 'var(--color-warning)',
  unsafe_behavior: 'var(--color-accent-primary)',
};

export default function BoundingBoxViewer({ boxes, imageUrl }: BoundingBoxViewerProps) {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div 
      className={`relative w-full bg-[#0a0e1a]/80 overflow-hidden ${fullscreen ? 'fixed inset-0 z-[1000] h-screen rounded-none' : 'h-[400px] rounded-xl'}`}
    >
      {/* Header overlay */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          className="p-2 rounded-md bg-black/50 border-none text-white cursor-pointer hover:bg-black/70 transition-colors"
          onClick={() => setFullscreen(!fullscreen)}
        >
          {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Detection count */}
      <div 
        className="absolute top-3 left-3 z-10 bg-black/60 px-3 py-1 rounded-full text-[0.75rem] font-semibold"
        style={{ color: boxes.length > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
      >
        {boxes.length} Detection{boxes.length !== 1 ? 's' : ''}
      </div>

      {/* Image / Placeholder */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Camera frame"
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a0e1a]/90 to-[#111827]/90 text-text-muted text-[0.9rem]">
          Waiting for detection frame...
        </div>
      )}

      {/* Bounding boxes */}
      {boxes.map((box, idx) => {
        const color = typeColors[box.type] || 'var(--color-accent-primary)';
        return (
          <div
            key={idx}
            className="absolute border-2 rounded pointer-events-none"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
              borderColor: color,
            }}
          >
            <div 
              className="absolute -top-5.5 -left-0.5 text-white px-2 py-0.5 text-[0.7rem] font-semibold rounded-t whitespace-nowrap" 
              style={{ background: color }}
            >
              {box.label} {Math.round(box.confidence * 100)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
