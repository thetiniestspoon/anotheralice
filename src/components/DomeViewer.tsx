import { useState } from 'react';
import { GeneratedImage } from '@/hooks/useImageGeneration';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DomeViewerProps {
  images: GeneratedImage[];
  onClose: () => void;
}

export const DomeViewer = ({ images, onClose }: DomeViewerProps) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-fade-in">
      {/* Header */}
      <header className="relative z-10 border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="system-text text-primary/70 text-xs uppercase tracking-wider">
              Memory Archive
            </div>
            <div className="text-sm text-foreground/80">
              {images.length} {images.length === 1 ? 'Visualization' : 'Visualizations'}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-primary"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </header>

      {/* Dome interior - checkerboard mosaic */}
      <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="max-w-6xl mx-auto">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
              <div className="w-24 h-24 rounded-full border-2 border-primary/20 border-dashed flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/10" />
              </div>
              <div className="space-y-2">
                <p className="system-text text-muted-foreground text-sm">
                  NO VISUALIZATIONS YET
                </p>
                <p className="text-foreground/60 text-xs max-w-md">
                  As you read, ALICE will offer to visualize moments from the story. 
                  Your created images will appear here in a mosaic gallery.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <button
                  key={image.timestamp}
                  onClick={() => setSelectedImage(image)}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 bg-muted/20 group"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <img
                    src={image.imageUrl}
                    alt={`Chapter ${image.chapterNumber} visualization`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <span className="system-text text-primary/70 text-xs">
                      CH {image.chapterNumber}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full-size image viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <img
              src={selectedImage.imageUrl}
              alt={`Chapter ${selectedImage.chapterNumber} visualization`}
              className="w-full h-auto rounded-lg shadow-2xl border border-primary/20"
            />
            <div className="mt-4 text-center space-y-2">
              <div className="system-text text-primary/70 text-sm">
                Chapter {selectedImage.chapterNumber}
              </div>
              <p className="text-foreground/60 text-xs max-w-2xl mx-auto line-clamp-3">
                {selectedImage.textContext.substring(0, 200)}...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
