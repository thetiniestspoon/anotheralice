import { useEffect, useState, useRef, useMemo } from 'react';
import { Chapter } from '@/utils/storyParser';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { AlicePrompt } from '@/components/AlicePrompt';
import { GeneratedImage } from '@/hooks/useImageGeneration';
import { alicePromptPoints } from '@/utils/alicePromptPoints';

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
  const [promptContext, setPromptContext] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollPos = useRef(0);
  const accumulatedScroll = useRef(0);
  const hasShownPrompt = useRef(false);

  // Get the prompt point for this chapter
  const promptPoint = useMemo(
    () => alicePromptPoints.find(p => p.chapterNumber === chapter.number),
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
    hasShownPrompt.current = false;
    setShowAlicePrompt(false);
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
      // Every 250px of scrolling reveals more text
      const totalContentLength = chapter.content.length;
      const revealRate = totalContentLength / 1000; // Adjust for desired reveal speed
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

      // Show ALICE prompt at defined trigger point (once per chapter)
      if (promptPoint && percentage >= promptPoint.triggerPosition * 100 && !hasShownPrompt.current) {
        hasShownPrompt.current = true;
        setPromptContext(promptPoint.textPassage);
        setShowAlicePrompt(true);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [bloomLevel, onBloomIncrease, chapter.content, chapter.number]);

  // Calculate bloom-based color saturation
  const bloomSaturation = 20 + bloomLevel * 6;

  // Calculate revealed text based on scroll progress
  const revealedCharCount = Math.floor(chapter.content.length * revealProgress);
  const revealedText = chapter.content.substring(0, revealedCharCount);

  const handleAliceAccept = (imageUrl: string) => {
    onImageGenerated({
      imageUrl,
      chapterNumber: chapter.number,
      timestamp: new Date().toISOString(),
      textContext: promptContext,
    });
    setShowAlicePrompt(false);
  };

  const handleAliceDismiss = () => {
    setShowAlicePrompt(false);
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

          {/* Story text with parallax scroll reveal */}
          <div className="story-text text-foreground/90 leading-loose space-y-4">
            {parsedContent.map((line, index) => {
              const lineStartPos = parsedContent
                .slice(0, index)
                .reduce((acc, l) => acc + l.text.length + 1, 0);
              const lineEndPos = lineStartPos + line.text.length;
              
              // Calculate if this line should be visible
              const isVisible = lineStartPos < revealedCharCount;
              const visibleChars = Math.max(0, Math.min(
                line.text.length,
                revealedCharCount - lineStartPos
              ));

              if (!isVisible) return null;

              const visibleText = line.text.substring(0, visibleChars);

              return (
                <div
                  key={index}
                  className={line.isSectionBreak ? 'text-center' : 'text-justify'}
                  style={{
                    opacity: visibleChars / line.text.length,
                    transition: 'opacity 0.3s ease-out',
                  }}
                >
                  {visibleText}
                </div>
              );
            })}
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
      {showAlicePrompt && (
        <AlicePrompt
          textContext={promptContext}
          chapterNumber={chapter.number}
          onAccept={handleAliceAccept}
          onDismiss={handleAliceDismiss}
        />
      )}
    </div>
  );
};
