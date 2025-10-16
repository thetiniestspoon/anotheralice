import { useEffect, useState, useRef, useMemo } from 'react';
import { Chapter } from '@/utils/storyParser';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { AlicePrompt } from '@/components/AlicePrompt';
import { GeneratedImage } from '@/hooks/useImageGeneration';
import { alicePromptPoints, AlicePromptPoint } from '@/utils/alicePromptPoints';

interface ChapterReaderProps {
  chapter: Chapter;
  onNavigate: (direction: 'prev' | 'next' | 'menu') => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  bloomLevel: number;
  onBloomIncrease: () => void;
  onImageGenerated: (image: GeneratedImage) => void;
  onOpenGallery: () => void;
  galleryImageCount: number;
}

export const ChapterReader = ({
  chapter,
  onNavigate,
  canGoPrev,
  canGoNext,
  bloomLevel,
  onBloomIncrease,
  onImageGenerated,
  onOpenGallery,
  galleryImageCount,
}: ChapterReaderProps) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [revealProgress, setRevealProgress] = useState(0.15);
  const [showAlicePrompt, setShowAlicePrompt] = useState(false);
  const [activePromptPoint, setActivePromptPoint] = useState<AlicePromptPoint | null>(null);
  const [usedPointIds, setUsedPointIds] = useState<Set<string>>(new Set());
  const [embeddedImages, setEmbeddedImages] = useState<Map<string, string>>(new Map());
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollPos = useRef(0);
  const accumulatedScroll = useRef(0);

  // Get all prompt points for this chapter
  const promptPoints = useMemo(
    () => alicePromptPoints.filter(p => p.chapterNumber === chapter.number),
    [chapter.number]
  );

  // Parse content to identify section breaks (standalone symbols)
  const parsedContent = useMemo(() => {
    const lines = chapter.content.split('\n');
    return lines.map((line) => ({
      text: line,
      isSectionBreak: /^[•⚪⭕○◯◉●◌◍◎◐◑◒◓◔◕◖◗]$/.test(line.trim()),
    }));
  }, [chapter.content]);

  // Reset on chapter change
  useEffect(() => {
    setRevealProgress(0.15);
    accumulatedScroll.current = 0;
    lastScrollPos.current = 0;
    setUsedPointIds(new Set());
    setEmbeddedImages(new Map());
    setShowAlicePrompt(false);
    setActivePromptPoint(null);
    setPendingImageUrl(null);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [chapter.number]);

  // Parallax scroll-based text revelation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      
      // Calculate scroll percentage
      const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setScrollPercentage(percentage);

      // Calculate scroll velocity and accumulate
      const scrollDelta = Math.abs(scrollTop - lastScrollPos.current);
      lastScrollPos.current = scrollTop;
      accumulatedScroll.current += scrollDelta;

      // Reveal text based on accumulated scroll distance
      const totalContentLength = chapter.content.length;
      const revealRate = totalContentLength / 1000;
      const newProgress = Math.min(
        0.15 + (accumulatedScroll.current * revealRate / totalContentLength) * 0.85,
        1
      );
      setRevealProgress(newProgress);

      // Increase bloom at scroll milestones
      if (percentage > 50 && bloomLevel < 5) {
        onBloomIncrease();
      }
      if (percentage > 90 && bloomLevel < 10) {
        onBloomIncrease();
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [bloomLevel, onBloomIncrease, chapter.content.length]);

  // Calculate bloom-based color saturation
  const bloomSaturation = 20 + bloomLevel * 6;

  // Calculate revealed text based on scroll progress
  const revealedCharCount = Math.floor(chapter.content.length * revealProgress);

  // Handle clicking a glowing dot
  const handleDotClick = (point: AlicePromptPoint) => {
    setActivePromptPoint(point);
    setShowAlicePrompt(true);
  };

  // Handle image generation completion
  const handleAliceAccept = (imageUrl: string) => {
    setPendingImageUrl(imageUrl);
    setShowAlicePrompt(false);
    // Image is now pending - waiting for user to click it
  };

  const handleAliceDismiss = () => {
    setShowAlicePrompt(false);
    setActivePromptPoint(null);
  };

  // Handle clicking the pending image to embed it
  const handlePendingImageClick = () => {
    if (pendingImageUrl && activePromptPoint) {
      // Add to gallery
      onImageGenerated({
        imageUrl: pendingImageUrl,
        chapterNumber: chapter.number,
        timestamp: new Date().toISOString(),
        textContext: activePromptPoint.textPassage,
      });
      
      // Embed the image
      setEmbeddedImages(prev => new Map(prev).set(activePromptPoint.id, pendingImageUrl));
      setUsedPointIds(prev => new Set(prev).add(activePromptPoint.id));
      
      // Clear pending state
      setPendingImageUrl(null);
      setActivePromptPoint(null);
    }
  };

  // Parse content with embedded images and dots
  const renderContent = () => {
    let currentPos = 0;
    const elements: JSX.Element[] = [];
    
    // Sort prompt points by character position
    const sortedPoints = [...promptPoints].sort((a, b) => a.characterPosition - b.characterPosition);
    
    console.log('Chapter', chapter.number, 'render:', {
      totalPoints: sortedPoints.length,
      revealedChars: revealedCharCount,
      chapterLength: chapter.content.length,
      points: sortedPoints.map(p => ({
        id: p.id,
        pos: p.characterPosition,
        visible: p.characterPosition <= revealedCharCount
      }))
    });
    
    sortedPoints.forEach((point, index) => {
      // Add text before this point
      if (point.characterPosition > currentPos && revealedCharCount > currentPos) {
        const endPos = Math.min(point.characterPosition, revealedCharCount);
        const textSegment = chapter.content.substring(currentPos, endPos);
        elements.push(
          <span key={`text-${index}`}>{textSegment}</span>
        );
        currentPos = endPos;
      }
      
      // Check if this point has an embedded image
      const embeddedImage = embeddedImages.get(point.id);
      if (embeddedImage) {
        elements.push(
          <img
            key={`img-${point.id}`}
            src={embeddedImage}
            alt={point.description}
            className="inline-block float-right ml-4 mb-4 w-64 h-64 object-cover rounded-lg border-2 border-primary/30 shadow-lg"
          />
        );
      } else if (!usedPointIds.has(point.id) && point.characterPosition <= revealedCharCount) {
        // Show glowing dot if not used and text is revealed up to this point
        console.log('Rendering dot for', point.id);
        elements.push(
          <button
            key={`dot-${point.id}`}
            onClick={() => handleDotClick(point)}
            className="inline-block mx-1 w-2 h-2 rounded-full bg-primary/60 animate-pulse hover:scale-150 transition-transform cursor-pointer"
            style={{
              boxShadow: `0 0 10px hsl(190 ${bloomSaturation}% 45% / 0.6)`,
            }}
            aria-label={`Visualize: ${point.description}`}
          />
        );
        currentPos = point.characterPosition;
      }
    });
    
    // Add remaining text
    if (currentPos < revealedCharCount) {
      elements.push(
        <span key="text-final">{chapter.content.substring(currentPos, revealedCharCount)}</span>
      );
    }
    
    return elements;
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      {/* Parallax background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Nebula gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, 
              hsl(190 ${bloomSaturation}% 12%) 0%, 
              hsl(220 20% 6%) 50%,
              hsl(260 ${bloomSaturation * 0.8}% 10%) 100%)`,
          }}
        />

        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full"
            style={{
              background: `hsl(190 ${bloomSaturation}% 45%)`,
              opacity: 0.2 + (bloomLevel / 50),
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${15 + Math.random() * 15}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header - Chapter info and navigation */}
      <header className="relative z-10 border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('menu')}
              className="text-muted-foreground hover:text-primary"
            >
              <List className="w-4 h-4 mr-2" />
              Chapters
            </Button>
          </div>

          <div className="text-center">
            <div className="system-text text-primary/70 text-xs uppercase tracking-wider">
              Chapter {chapter.number}
            </div>
            <div className="text-sm text-foreground/80">{chapter.title}</div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('prev')}
              disabled={!canGoPrev}
              className="text-muted-foreground hover:text-primary disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('next')}
              disabled={!canGoNext}
              className="text-muted-foreground hover:text-primary disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Reading progress bar */}
        <div className="h-0.5 bg-muted">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${scrollPercentage}%`,
              background: `hsl(190 ${bloomSaturation}% 45%)`,
            }}
          />
        </div>
      </header>

      {/* Main reading area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overscroll-contain"
      >
        <article className="max-w-3xl mx-auto px-8 py-16 space-y-8">
          {/* Chapter symbol */}
          {chapter.symbol && (
            <div className="text-center text-4xl text-primary/60 mb-12">
              {chapter.symbol}
            </div>
          )}

          {/* Story text with embedded images and glowing dots */}
          <div className="story-text text-foreground/90 leading-loose text-justify">
            {renderContent()}
          </div>

          {/* Bloom indicator */}
          <div className="pt-16 text-center">
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
              <span>BLOOM LEVEL</span>
            </div>
          </div>
        </article>
      </div>

      {/* ALICE prompt overlay */}
      {showAlicePrompt && activePromptPoint && (
        <AlicePrompt
          textContext={activePromptPoint.textPassage}
          chapterNumber={chapter.number}
          onAccept={handleAliceAccept}
          onDismiss={handleAliceDismiss}
        />
      )}

      {/* Pending generated image overlay */}
      {pendingImageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in cursor-pointer"
          onClick={handlePendingImageClick}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <img
              src={pendingImageUrl}
              alt="Generated visualization"
              className="w-full h-auto rounded-lg border-2 border-primary/30 shadow-2xl"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <div className="bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/20 shadow-lg">
                <span className="system-text text-sm text-primary">
                  TAP TO EMBED IN TEXT
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
