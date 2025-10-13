import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PodEntryProps {
  onEnter: () => void;
}

export const PodEntry = ({ onEnter }: PodEntryProps) => {
  const [bootSequence, setBootSequence] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setBootSequence(1), 500),
      setTimeout(() => setBootSequence(2), 1500),
      setTimeout(() => setBootSequence(3), 2500),
      setTimeout(() => setReady(true), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[hsl(220,20%,6%)] via-[hsl(190,30%,8%)] to-[hsl(220,20%,6%)]">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${10 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-8 text-center space-y-12">
        {/* Pod title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-light tracking-wider text-foreground opacity-90">
            Another ALICE
          </h1>
          <p className="system-text text-muted-foreground uppercase tracking-widest text-sm">
            Memory Recovery System
          </p>
        </div>

        {/* Boot sequence */}
        <div className="system-text space-y-2 min-h-[120px]">
          {bootSequence >= 1 && (
            <div className="text-primary/70 animate-in fade-in duration-500">
              &gt; INITIALIZING MEMORY CORE...
            </div>
          )}
          {bootSequence >= 2 && (
            <div className="text-primary/70 animate-in fade-in duration-500">
              &gt; ALICE SYSTEMS: ONLINE
            </div>
          )}
          {bootSequence >= 3 && (
            <div className="text-primary/70 animate-in fade-in duration-500">
              &gt; MANUSCRIPT RECOVERED
            </div>
          )}
        </div>

        {/* Entry button */}
        {ready && (
          <div className="animate-in fade-in duration-1000">
            <Button
              onClick={onEnter}
              size="lg"
              className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 hover:border-primary/50 transition-all duration-500 px-12 py-6 text-lg tracking-wider"
            >
              ENTER POD
            </Button>
            <p className="mt-4 text-muted-foreground text-sm">
              Press to board the reading vessel
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-xs text-muted-foreground/50 space-y-1">
          <p>By Shawn Jordan</p>
          <p className="system-text">12 CHAPTERS AVAILABLE</p>
        </div>
      </div>
    </div>
  );
};
