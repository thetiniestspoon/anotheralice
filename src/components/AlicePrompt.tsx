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
  
  // Multi-stage animation state
  const [passageText, setPassageText] = useState('');
  const [showPassageContainer, setShowPassageContainer] = useState(false);
  const [showAliceCard, setShowAliceCard] = useState(false);
  const [showAliceLabel, setShowAliceLabel] = useState(false);
  const [displayedPrompt, setDisplayedPrompt] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  
  const fullPrompt = "Would you like me to visualize this moment?";

  // Staged animation sequence
  useEffect(() => {
    // Stage 1: Show passage container (immediately)
    setShowPassageContainer(true);
    
    // Stage 2: Type out the passage text (starts after 200ms)
    const passageTimer = setTimeout(() => {
      let index = 0;
      const passageInterval = setInterval(() => {
        if (index < textContext.length) {
          setPassageText(textContext.substring(0, index + 1));
          index++;
        } else {
          clearInterval(passageInterval);
          
          // Stage 3: Show ALICE card after passage completes
          setTimeout(() => {
            setShowAliceCard(true);
            
            // Stage 4: Show ALICE label
            setTimeout(() => {
              setShowAliceLabel(true);
              
              // Stage 5: Type out ALICE's question
              setTimeout(() => {
                let promptIndex = 0;
                const promptInterval = setInterval(() => {
                  if (promptIndex < fullPrompt.length) {
                    setDisplayedPrompt(fullPrompt.substring(0, promptIndex + 1));
                    promptIndex++;
                  } else {
                    clearInterval(promptInterval);
                    
                    // Stage 6: Show buttons
                    setTimeout(() => {
                      setShowButtons(true);
                    }, 300);
                  }
                }, 40);
              }, 400);
            }, 300);
          }, 500);
        }
      }, 15); // Fast typing for passage
    }, 200);

    return () => clearTimeout(passageTimer);
  }, [textContext, fullPrompt]);

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
        {/* Passage container - appears first */}
        {showPassageContainer && (
          <div 
            className="relative p-6 bg-card/90 border border-primary/30 rounded-lg shadow-xl transition-all duration-500"
            style={{
              opacity: showPassageContainer ? 1 : 0,
              transform: showPassageContainer ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" 
              style={{
                animation: passageText.length === textContext.length ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
              }}
            />
            <blockquote className="relative text-foreground/90 text-sm leading-relaxed italic min-h-[60px]">
              "{passageText}"
              {passageText.length < textContext.length && (
                <span className="inline-block w-0.5 h-4 ml-0.5 bg-primary/70 animate-pulse" />
              )}
            </blockquote>
            {passageText.length === textContext.length && (
              <div 
                className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-500"
                style={{
                  opacity: 1,
                  transform: 'scale(1)',
                }}
              >
                <div className="w-4 h-4 rounded-full bg-primary/60 animate-pulse" />
              </div>
            )}
          </div>
        )}

        {/* ALICE card - builds up after passage */}
        {showAliceCard && (
          <div 
            className="relative p-6 bg-card/95 border border-primary/20 rounded-lg shadow-2xl transition-all duration-500"
            style={{
              opacity: showAliceCard ? 1 : 0,
              transform: showAliceCard ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            {/* Pulsing glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
              style={{
                animation: showButtons ? 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
              }}
            />
            <div className="absolute -inset-1 rounded-lg bg-primary/10 blur-xl pointer-events-none" />
            
            <div className="relative space-y-4">
              {/* ALICE label */}
              {showAliceLabel && (
                <div 
                  className="text-center space-y-2 transition-all duration-300"
                  style={{
                    opacity: showAliceLabel ? 1 : 0,
                  }}
                >
                  <div className="system-text text-primary text-sm uppercase tracking-wider">
                    ALICE
                  </div>
                </div>
              )}

              {/* ALICE's question */}
              {displayedPrompt && (
                <div className="text-center">
                  <p className="text-foreground/90 text-base leading-relaxed min-h-[24px]">
                    {displayedPrompt}
                    {displayedPrompt.length < fullPrompt.length && (
                      <span className="inline-block w-1 h-4 ml-1 bg-primary/70 animate-pulse" />
                    )}
                  </p>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-xs animate-fade-in">
                  {error}
                </div>
              )}

              {/* Action buttons */}
              {showButtons && (
                <div 
                  className="flex gap-3 pt-2 transition-all duration-500"
                  style={{
                    opacity: showButtons ? 1 : 0,
                    transform: showButtons ? 'translateY(0)' : 'translateY(10px)',
                  }}
                >
                  <Button
                    variant="outline"
                    onClick={onDismiss}
                    disabled={isGenerating}
                    className="flex-1 border-muted-foreground/20 hover:border-primary/40 disabled:opacity-50"
                  >
                    Not Now
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
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
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
