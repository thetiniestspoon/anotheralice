import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface SystemDiagnosticProps {
  chapterNumber: number;
  onComplete: () => void;
}

const diagnosticMessages = [
  'SCANNING MEMORY SECTORS',
  'DEFRAGMENTING NARRATIVE CACHE',
  'CALIBRATING TEMPORAL SENSORS',
  'RESOLVING LINGUISTIC ARTIFACTS',
  'STABILIZING QUANTUM STORAGE',
  'REFRESHING NEURAL MATRICES',
  'SYNCHRONIZING TIME STAMPS',
  'OPTIMIZING DISPLAY PROTOCOLS',
];

export const SystemDiagnostic = ({ chapterNumber, onComplete }: SystemDiagnosticProps) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // Allow skip after 5 seconds
    const skipTimer = setTimeout(() => setCanSkip(true), 5000);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % diagnosticMessages.length);
    }, 2000);

    return () => {
      clearTimeout(skipTimer);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl mx-auto px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="system-text text-primary/70 uppercase tracking-widest text-sm">
            System Interlude
          </div>
          <div className="text-muted-foreground text-sm">
            Preparing Chapter {chapterNumber}
          </div>
        </div>

        {/* Diagnostic messages */}
        <div className="system-text space-y-3 min-h-[200px]">
          <div className="text-primary/90 animate-pulse">
            &gt; {diagnosticMessages[currentMessage]}
          </div>
          
          {/* Progress bar */}
          <div className="mt-8 space-y-2">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/60 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-primary/70 text-xs">
              {progress}%
            </div>
          </div>

          {/* System status */}
          <div className="mt-8 space-y-1 text-muted-foreground/60 text-xs">
            <div>&gt; ALICE.core.status: OPERATIONAL</div>
            <div>&gt; memory.integrity: {Math.floor(95 + Math.random() * 5)}%</div>
            <div>&gt; narrative.flow: STABLE</div>
          </div>
        </div>

        {/* Skip option */}
        {canSkip && (
          <div className="text-center animate-in fade-in duration-500">
            <Button
              onClick={onComplete}
              variant="ghost"
              className="text-muted-foreground hover:text-primary text-sm"
            >
              SKIP DIAGNOSTIC [SPACE]
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
