export interface Chapter {
  number: number;
  title: string;
  content: string;
  symbol?: string;
}

export function parseStory(storyText: string): Chapter[] {
  const lines = storyText.split('\n');
  const chapters: Chapter[] = [];
  let currentChapter: Partial<Chapter> | null = null;
  let contentLines: string[] = [];
  
  // Find the separator line to skip table of contents
  const separatorIndex = lines.findIndex(line => line.trim() === '________________');
  const startIndex = separatorIndex >= 0 ? separatorIndex + 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines at the start
    if (!line) continue;
    
    // Check for chapter number pattern (e.g., "1: THE FIRST ENTRY")
    const chapterMatch = line.match(/^(\d+):\s*(.+)$/);
    
    if (chapterMatch) {
      // Save previous chapter if exists
      if (currentChapter && currentChapter.number) {
        chapters.push({
          number: currentChapter.number,
          title: currentChapter.title || '',
          content: contentLines.join('\n').trim(),
          symbol: currentChapter.symbol
        });
        contentLines = [];
      }
      
      // Start new chapter
      currentChapter = {
        number: parseInt(chapterMatch[1]),
        title: chapterMatch[2]
      };
    } else if (line === '⚪' && currentChapter) {
      // Symbol marker for chapter
      currentChapter.symbol = '⚪';
    } else if (currentChapter) {
      // Add to chapter content (all non-chapter-header lines)
      contentLines.push(line);
    }
  }
  
  // Add final chapter
  if (currentChapter && currentChapter.number) {
    chapters.push({
      number: currentChapter.number,
      title: currentChapter.title || '',
      content: contentLines.join('\n').trim(),
      symbol: currentChapter.symbol
    });
  }
  
  return chapters;
}

export function getChapterById(chapters: Chapter[], id: number): Chapter | undefined {
  return chapters.find(ch => ch.number === id);
}
