import { useState, useMemo } from 'react';
import { GeneratedImage } from '@/hooks/useImageGeneration';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DomeViewerProps {
  images: GeneratedImage[];
  onClose: () => void;
}

// Subtle static noise component
const StaticNoise = () => (
  <div className="w-full h-full relative overflow-hidden bg-muted/5">
    <div 
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        animation: 'noise 1s steps(8) infinite',
      }}
    />
  </div>
);

export const DomeViewer = ({ images, onClose }: DomeViewerProps) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [chapterIndices, setChapterIndices] = useState<Record<number, number>>({});
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  // Group images by chapter (1-12)
  const imagesByChapter = useMemo(() => {
    const grouped: Record<number, GeneratedImage[]> = {};
    for (let i = 1; i <= 12; i++) {
      grouped[i] = [];
    }
    images.forEach(img => {
      if (img.chapterNumber >= 1 && img.chapterNumber <= 12) {
        grouped[img.chapterNumber].push(img);
      }
    });
    return grouped;
  }, [images]);

  // Handle press start (mouse down or touch start)
  const handlePressStart = (chapterNum: number) => {
    setIsLongPress(false);
    const timer = setTimeout(() => {
      setIsLongPress(true);
      const chapterImages = imagesByChapter[chapterNum];
      if (chapterImages.length > 0) {
        const currentIndex = chapterIndices[chapterNum] || 0;
        setSelectedImage(chapterImages[currentIndex]);
      }
    }, 500); // 500ms for long press
    setPressTimer(timer);
  };

  // Handle press end (mouse up or touch end)
  const handlePressEnd = (chapterNum: number) => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    
    // Only cycle if it was a quick tap (not a long press)
    if (!isLongPress) {
      const chapterImages = imagesByChapter[chapterNum];
      if (chapterImages.length > 0) {
        const currentIndex = chapterIndices[chapterNum] || 0;
        const nextIndex = (currentIndex + 1) % chapterImages.length;
        setChapterIndices(prev => ({ ...prev, [chapterNum]: nextIndex }));
      }
    }
    setIsLongPress(false);
  };

  // Handle press cancel (mouse leave or touch cancel)
  const handlePressCancel = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setIsLongPress(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-fade-in">
      {/* Header */}
      <header className="relative z-10 border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="system-text text-primary/70 text-xs uppercase tracking-wider">
              Memory Archive
            </div>
            <div className="text-sm text-foreground/80">
              {images.length} {images.length === 1 ? 'Visualization' : 'Visualizations'}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-primary"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </header>

      {/* 3x4 Grid - One slot per chapter */}
      <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(chapterNum => {
              const chapterImages = imagesByChapter[chapterNum];
              const currentIndex = chapterIndices[chapterNum] || 0;
              const currentImage = chapterImages[currentIndex];
              const hasMultiple = chapterImages.length > 1;

              return (
                <button
                  key={chapterNum}
                  onMouseDown={() => handlePressStart(chapterNum)}
                  onMouseUp={() => handlePressEnd(chapterNum)}
                  onMouseLeave={handlePressCancel}
                  onTouchStart={() => handlePressStart(chapterNum)}
                  onTouchEnd={() => handlePressEnd(chapterNum)}
                  onTouchCancel={handlePressCancel}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 bg-muted/20 group"
                  disabled={chapterImages.length === 0}
                >
                  {currentImage ? (
                    <>
                      <img
                        src={currentImage.imageUrl}
                        alt={`Chapter ${chapterNum} visualization`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3">
                        <span className="system-text text-primary/70 text-xs">
                          CH {chapterNum}
                        </span>
                        {hasMultiple && (
                          <span className="system-text text-primary/50 text-[10px] mt-1">
                            {currentIndex + 1}/{chapterImages.length}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <StaticNoise />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="system-text text-muted-foreground/30 text-xs">
                          CH {chapterNum}
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-size image viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in p-4 overflow-y-auto"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full space-y-6 my-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-lg" />
              <img
                src={selectedImage.imageUrl}
                alt={`Chapter ${selectedImage.chapterNumber} visualization`}
                className="relative w-full h-auto rounded-lg shadow-2xl border border-primary/30"
              />
            </div>
            
            <div className="space-y-4 text-center px-6">
              <div className="system-text text-primary/70 text-sm uppercase tracking-wider">
                Chapter {selectedImage.chapterNumber}
              </div>
              
              <div className="max-w-2xl mx-auto">
                <blockquote className="text-foreground/90 text-sm leading-relaxed italic border-l-2 border-primary/30 pl-4 text-left">
                  "{selectedImage.textContext}"
                </blockquote>
              </div>

              <p className="system-text text-muted-foreground/50 text-xs pt-4">
                TAP ANYWHERE TO CLOSE
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
