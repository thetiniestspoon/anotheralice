import { useState, useEffect } from 'react';
import { PodEntry } from '@/components/PodEntry';
import { ChapterReader } from '@/components/ChapterReader';
import { ChapterMenu } from '@/components/ChapterMenu';
import { SystemDiagnostic } from '@/components/SystemDiagnostic';
import { parseStory, Chapter } from '@/utils/storyParser';
import storyData from '@/data/story.txt?raw';

type ViewMode = 'entry' | 'menu' | 'diagnostic' | 'reading';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('entry');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [bloomLevel, setBloomLevel] = useState(0);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  // Parse story on mount
  useEffect(() => {
    const parsed = parseStory(storyData);
    setChapters(parsed);
  }, []);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedChapter = localStorage.getItem('alice_current_chapter');
    const savedBloom = localStorage.getItem('alice_bloom_level');
    
    if (savedChapter) setCurrentChapter(parseInt(savedChapter));
    if (savedBloom) setBloomLevel(parseInt(savedBloom));
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('alice_current_chapter', currentChapter.toString());
    localStorage.setItem('alice_bloom_level', bloomLevel.toString());
  }, [currentChapter, bloomLevel]);

  const handleEnterPod = () => {
    setViewMode('menu');
  };

  const handleSelectChapter = (chapterNumber: number) => {
    setCurrentChapter(chapterNumber);
    setShowDiagnostic(true);
    setViewMode('diagnostic');
  };

  const handleDiagnosticComplete = () => {
    setShowDiagnostic(false);
    setViewMode('reading');
  };

  const handleNavigate = (direction: 'prev' | 'next' | 'menu') => {
    if (direction === 'menu') {
      setViewMode('menu');
    } else if (direction === 'prev' && currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      setShowDiagnostic(true);
      setViewMode('diagnostic');
    } else if (direction === 'next' && currentChapter < chapters.length) {
      setCurrentChapter(currentChapter + 1);
      setShowDiagnostic(true);
      setViewMode('diagnostic');
    }
  };

  const handleBloomIncrease = () => {
    setBloomLevel((prev) => Math.min(prev + 1, 10));
  };

  const currentChapterData = chapters.find((ch) => ch.number === currentChapter);

  if (chapters.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="system-text text-primary/70 animate-pulse">
          LOADING ALICE SYSTEMS...
        </div>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'entry' && <PodEntry onEnter={handleEnterPod} />}
      
      {viewMode === 'menu' && (
        <ChapterMenu
          chapters={chapters}
          currentChapter={currentChapter}
          onSelectChapter={handleSelectChapter}
          bloomLevel={bloomLevel}
        />
      )}
      
      {viewMode === 'diagnostic' && showDiagnostic && (
        <SystemDiagnostic
          chapterNumber={currentChapter}
          onComplete={handleDiagnosticComplete}
        />
      )}
      
      {viewMode === 'reading' && currentChapterData && (
        <ChapterReader
          chapter={currentChapterData}
          onNavigate={handleNavigate}
          canGoPrev={currentChapter > 1}
          canGoNext={currentChapter < chapters.length}
          bloomLevel={bloomLevel}
          onBloomIncrease={handleBloomIncrease}
        />
      )}
    </>
  );
};

export default Index;
