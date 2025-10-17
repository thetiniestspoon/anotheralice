import { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

interface TextCaptureBarProps {
  onCapture: (capturedText: string) => void;
  bloomSaturation: number;
}

export const TextCaptureBar = ({ onCapture, bloomSaturation }: TextCaptureBarProps) => {
  const [barY, setBarY] = useState(50); // percentage from top
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const windowHeight = window.innerHeight;
      const newY = (clientY / windowHeight) * 100;
      setBarY(Math.max(15, Math.min(85, newY)));
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleSphereClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (isDragging) return;
    
    // Extract EXACT line text at the bar's Y position using per-character rects
    const article = document.querySelector('article');
    if (!article) return;

    const barAbsoluteY = (window.innerHeight * barY) / 100;

    // First pass: find the line rect that contains (or is closest to) the bar Y
    const walker = document.createTreeWalker(
      article,
      NodeFilter.SHOW_TEXT,
      null
    );

    let targetRect: DOMRect | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (!node.nodeValue || !node.nodeValue.trim()) continue;
      const fullRange = document.createRange();
      fullRange.selectNodeContents(node);
      const rects = fullRange.getClientRects();
      for (const r of Array.from(rects)) {
        const contains = barAbsoluteY >= r.top && barAbsoluteY <= r.bottom;
        const distance = contains ? 0 : (barAbsoluteY < r.top ? r.top - barAbsoluteY : barAbsoluteY - r.bottom);
        if (distance < bestDistance) {
          bestDistance = distance;
          targetRect = r;
        }
      }
    }

    if (!targetRect) return;

    const sameLine = (r: DOMRect) => Math.abs(r.top - targetRect!.top) < 1 && Math.abs(r.bottom - targetRect!.bottom) < 1;

    // Second pass: collect text across all nodes that fall within the exact line band
    const collectWalker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, null);
    const charRange = document.createRange();
    let parts: string[] = [];

    while (collectWalker.nextNode()) {
      const node = collectWalker.currentNode as Text;
      const text = node.nodeValue || '';
      if (!text) continue;

      let start = -1;
      for (let i = 0; i < text.length; i++) {
        charRange.setStart(node, i);
        charRange.setEnd(node, i + 1);
        const r = charRange.getBoundingClientRect();
        if (!r || (r.width === 0 && r.height === 0)) continue;

        if (sameLine(r)) {
          if (start === -1) start = i;
        } else if (start !== -1) {
          parts.push(text.slice(start, i));
          start = -1;
          if (r.top > targetRect.bottom + 2) break; // we're below the target line
        }
      }
      if (start !== -1) parts.push(text.slice(start));
    }

    const rawLine = parts.join('');
    const capturedText = rawLine.replace(/\s+/g, ' ').trim();

    onCapture(capturedText);
  };

  return (
    <div
      ref={barRef}
      className="fixed left-0 right-0 z-40 flex items-center justify-between px-4 pointer-events-none"
      style={{
        top: `${barY}%`,
        transform: 'translateY(-50%)',
      }}
    >
      {/* Blue sphere button - left side */}
      <button
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={handleSphereClick}
        className="relative w-12 h-12 rounded-full pointer-events-auto cursor-pointer group"
        style={{
          background: `radial-gradient(circle at 30% 30%, hsl(190 ${bloomSaturation}% 55%), hsl(190 ${bloomSaturation}% 35%))`,
          boxShadow: `0 0 30px hsl(190 ${bloomSaturation}% 45% / 0.8), inset 0 0 20px hsl(190 ${bloomSaturation}% 25%)`,
        }}
        aria-label="Capture text and visualize"
      >
        {/* Pulsing outer ring */}
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{
            background: `hsl(190 ${bloomSaturation}% 45%)`,
          }}
        />
        
        {/* Hover glow */}
        <div 
          className="absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            boxShadow: `0 0 40px hsl(190 ${bloomSaturation}% 55% / 1)`,
          }}
        />
      </button>

      {/* Blue horizontal bar - middle */}
      <div
        className="flex-1 mx-4 h-1 pointer-events-auto rounded-full"
        style={{
          background: `linear-gradient(90deg, 
            hsl(190 ${bloomSaturation}% 45% / 0.8) 0%, 
            hsl(190 ${bloomSaturation}% 45% / 0.95) 50%, 
            hsl(190 ${bloomSaturation}% 45% / 0.8) 100%)`,
          boxShadow: `0 0 20px hsl(190 ${bloomSaturation}% 45% / 0.6)`,
        }}
      />

      {/* Grippy icon - right side */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className="pointer-events-auto cursor-grab active:cursor-grabbing p-2 rounded-lg transition-all duration-200 hover:scale-110"
        style={{
          background: `hsl(190 ${bloomSaturation}% 35% / 0.3)`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <GripVertical 
          className="w-6 h-6"
          style={{
            color: `hsl(190 ${bloomSaturation}% 55%)`,
          }}
        />
      </div>
    </div>
  );
};
