import { Chapter } from '@/utils/storyParser';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useRef } from 'react';

interface ChapterMenuProps {
  chapters: Chapter[];
  currentChapter: number;
  onSelectChapter: (chapterNumber: number) => void;
  bloomLevel: number;
  onOpenGallery: () => void;
  galleryImageCount: number;
}

// Decorative sphere separator for mobile infinite scroll - now clickable
const SphereSeparator = ({ 
  bloomSaturation,
  onClick, 
  imageCount 
}: { 
  bloomSaturation: number;
  onClick: () => void; 
  imageCount: number;
}) => (
  <div className="flex items-center justify-center py-32">
    <button
      onClick={onClick}
      className="relative w-16 h-16 rounded-full border-2 border-primary/30 hover:border-primary/50 transition-all duration-500 hover:scale-110 group"
      style={{
        background: `radial-gradient(circle at 30% 30%, hsl(190 ${bloomSaturation}% 60% / 0.4), hsl(190 ${bloomSaturation}% 35% / 0.8))`,
        boxShadow: `0 0 40px hsl(190 ${bloomSaturation}% 45% / 0.3), inset 0 0 20px hsl(190 ${bloomSaturation}% 60% / 0.2)`,
        animation: 'float-sphere 20s infinite ease-in-out',
      }}
    >
      {/* Image count indicator */}
      {imageCount > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground system-text">
          {imageCount}
        </div>
      )}
      
      {/* Hover hint */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        <span className="system-text text-xs text-muted-foreground">
          {imageCount > 0 ? 'VIEW GALLERY' : 'MEMORY ARCHIVE'}
        </span>
      </div>
    </button>
  </div>
);

