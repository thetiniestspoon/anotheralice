import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface TextCaptureBarProps {
  height: number;
  onHeightChange: (height: number) => void;
  previewText: string;
  bloomSaturation: number;
}

export const TextCaptureBar = ({
  height,
  onHeightChange,
  previewText,
  bloomSaturation,
}: TextCaptureBarProps) => {
  const MIN_HEIGHT = 60;
  const MAX_HEIGHT = 200;

  const handleIncrease = () => {
    if (height < MAX_HEIGHT) {
      onHeightChange(Math.min(height + 20, MAX_HEIGHT));
    }
  };

  const handleDecrease = () => {
    if (height > MIN_HEIGHT) {
      onHeightChange(Math.max(height - 20, MIN_HEIGHT));
    }
  };

  const preview = previewText.length > 50 
    ? previewText.substring(0, 50) + '...' 
    : previewText;

  return (
    <>
      {/* The capture bar overlay */}
      <div
        className="fixed left-0 right-0 pointer-events-none z-10 transition-all duration-200"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: `${height}px`,
          background: `linear-gradient(to bottom, 
            transparent 0%, 
            hsl(190 ${bloomSaturation}% 45% / 0.15) 20%,
            hsl(190 ${bloomSaturation}% 45% / 0.15) 80%,
            transparent 100%)`,
          borderTop: `2px solid hsl(190 ${bloomSaturation}% 45% / 0.4)`,
          borderBottom: `2px solid hsl(190 ${bloomSaturation}% 45% / 0.4)`,
        }}
      />

      {/* Height adjustment controls */}
      <div
        className="fixed right-16 z-20 flex flex-col gap-1 pointer-events-auto"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <button
          onClick={handleIncrease}
          disabled={height >= MAX_HEIGHT}
          className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-primary/30 flex items-center justify-center hover:bg-card hover:border-primary/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Increase capture height"
        >
          <Plus className="w-4 h-4 text-primary" />
        </button>
        
        <div className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
          <span className="text-xs text-muted-foreground system-text">{height}</span>
        </div>
        
        <button
          onClick={handleDecrease}
          disabled={height <= MIN_HEIGHT}
          className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-primary/30 flex items-center justify-center hover:bg-card hover:border-primary/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Decrease capture height"
        >
          <Minus className="w-4 h-4 text-primary" />
        </button>
      </div>

      {/* Text preview pill */}
      {previewText && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-card/90 backdrop-blur-sm border border-primary/20 rounded-full pointer-events-none"
          style={{
            top: `calc(50% + ${height / 2}px + 12px)`,
          }}
        >
          <p className="text-xs text-muted-foreground max-w-md truncate">
            {preview}
          </p>
        </div>
      )}
    </>
  );
};
