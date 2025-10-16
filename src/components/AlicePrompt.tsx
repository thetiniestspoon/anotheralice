import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AlicePromptProps {
  textContext: string;
  chapterNumber: number;
  onAccept: (imageUrl: string) => void;
  onDismiss: () => void;
}

export const AlicePrompt = ({ 
  textContext, 
  chapterNumber, 
  onAccept, 
  onDismiss 
}: AlicePromptProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "Would you like me to visualize this moment?";

  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll when prompt is visible
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            textContext,
            chapterNumber,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      onAccept(data.imageUrl);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-2xl w-full mx-4 p-8 space-y-6">
        {/* Highlighted text passage */}
        <div className="relative p-6 bg-card/90 border border-primary/30 rounded-lg shadow-xl animate-scale-in">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-transparent pointer-events-none animate-pulse" />
          <blockquote className="relative text-foreground/90 text-sm leading-relaxed italic">
            "{textContext}"
          </blockquote>
          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary/60 animate-pulse" />
          </div>
        </div>

        {/* ALICE prompt card */}
        <div className="relative p-6 bg-card/95 border border-primary/20 rounded-lg shadow-2xl animate-scale-in" style={{ animationDelay: '200ms' }}>
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent pointer-events-none animate-pulse" />
          <div className="absolute -inset-1 rounded-lg bg-primary/10 blur-xl pointer-events-none" />
          
          <div className="relative space-y-4">
            {/* ALICE header */}
            <div className="text-center space-y-2">
              <div className="system-text text-primary text-sm uppercase tracking-wider">
                ALICE
              </div>
              <p className="text-foreground/90 text-base leading-relaxed min-h-[24px]">
                {displayedText}
                {displayedText.length < fullText.length && (
                  <span className="inline-block w-1 h-4 ml-1 bg-primary/70 animate-pulse" />
                )}
              </p>
            </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-xs">
              {error}
            </div>
          )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onDismiss}
                disabled={isGenerating || displayedText.length < fullText.length}
                className="flex-1 border-muted-foreground/20 hover:border-primary/40 disabled:opacity-50"
              >
                Not Now
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || displayedText.length < fullText.length}
                className="flex-1 bg-primary/90 hover:bg-primary disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Visualize'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