export const ChapterMenu = ({
  chapters,
  currentChapter,
  onSelectChapter,
  bloomLevel,
  onOpenGallery,
  galleryImageCount,
}: ChapterMenuProps) => {
  const bloomSaturation = 20 + bloomLevel * 6;
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  // For mobile: scroll to middle cycle on mount
  useEffect(() => {
    if (isMobile && scrollRef.current) {
      const middleCycleStart = scrollRef.current.scrollHeight / 3;
      isScrollingProgrammatically.current = true;
      scrollRef.current.scrollTop = middleCycleStart;
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 100);
    }
  }, [isMobile]);

  // Handle infinite scroll logic for mobile
  const handleScroll = () => {
    if (!isMobile || !scrollRef.current || isScrollingProgrammatically.current) return;

    const { scrollTop, scrollHeight } = scrollRef.current;
    const cycleHeight = scrollHeight / 3;

    // If scrolled near top, jump to equivalent position in middle cycle
    if (scrollTop < cycleHeight * 0.1) {
      isScrollingProgrammatically.current = true;
      scrollRef.current.scrollTop = scrollTop + cycleHeight;
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 50);
    }
    // If scrolled near bottom, jump to equivalent position in middle cycle
    else if (scrollTop > cycleHeight * 2.9) {
      isScrollingProgrammatically.current = true;
      scrollRef.current.scrollTop = scrollTop - cycleHeight;
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 50);
    }
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-background">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: `hsl(190 ${bloomSaturation}% 45%)`,
                opacity: 0.15,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-particle ${20 + Math.random() * 10}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        <ScrollArea className="h-full">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="overflow-y-auto h-screen"
          >
            <div className="px-6 py-8 space-y-4">
              {/* Render 3 cycles of chapters for infinite scroll */}
              {[0, 1, 2].map((cycleIndex) => (
                <div key={cycleIndex}>
                  {chapters.map((chapter) => {
                    const isRead = chapter.number <= currentChapter;
                    const isCurrent = chapter.number === currentChapter;

                    return (
                      <Button
                        key={`${cycleIndex}-${chapter.number}`}
                        onClick={() => onSelectChapter(chapter.number)}
                        className={`
                          w-full h-auto p-6 mb-4 flex flex-col items-start gap-2 text-left
                          bg-card/50 hover:bg-card/80 border transition-all duration-300
                          ${
                            isCurrent
                              ? 'border-primary/50 shadow-lg shadow-primary/10'
                              : 'border-border/30 hover:border-primary/30'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div
                            className="system-text text-xs font-medium"
                            style={{
                              color: isRead
                                ? `hsl(190 ${bloomSaturation}% 50%)`
                                : 'hsl(220 10% 40%)',
                            }}
                          >
                            {String(chapter.number).padStart(2, '0')}
                          </div>
                          {chapter.symbol && (
                            <div
                              className="text-lg"
                              style={{
                                color: isRead
                                  ? `hsl(190 ${bloomSaturation}% 50%)`
                                  : 'hsl(220 10% 40%)',
                              }}
                            >
                              {chapter.symbol}
                            </div>
                          )}
                        </div>

                        <div className="text-base font-normal text-foreground/90">
                          {chapter.title}
                        </div>

                        {isCurrent && (
                          <div className="system-text text-xs text-primary/70 mt-1">
                            CURRENT CHAPTER
                          </div>
                        )}
                      </Button>
                    );
                  })}
                  {cycleIndex < 2 && (
                    <SphereSeparator 
                      bloomSaturation={bloomSaturation} 
                      onClick={onOpenGallery}
                      imageCount={galleryImageCount}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background overflow-y-auto">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `hsl(190 ${bloomSaturation}% 45%)`,
              opacity: 0.15,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${20 + Math.random() * 10}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <BookOpen className="w-6 h-6 text-primary/70" />
            <span className="system-text text-sm uppercase tracking-widest text-primary/70">
              Memory Archive
            </span>
          </div>
          <h1 className="text-5xl font-light tracking-wide text-foreground">
            Another ALICE
          </h1>
          <p className="text-muted-foreground text-sm">
            Select a chapter to continue your journey
          </p>
        </div>

        {/* Chapter grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {chapters.map((chapter) => {
            const isRead = chapter.number <= currentChapter;
            const isCurrent = chapter.number === currentChapter;

            return (
              <Button
                key={chapter.number}
                onClick={() => onSelectChapter(chapter.number)}
                className={`
                  h-auto p-6 flex flex-col items-start gap-2 text-left
                  bg-card/50 hover:bg-card/80 border transition-all duration-300
                  ${
                    isCurrent
                      ? 'border-primary/50 shadow-lg shadow-primary/10'
                      : 'border-border/30 hover:border-primary/30'
                  }
                `}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className="system-text text-xs font-medium"
                    style={{
                      color: isRead
                        ? `hsl(190 ${bloomSaturation}% 50%)`
                        : 'hsl(220 10% 40%)',
                    }}
                  >
                    {String(chapter.number).padStart(2, '0')}
                  </div>
                  {chapter.symbol && (
                    <div
                      className="text-lg"
                      style={{
                        color: isRead
                          ? `hsl(190 ${bloomSaturation}% 50%)`
                          : 'hsl(220 10% 40%)',
                      }}
                    >
                      {chapter.symbol}
                    </div>
                  )}
                </div>

                <div className="text-base font-normal text-foreground/90">
                  {chapter.title}
                </div>

                {isCurrent && (
                  <div className="system-text text-xs text-primary/70 mt-1">
                    CURRENT CHAPTER
                  </div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Gallery Separator - Between chapters and footer */}
        <div className="max-w-3xl mx-auto mt-16">
          <SphereSeparator 
            bloomSaturation={bloomSaturation}
            onClick={onOpenGallery}
            imageCount={galleryImageCount}
          />
        </div>

        {/* Footer info */}
        <div className="text-center mt-16 space-y-2">
          <div className="inline-flex items-center gap-2 system-text text-xs text-muted-foreground/50">
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background:
                      i < bloomLevel
                        ? `hsl(190 ${bloomSaturation}% 45%)`
                        : 'hsl(220 10% 25%)',
                    opacity: i < bloomLevel ? 0.8 : 0.3,
                  }}
                />
              ))}
            </div>
            <span>BLOOM LEVEL: {bloomLevel}/10</span>
          </div>
          <p className="text-xs text-muted-foreground/40">
            Your journey through the manuscript is being tracked
          </p>
        </div>
      </div>
    </div>
  );
};
