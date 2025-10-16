export interface AlicePromptPoint {
  chapterNumber: number;
  characterPosition: number; // Character index in the chapter text where the dot appears
  textPassage: string;
  description: string;
  id: string; // Unique identifier for this point
}

export const alicePromptPoints: AlicePromptPoint[] = [
  // Chapter 1 - Multiple visual moments
  {
    chapterNumber: 1,
    characterPosition: 850,
    textPassage: "The appalling silence of deep space crescendoed recklessly to a roar, then a scream, then an awesome symphony of sound and static.",
    description: "The overwhelming sensory experience entering the black hole",
    id: "ch1-entry"
  },
  {
    chapterNumber: 1,
    characterPosition: 3200,
    textPassage: "Adam rubbed at his eyes in disbelief, as the dancing gray fog shifted, revealing a dramatic constellation of ships and debris. All around, Adam could make them out – smatterings of black ink held fast in the sky, jagged streaks and tears punctuated by circular droplets.",
    description: "The constellation of destroyed ships",
    id: "ch1-constellation"
  },
  // Chapter 2 - Greenhouse moments
  {
    chapterNumber: 2,
    characterPosition: 1200,
    textPassage: "The vegetation, so to speak, consisted of meager, naked, weary excuses for life. All around the room, the floor was covered with creation after creation, each flawed in some tragic way. Row after row of pots holding stems without leaves, or roots without stems, seeds that couldn't bloom, or dust waiting to claim another attempt at life.",
    description: "Adam's greenhouse of failed experiments",
    id: "ch2-greenhouse"
  },
  {
    chapterNumber: 2,
    characterPosition: 2800,
    textPassage: "A single flower bloomed defiantly among the failures - a daffodil with golden petals that seemed to glow with its own light in the dim greenhouse.",
    description: "The one successful daffodil",
    id: "ch2-daffodil"
  },
  // Chapter 3 - The storm
  {
    chapterNumber: 3,
    characterPosition: 1800,
    textPassage: "Mountains rose from the once-flat sea, gargantuan mounds topped by epic monoliths that stretched endlessly upward into all-consuming light. Adam felt impossibly small, trapped in a valley between these monuments.",
    description: "The star storm and mountains of dust",
    id: "ch3-mountains"
  },
  // Chapter 4 - The egg
  {
    chapterNumber: 4,
    characterPosition: 2100,
    textPassage: "There in the chamber below waited an egg, partially submerged in a pool of ochre soup, bobbing gently in the murky broth. A hairline crack had developed in the soft shell, a thin fracture that ran nearly all the way around the circumference of the thing.",
    description: "The egg beginning to hatch",
    id: "ch4-egg"
  },
  {
    chapterNumber: 4,
    characterPosition: 3400,
    textPassage: "The crack widened and a pale, translucent appendage emerged, testing the air with delicate movements.",
    description: "Life emerging from the egg",
    id: "ch4-hatching"
  },
  // Chapter 5 - Destruction and resilience
  {
    chapterNumber: 5,
    characterPosition: 1500,
    textPassage: "All around, the faces of his beloved daffodils peeked out from behind shattered clay pieces or from under hills of dust that held them hard to the ground. Embedded in the chaos was the oak, inverted and odd, its branches buried deep into the haphazard horde like roots, and its roots protruding embarrassingly out into the open air.",
    description: "The garden destroyed by the storm",
    id: "ch5-destruction"
  },
  // Chapter 6 - The pearl
  {
    chapterNumber: 6,
    characterPosition: 2200,
    textPassage: "The pearl gleamed in the low light of the room, held tenderly in Adam's trembling hands. It was opalescent, shifting colors as it caught what little illumination filtered down from above – blues and greens and purples dancing across its surface like oil on water.",
    description: "Discovery of the pearl",
    id: "ch6-pearl"
  },
  // Chapter 7 - Companionship
  {
    chapterNumber: 7,
    characterPosition: 1800,
    textPassage: "Evan moved through the garden with purpose, his hands running along the stems and leaves, checking each plant like a parent might check a sleeping child. His presence filled the space in ways Adam had forgotten were possible – the sound of another voice, another set of footsteps, another beating heart.",
    description: "Evan tending the garden",
    id: "ch7-evan"
  },
  {
    chapterNumber: 7,
    characterPosition: 3100,
    textPassage: "Their hands touched as they reached for the same stem, and for a moment the garden felt less like a graveyard and more like a promise.",
    description: "Connection in the garden",
    id: "ch7-connection"
  },
  // Chapter 8 - Fire and memory
  {
    chapterNumber: 8,
    characterPosition: 2000,
    textPassage: "With a momentous crash and a sickening belch, a life crumbled to ash in the twilit breaths of a new day's dawn.",
    description: "The burning house in Evan's story",
    id: "ch8-fire"
  },
  // Chapter 9 - Drowning
  {
    chapterNumber: 9,
    characterPosition: 1600,
    textPassage: "The water was everywhere and nowhere all at once. Adam floated in the viscous gray, suspended between drowning and breathing, between life and whatever came after.",
    description: "Sinking into the dust sea",
    id: "ch9-drowning"
  },
  // Chapter 10 - Together
  {
    chapterNumber: 10,
    characterPosition: 2400,
    textPassage: "They stood together at the edge of the pod, looking out at the horizon where dust met sky. Two figures in the vastness, no longer alone, but still searching for meaning in the gray.",
    description: "Standing together at the threshold",
    id: "ch10-threshold"
  },
  // Chapter 11 - The encounter
  {
    chapterNumber: 11,
    characterPosition: 1900,
    textPassage: "The stranger's eyes held galaxies within them, reflecting the dancing stars above. When they spoke, it was with the weight of eons, of journeys beyond comprehension.",
    description: "The mysterious encounter",
    id: "ch11-stranger"
  },
  // Chapter 12 - Transformation
  {
    chapterNumber: 12,
    characterPosition: 2600,
    textPassage: "The ship trembled with anticipation, systems coming online one by one. This was not an ending, but a transformation – a chrysalis splitting open to reveal something new.",
    description: "Preparing to leave",
    id: "ch12-transformation"
  }
];
