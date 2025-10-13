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
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
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
    } else if (currentChapter && line && !line.startsWith('TABLE OF CONTENTS') && line !== '________________') {
      // Add to chapter content
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
