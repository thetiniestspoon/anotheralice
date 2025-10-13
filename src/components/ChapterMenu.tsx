import { Chapter } from '@/utils/storyParser';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface ChapterMenuProps {
  chapters: Chapter[];
  currentChapter: number;
  onSelectChapter: (chapterNumber: number) => void;
  bloomLevel: number;
}

export const ChapterMenu = ({
  chapters,
  currentChapter,
  onSelectChapter,
  bloomLevel,
}: ChapterMenuProps) => {
  const bloomSaturation = 20 + bloomLevel * 6;

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
          <div className="inline-flex items-center gap-3 text-primary/70 mb-2">
            <BookOpen className="w-6 h-6" />
            <span className="system-text text-sm uppercase tracking-widest">
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
