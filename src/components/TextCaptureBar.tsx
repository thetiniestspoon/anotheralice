import { useState, useRef, useEffect } from 'react';

interface TextCaptureBarProps {
  position: number; // Vertical position in vh (0-100)
  onPositionChange: (position: number) => void;
  bloomSaturation: number;
  height?: number; // Fixed height in px, default 100
}

export const TextCaptureBar = ({
  position,
  onPositionChange,
  bloomSaturation,
  height = 100,
}: TextCaptureBarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartPosition = useRef(0);
  const MIN_POSITION = 15; // Minimum 15vh from top
  const MAX_POSITION = 85; // Maximum 85vh from top

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartPosition.current = position;
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartY.current = e.touches[0].clientY;
    dragStartPosition.current = position;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartY.current;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newPosition = Math.max(
        MIN_POSITION,
        Math.min(MAX_POSITION, dragStartPosition.current + deltaVh)
      );
      onPositionChange(newPosition);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = e.touches[0].clientY - dragStartY.current;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newPosition = Math.max(
        MIN_POSITION,
        Math.min(MAX_POSITION, dragStartPosition.current + deltaVh)
      );
      onPositionChange(newPosition);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, onPositionChange]);

  return (
    <div
      className="fixed left-0 right-0 pointer-events-auto z-10"
      style={{
        top: `${position}vh`,
        transform: 'translateY(-50%)',
        height: `${height}px`,
        background: `linear-gradient(to bottom, 
          transparent 0%, 
          hsl(190 ${bloomSaturation}% 45% / 0.15) 20%,
          hsl(190 ${bloomSaturation}% 45% / 0.15) 80%,
          transparent 100%)`,
        borderTop: `2px solid hsl(190 ${bloomSaturation}% 45% / 0.4)`,
        borderBottom: `2px solid hsl(190 ${bloomSaturation}% 45% / 0.4)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'all 200ms ease-out',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      aria-label="Drag to adjust capture position"
    />
  );
};
