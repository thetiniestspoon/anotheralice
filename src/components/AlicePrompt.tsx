import { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-md w-full mx-4 p-6 bg-card/95 border border-primary/20 rounded-lg shadow-2xl">
        {/* ALICE glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative space-y-4">
          {/* ALICE header */}
          <div className="text-center space-y-2">
            <div className="system-text text-primary text-sm uppercase tracking-wider">
              ALICE
            </div>
            <p className="text-foreground/90 text-sm leading-relaxed">
              Would you like me to visualize this moment?
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
              disabled={isGenerating}
              className="flex-1 border-muted-foreground/20 hover:border-primary/40"
            >
              Not Now
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-primary/90 hover:bg-primary"
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
  );
};
