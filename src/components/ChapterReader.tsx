import { useEffect, useState, useRef } from 'react';
import { Chapter } from '@/utils/storyParser';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';

interface ChapterReaderProps {
  chapter: Chapter;
  onNavigate: (direction: 'prev' | 'next' | 'menu') => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  bloomLevel: number;
  onBloomIncrease: () => void;
}

export const ChapterReader = ({
  chapter,
  onNavigate,
  canGoPrev,
  canGoNext,
  bloomLevel,
  onBloomIncrease,
}: ChapterReaderProps) => {
  const [revealedText, setRevealedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);
  const speedBoostTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Progressive text revelation with typing effect - preserving paragraph breaks
  useEffect(() => {
    setRevealedText('');
    setIsTyping(true);
    setTypingSpeed(20);
    let currentIndex = 0;
    const fullText = chapter.content;

    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setRevealedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, [chapter.number, typingSpeed]);

  // Scroll tracking for bloom system and speed boost
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollPercentage(percentage);

        // Increase bloom at certain scroll milestones
        if (percentage > 50 && bloomLevel < 5) {
          onBloomIncrease();
        }
        if (percentage > 90 && bloomLevel < 10) {
          onBloomIncrease();
        }

        // Speed boost when scrolling to bottom during typing
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        if (isAtBottom && isTyping) {
          setTypingSpeed(5);
          
          // Clear existing timeout
          if (speedBoostTimeoutRef.current) {
            clearTimeout(speedBoostTimeoutRef.current);
          }
          
          // Reset speed after 2 seconds of no scroll activity
          speedBoostTimeoutRef.current = setTimeout(() => {
            setTypingSpeed(20);
          }, 2000);
        }
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
      if (speedBoostTimeoutRef.current) {
        clearTimeout(speedBoostTimeoutRef.current);
      }
    };
  }, [bloomLevel, onBloomIncrease, isTyping]);

  // Calculate bloom-based color saturation
  const bloomSaturation = 20 + bloomLevel * 6;

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('menu')}
            className="text-muted-foreground hover:text-primary"
          >
            <List className="w-4 h-4 mr-2" />
            Chapters
          </Button>

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

          {/* Story text with typing effect - preserving paragraph breaks */}
          <div className="story-text text-foreground/90 leading-loose whitespace-pre-wrap">
            {revealedText}
            {isTyping && (
              <span
                className="inline-block w-2 h-5 ml-1 bg-primary/70"
                style={{ animation: 'typing-cursor 1s infinite' }}
              />
            )}
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
    </div>
  );
};
