export interface AlicePromptPoint {
  chapterNumber: number;
  triggerPosition: number; // 0.0 to 1.0 representing scroll percentage
  textPassage: string;
  description: string;
}

export const alicePromptPoints: AlicePromptPoint[] = [
  {
    chapterNumber: 1,
    triggerPosition: 0.45,
    textPassage: "Adam rubbed at his eyes in disbelief, as the dancing gray fog shifted, revealing a dramatic constellation of ships and debris. All around, Adam could make them out – smatterings of black ink held fast in the sky, jagged streaks and tears punctuated by circular droplets.",
    description: "The constellation of destroyed ships"
  },
  {
    chapterNumber: 2,
    triggerPosition: 0.55,
    textPassage: "The vegetation, so to speak, consisted of meager, naked, weary excuses for life. All around the room, the floor was covered with creation after creation, each flawed in some tragic way. Row after row of pots holding stems without leaves, or roots without stems, seeds that couldn't bloom, or dust waiting to claim another attempt at life.",
    description: "Adam's greenhouse of failed experiments"
  },
  {
    chapterNumber: 3,
    triggerPosition: 0.48,
    textPassage: "Mountains rose from the once-flat sea, gargantuan mounds topped by epic monoliths that stretched endlessly upward into all-consuming light. Adam felt impossibly small, trapped in a valley between these monuments.",
    description: "The star storm and mountains of dust"
  },
  {
    chapterNumber: 4,
    triggerPosition: 0.52,
    textPassage: "There in the chamber below waited an egg, partially submerged in a pool of ochre soup, bobbing gently in the murky broth. A hairline crack had developed in the soft shell, a thin fracture that ran nearly all the way around the circumference of the thing.",
    description: "The egg beginning to hatch"
  },
  {
    chapterNumber: 5,
    triggerPosition: 0.40,
    textPassage: "All around, the faces of his beloved daffodils peeked out from behind shattered clay pieces or from under hills of dust that held them hard to the ground. Embedded in the chaos was the oak, inverted and odd, its branches buried deep into the haphazard horde like roots, and its roots protruding embarrassingly out into the open air.",
    description: "The garden destroyed by the storm"
  },
  {
    chapterNumber: 6,
    triggerPosition: 0.58,
    textPassage: "The pearl gleamed in the low light of the room, held tenderly in Adam's trembling hands. It was opalescent, shifting colors as it caught what little illumination filtered down from above – blues and greens and purples dancing across its surface like oil on water.",
    description: "Discovery of the pearl"
  },
  {
    chapterNumber: 7,
    triggerPosition: 0.45,
    textPassage: "Evan moved through the garden with purpose, his hands running along the stems and leaves, checking each plant like a parent might check a sleeping child. His presence filled the space in ways Adam had forgotten were possible – the sound of another voice, another set of footsteps, another beating heart.",
    description: "Evan tending the garden"
  },
  {
    chapterNumber: 8,
    triggerPosition: 0.50,
    textPassage: "With a momentous crash and a sickening belch, a life crumbled to ash in the twilit breaths of a new day's dawn.",
    description: "The burning house in Evan's story"
  },
  {
    chapterNumber: 9,
    triggerPosition: 0.42,
    textPassage: "The water was everywhere and nowhere all at once. Adam floated in the viscous gray, suspended between drowning and breathing, between life and whatever came after.",
    description: "Sinking into the dust sea"
  },
  {
    chapterNumber: 10,
    triggerPosition: 0.55,
    textPassage: "They stood together at the edge of the pod, looking out at the horizon where dust met sky. Two figures in the vastness, no longer alone, but still searching for meaning in the gray.",
    description: "Standing together at the threshold"
  },
  {
    chapterNumber: 11,
    triggerPosition: 0.48,
    textPassage: "The stranger's eyes held galaxies within them, reflecting the dancing stars above. When they spoke, it was with the weight of eons, of journeys beyond comprehension.",
    description: "The mysterious encounter"
  },
  {
    chapterNumber: 12,
    triggerPosition: 0.60,
    textPassage: "The ship trembled with anticipation, systems coming online one by one. This was not an ending, but a transformation – a chrysalis splitting open to reveal something new.",
    description: "Preparing to leave"
  }
];
