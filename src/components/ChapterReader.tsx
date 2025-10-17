import { useEffect, useState, useRef } from 'react';
import { Chapter } from '@/utils/storyParser';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { AlicePrompt } from '@/components/AlicePrompt';
import { GeneratedImage } from '@/hooks/useImageGeneration';
import { TextCaptureBar } from '@/components/TextCaptureBar';
import { AliceButton } from '@/components/AliceButton';

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
}: ChapterReaderProps) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [revealProgress, setRevealProgress] = useState(0.15);
  const [aliceOpen, setAliceOpen] = useState(false);
  const [capturedText, setCapturedText] = useState('');
  const [captureBarPosition, setCaptureBarPosition] = useState(50); // Position in vh (50 = middle)
  const [scrollPosition, setScrollPosition] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(0);
  
  const CAPTURE_BAR_HEIGHT = 100; // Fixed height in pixels
  
  const containerRef = useRef<HTMLDivElement>(null);
  const readingContentRef = useRef<HTMLDivElement>(null);
  const lastScrollPos = useRef(0);
  const accumulatedScroll = useRef(0);

  // Reset on chapter change
  useEffect(() => {
    setRevealProgress(0.15);
    accumulatedScroll.current = 0;
    lastScrollPos.current = 0;
    setAliceOpen(false);
    setCapturedText('');
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [chapter.number]);

  // Calculate bloom-based color saturation
  const bloomSaturation = 20 + bloomLevel * 6;

  // Calculate revealed text based on scroll progress
  const revealedCharCount = Math.floor(chapter.content.length * revealProgress);
  const revealedText = chapter.content.substring(0, revealedCharCount);

  // Update spacer to ensure scrollable content
  const updateSpacer = () => {
    if (!containerRef.current || !readingContentRef.current) return;
    
    const containerHeight = containerRef.current.clientHeight;
    const contentHeight = readingContentRef.current.scrollHeight;
    const minExtra = 200; // Minimum extra scroll space
    
    const required = containerHeight + minExtra - contentHeight;
    setSpacerHeight(required > 0 ? required : 0);
  };

  // Update spacer when revealed text or ALICE panel changes
  useEffect(() => {
    // Delay to ensure DOM has updated
    const timer = setTimeout(updateSpacer, 50);
    return () => clearTimeout(timer);
  }, [revealedText, aliceOpen]);

  // Update spacer on window resize
  useEffect(() => {
    window.addEventListener('resize', updateSpacer);
    return () => window.removeEventListener('resize', updateSpacer);
  }, []);

  // Function to get text that intersects with capture bar
  const getCapturedText = (): string => {
    if (!readingContentRef.current) return '';

    const captureBarTop = (window.innerHeight * captureBarPosition / 100) - CAPTURE_BAR_HEIGHT / 2;
    const captureBarBottom = (window.innerHeight * captureBarPosition / 100) + CAPTURE_BAR_HEIGHT / 2;

    const textElements = readingContentRef.current.querySelectorAll('p');
    let capturedParts: string[] = [];

    textElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      
      // Check if element intersects with capture bar
      if (rect.bottom >= captureBarTop && rect.top <= captureBarBottom) {
        capturedParts.push(element.textContent || '');
      }
    });

    let fullText = capturedParts.join(' ').trim();
    
    // Limit to ~500 characters
    if (fullText.length > 500) {
      fullText = fullText.substring(0, 500);
      // Try to end at sentence boundary
      const lastPeriod = fullText.lastIndexOf('.');
      const lastQuestion = fullText.lastIndexOf('?');
      const lastExclamation = fullText.lastIndexOf('!');
      const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);
      
      if (lastSentenceEnd > 400) {
        fullText = fullText.substring(0, lastSentenceEnd + 1);
      }
    }

    return fullText;
  };

  // Update captured text on scroll or capture bar height change
  useEffect(() => {
    const updateCapturedText = () => {
      const text = getCapturedText();
      setCapturedText(text);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateCapturedText);
      // Initial capture
      const timer = setTimeout(updateCapturedText, 100);
      
      return () => {
        container.removeEventListener('scroll', updateCapturedText);
        clearTimeout(timer);
      };
    }
  }, [captureBarPosition, revealedText]);

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

  const handleAliceButtonClick = () => {
    if (capturedText.length >= 10) {
      // Store scroll position
      if (containerRef.current) {
        setScrollPosition(containerRef.current.scrollTop);
      }
      setAliceOpen(true);
    }
  };

  const handleAliceAccept = (imageUrl: string) => {
    // Add to gallery
    onImageGenerated({
      imageUrl,
      chapterNumber: chapter.number,
      timestamp: new Date().toISOString(),
      textContext: capturedText,
    });
  };

  const handleAliceDismiss = () => {
    setAliceOpen(false);
    // Restore scroll position
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = scrollPosition;
      }
    }, 50);
  };

  // Render content with orb separators
  const renderContent = () => {
    const paragraphs = revealedText.split('\n').filter(p => p.trim());
    
    return paragraphs.map((para, idx) => {
      const trimmed = para.trim();
      
      // Check for special separator patterns
      const isOrbSeparator = /^⸻⸻⚪/.test(trimmed) || /^⚪⸻⚪/.test(trimmed);
      const isLineSeparator = /^_{10,}$/.test(trimmed);
      const isSectionBreak = /^[•⚪⭕○◯◉●◌◍◎◐◑◒◓◔◕◖◗]$/.test(trimmed);
      
      if (isOrbSeparator || isLineSeparator) {
        // Render as styled orb separator
        return (
          <div key={idx} className="flex items-center justify-center my-12">
            <div className="relative">
              {/* Outer glow */}
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-30"
                style={{
                  background: `radial-gradient(circle, hsl(190 ${bloomSaturation}% 45%) 0%, transparent 70%)`,
                  width: '80px',
                  height: '80px',
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%',
                }}
              />
              {/* Core orb */}
              <div
                className="relative w-8 h-8 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle at 30% 30%, hsl(190 ${bloomSaturation}% 65%), hsl(190 ${bloomSaturation}% 35%))`,
                  boxShadow: `0 0 30px hsl(190 ${bloomSaturation}% 45% / 0.6), inset 0 0 10px hsl(190 ${bloomSaturation}% 25%)`,
                }}
              />
              {/* Decorative lines if present */}
              {isOrbSeparator && (
                <>
                  <div 
                    className="absolute top-1/2 -left-12 w-10 h-px opacity-40"
                    style={{ background: `hsl(190 ${bloomSaturation}% 45%)` }}
                  />
                  <div 
                    className="absolute top-1/2 -right-12 w-10 h-px opacity-40"
                    style={{ background: `hsl(190 ${bloomSaturation}% 45%)` }}
                  />
                </>
              )}
            </div>
          </div>
        );
      } else if (isSectionBreak) {
        return (
          <p key={idx} className="text-center text-2xl my-8">
            {para}
          </p>
        );
      } else {
        return (
          <p key={idx} className="mb-4">
            {para}
          </p>
        );
      }
    });
  };

  return (
    <div className="fixed inset-0 flex">
      {/* Reading area - transitions width when ALICE opens */}
      <div 
        className="flex flex-col transition-all duration-300"
        style={{ 
          width: aliceOpen ? 'calc(100% - 384px)' : '100%',
        }}
      >
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

        {/* Main reading area with overlay components */}
        <div className="relative flex-1">
          <div
            ref={containerRef}
            className="h-full overflow-y-auto overscroll-contain"
            style={{
              touchAction: 'pan-y',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Text capture bar overlay INSIDE scroll container to ensure touch scrolling works */}
            <TextCaptureBar
              position={captureBarPosition}
              onPositionChange={setCaptureBarPosition}
              bloomSaturation={bloomSaturation}
              height={CAPTURE_BAR_HEIGHT}
            />

            <article ref={readingContentRef} className="max-w-3xl mx-auto px-8 py-16 space-y-8">
              {/* Chapter symbol */}
              {chapter.symbol && (
                <div className="text-center text-4xl text-primary/60 mb-12">
                  {chapter.symbol}
                </div>
              )}

              {/* Story text */}
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

              {/* Dynamic spacer to ensure scrollability */}
              <div style={{ height: spacerHeight }} aria-hidden="true" />
            </article>
          </div>


          {/* ALICE button */}
          <AliceButton
            isActive={aliceOpen}
            isDisabled={!capturedText || capturedText.length < 10}
            onClick={handleAliceButtonClick}
            bloomSaturation={bloomSaturation}
            position={captureBarPosition}
          />
        </div>
      </div>

      {/* ALICE panel - slides in from right */}
      {aliceOpen && (
        <AlicePrompt
          capturedText={capturedText}
          chapterNumber={chapter.number}
          onAccept={handleAliceAccept}
          onDismiss={handleAliceDismiss}
        />
      )}
    </div>
  );
};
