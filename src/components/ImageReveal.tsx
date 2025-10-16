import { useEffect, useState } from 'react';

interface ImageRevealProps {
  imageUrl: string;
  chapterNumber: number;
  textPassage: string;
  onDismiss: () => void;
}

export const ImageReveal = ({ 
  imageUrl, 
  chapterNumber, 
  textPassage,
  onDismiss 
}: ImageRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    
    // Auto-dismiss after 4 seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/98 backdrop-blur-lg transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleDismiss}
    >
      <div className="relative max-w-4xl w-full mx-4 space-y-6 animate-scale-in">
        {/* ALICE header */}
        <div className="text-center space-y-2">
          <div className="system-text text-primary text-sm uppercase tracking-wider">
            ALICE
          </div>
          <p className="text-foreground/70 text-xs">
            Visualization complete
          </p>
        </div>

        {/* Image with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-lg" />
          <img
            src={imageUrl}
            alt={`Chapter ${chapterNumber} visualization`}
            className="relative w-full h-auto rounded-lg shadow-2xl border border-primary/30"
          />
        </div>

        {/* Caption */}
        <div className="text-center space-y-3 px-6">
          <div className="system-text text-primary/70 text-sm">
            Chapter {chapterNumber}
          </div>
          <blockquote className="text-foreground/80 text-sm leading-relaxed max-w-2xl mx-auto italic">
            "{textPassage.substring(0, 150)}..."
          </blockquote>
          <p className="system-text text-muted-foreground/50 text-xs">
            TAP TO CONTINUE READING
          </p>
        </div>
      </div>
    </div>
  );
};
