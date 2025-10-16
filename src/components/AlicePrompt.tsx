import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, X, Check } from 'lucide-react';

interface AlicePromptProps {
  capturedText: string;
  chapterNumber: number;
  onAccept: (imageUrl: string) => void;
  onDismiss: () => void;
}

export const AlicePrompt = ({ 
  capturedText, 
  chapterNumber, 
  onAccept, 
  onDismiss 
}: AlicePromptProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
            textContext: capturedText,
            chapterNumber,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
      
      // Show success animation
      setShowSuccess(true);
      
      // Add to gallery
      onAccept(data.imageUrl);
      
      // Auto-close after 1.5s
      setTimeout(() => {
        onDismiss();
      }, 1500);
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="fixed right-0 top-0 h-full w-96 bg-card/95 backdrop-blur-lg border-l-2 border-primary/20 shadow-2xl z-30 animate-slide-in-right flex flex-col"
      style={{
        animation: 'slide-in-right 0.3s ease-out',
      }}
    >
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center justify-between mb-2">
          <div className="system-text text-primary text-sm uppercase tracking-wider">
            ALICE
          </div>
          <button
            onClick={onDismiss}
            className="w-8 h-8 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Captured text preview */}
        <div className="p-4 bg-muted/30 border border-primary/10 rounded-lg">
          <blockquote className="text-foreground/80 text-sm leading-relaxed italic">
            "{capturedText}"
          </blockquote>
        </div>

        {/* ALICE's question */}
        {!generatedImage && (
          <div className="text-center space-y-4">
            <p className="text-foreground/90 text-base leading-relaxed">
              Would you like me to visualize this moment?
            </p>

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
                className="flex-1"
              >
                Not Now
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1"
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
        )}

        {/* Generated image display */}
        {generatedImage && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border-2 border-primary/30">
              <img
                src={generatedImage}
                alt="Generated visualization"
                className="w-full h-auto"
              />
            </div>

            {/* Success message */}
            {showSuccess && (
              <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 border border-primary/30 rounded-lg animate-fade-in">
                <Check className="w-5 h-5 text-primary animate-scale-in" />
                <span className="system-text text-sm text-primary">
                  Added to Gallery
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
