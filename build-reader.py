#!/usr/bin/env python
"""Parse story.txt into structured JSON and build the static reader."""
import json
import re

def parse_story(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Chapter markers: lines that start with "N: TITLE" pattern
    chapter_pattern = re.compile(r'^(\d+):\s+(.+)$')
    separator = '________________'

    chapters = []
    current_chapter = None
    seen_first_separator = False
    in_epilogue = False
    epilogue_paragraphs = []

    # Chapter title lines from the TOC (lines 4-15)
    toc_titles = set()
    for line in lines[:16]:
        m = chapter_pattern.match(line.strip())
        if m:
            toc_titles.add(line.strip())

    i = 0
    while i < len(lines):
        line = lines[i].rstrip('\n')
        i += 1

        # Check for chapter start (N: TITLE)
        match = chapter_pattern.match(line.strip())
        if match and not in_epilogue:
            num = int(match.group(1))
            title = match.group(2).strip()

            # Skip TOC entries (before first separator)
            if not seen_first_separator:
                continue

            if current_chapter:
                chapters.append(current_chapter)
            current_chapter = {
                'number': num,
                'title': title,
                'paragraphs': []
            }
            continue

        # Track separators
        if line.strip() == separator:
            if not seen_first_separator:
                seen_first_separator = True
                continue
            # If we already have chapters, this separator before the epilogue
            # Only treat as epilogue separator if it's AFTER chapter 12
            if current_chapter and current_chapter['number'] == 12:
                chapters.append(current_chapter)
                current_chapter = None
                in_epilogue = True
            continue

        # Skip decorative lines (⚪, ⸻⚪⸻, etc.)
        stripped = line.strip()
        if not stripped:
            continue
        # Skip lines that are only ⚪ and ⸻ characters
        cleaned = stripped.replace('⚪', '').replace('⸻', '').replace('─', '').strip()
        if not cleaned and stripped:
            continue

        if in_epilogue:
            # Check for [add more here] flag
            epilogue_paragraphs.append(line)
        elif current_chapter:
            current_chapter['paragraphs'].append(line)

    # Add last chapter if not already added
    if current_chapter and current_chapter not in chapters:
        chapters.append(current_chapter)

    return chapters, epilogue_paragraphs

def main():
    chapters, epilogue = parse_story('src/data/story.txt')

    # Image mapping: which illustrations go with which chapter
    image_map = {}
    for ch_num in range(1, 13):
        ch = next((c for c in chapters if c['number'] == ch_num), None)
        if not ch:
            continue
        para_count = len(ch['paragraphs'])

        if ch_num == 1:
            image_map[ch_num] = [
                {'file': 'ch01-01-descent.jpg', 'alt': 'The Descent — ship tipping into the vortex', 'after_para': 0},
                {'file': 'ch01-02-graveyard.jpg', 'alt': 'The Graveyard in the Sky — suspended pods and debris', 'after_para': min(10, para_count-1)},
                {'file': 'ch01-03-drop.jpg', 'alt': 'The Drop — a pod falling into the dust sea', 'after_para': min(20, para_count-1)},
            ]
        elif ch_num == 2:
            image_map[ch_num] = [
                {'file': 'ch02-01-dust-sea.jpg', 'alt': 'The Dust Sea — vast gray expanse', 'after_para': 0},
                {'file': 'ch02-02-greenhouse.jpg', 'alt': 'The Gray Greenhouse', 'after_para': min(10, para_count-1)},
                {'file': 'ch02-03-gray-daffodil.jpg', 'alt': 'The Gray Daffodil — a whisper of yellow', 'after_para': min(20, para_count-1)},
            ]
        elif ch_num == 3:
            image_map[ch_num] = [
                {'file': 'ch03-01-bungee.jpg', 'alt': 'The Bungee — trudging across the dust sea', 'after_para': min(5, para_count-1)},
                {'file': 'ch03-02-eve-departure.jpg', 'alt': 'The Eve of Departure — hangar party', 'after_para': min(20, para_count-1)},
            ]
        elif ch_num == 4:
            image_map[ch_num] = [
                {'file': 'ch04-01-daffodil-bloom.jpg', 'alt': 'The Field of Daffodils — color exploding', 'after_para': min(5, para_count-1)},
                {'file': 'ch04-02-star-storm.jpg', 'alt': 'The Star Storm — stars falling from the ring', 'after_para': min(15, para_count-1)},
                {'file': 'ch04-03-swallowed.jpg', 'alt': 'Swallowed by the Sea', 'after_para': min(25, para_count-1)},
            ]
        elif ch_num == 5:
            image_map[ch_num] = [
                {'file': 'ch05-01-basin.jpg', 'alt': 'The Basin — discovering the ova', 'after_para': min(5, para_count-1)},
                {'file': 'ch05-02-artificial-womb.jpg', 'alt': 'The Artificial Womb — first glow of life', 'after_para': min(15, para_count-1)},
            ]
        elif ch_num == 6:
            image_map[ch_num] = [
                {'file': 'ch06-01-man-in-womb.jpg', 'alt': 'The Man in the Womb', 'after_para': min(5, para_count-1)},
                {'file': 'ch06-02-birth.jpg', 'alt': 'The Birth — first breath', 'after_para': min(20, para_count-1)},
                {'file': 'ch06-03-christmas-tree.jpg', 'alt': 'The Christmas Tree — rare color', 'after_para': min(35, para_count-1)},
            ]
        elif ch_num == 7:
            image_map[ch_num] = [
                {'file': 'ch07-01-evan-microscope.jpg', 'alt': 'Evan at the Microscope', 'after_para': min(5, para_count-1)},
                {'file': 'ch07-02-adam-dust-sea.jpg', 'alt': 'Adam on the Dust Sea — lost in daydreams', 'after_para': min(20, para_count-1)},
            ]
        elif ch_num == 8:
            image_map[ch_num] = [
                {'file': 'ch08-01-obsidian-finger.jpg', 'alt': 'The Obsidian Finger', 'after_para': min(5, para_count-1)},
                {'file': 'ch08-02-physician-nightmare.jpg', 'alt': "The Physician's Nightmare", 'after_para': min(20, para_count-1)},
            ]
        elif ch_num == 9:
            image_map[ch_num] = [
                {'file': 'ch09-01-abandoning-pod.jpg', 'alt': 'Abandoning the Pod', 'after_para': min(5, para_count-1)},
                {'file': 'ch09-02-sinking.jpg', 'alt': 'The Sinking', 'after_para': min(15, para_count-1)},
            ]
        elif ch_num == 10:
            image_map[ch_num] = [
                {'file': 'ch10-01-stretcher.jpg', 'alt': 'The Stretcher — Evan pulling Adam', 'after_para': min(5, para_count-1)},
                {'file': 'ch10-02-green-hills.jpg', 'alt': "ALICE's Vision — green hills", 'after_para': min(15, para_count-1)},
                {'file': 'ch10-03-cosmic-whales.jpg', 'alt': 'The Cosmic Whales', 'after_para': min(25, para_count-1)},
            ]
        elif ch_num == 11:
            image_map[ch_num] = [
                {'file': 'ch11-01-evan-alone.jpg', 'alt': 'Evan Alone — grief on the dust sea', 'after_para': min(3, para_count-1)},
                {'file': 'ch11-02-technicolor-valley.jpg', 'alt': 'The Technicolor Valley', 'after_para': min(7, para_count-1)},
            ]
        elif ch_num == 12:
            image_map[ch_num] = [
                {'file': 'ch12-01-evan-running.jpg', 'alt': 'Evan Running — obsidian trail across dust', 'after_para': min(3, para_count-1)},
                {'file': 'ch12-02-ascent.jpg', 'alt': 'The Ascent — passing through the star ring', 'after_para': min(7, para_count-1)},
            ]

    # Convert image_map keys to strings for JSON
    image_map_str = {str(k): v for k, v in image_map.items()}

    data = {
        'title': 'Another ALICE',
        'author': 'Shawn Jordan',
        'chapters': chapters,
        'epilogue': epilogue,
        'images': image_map_str,
        'epilogue_images': [
            {'file': 'epilogue-01-chalice-alone.jpg', 'alt': 'The Chalice Alone', 'after_para': 5},
        ]
    }

    with open('reader/story-data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Parsed {len(chapters)} chapters + epilogue")
    for ch in chapters:
        print(f"  Ch {ch['number']}: {ch['title']} ({len(ch['paragraphs'])} paragraphs)")
    print(f"  Epilogue: {len(epilogue)} paragraphs")

if __name__ == '__main__':
    main()
