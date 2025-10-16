export interface AlicePromptPoint {
  chapterNumber: number;
  characterPosition: number; // Character index in the chapter text where the dot appears
  textPassage: string;
  description: string;
  id: string; // Unique identifier for this point
}

export const alicePromptPoints: AlicePromptPoint[] = [
  // Chapter 1 - Multiple visual moments at sentence/paragraph breaks
  {
    chapterNumber: 1,
    characterPosition: 1200,
    textPassage: "The appalling silence of deep space crescendoed recklessly to a roar, then a scream, then an awesome symphony of sound and static.",
    description: "A visual explosion of sound waves transforming from silence into chaos - vibrating energy patterns, crescendoing waveforms bursting into color, sonic ripples through the void of space",
    id: "ch1-entry"
  },
  {
    chapterNumber: 1,
    characterPosition: 8900,
    textPassage: "Adam rubbed at his eyes in disbelief, as the dancing gray fog shifted, revealing a dramatic constellation of ships and debris.",
    description: "A haunting field of broken spacecraft suspended in thick gray fog - intact spherical pods floating among jagged torn metal sheets, dark silhouettes against swirling mist, debris creating an eerie constellation pattern",
    id: "ch1-constellation"
  },
  // Chapter 2 - Greenhouse moments at natural breaks
  {
    chapterNumber: 2,
    characterPosition: 2400,
    textPassage: "The vegetation consisted of meager, naked, weary excuses for life.",
    description: "A dimly lit greenhouse filled with wilting plants in terracotta pots - withered stems without leaves, exposed roots tangled in dry soil, failed seedlings turning to dust, rows of dying attempts at cultivation",
    id: "ch2-greenhouse"
  },
  {
    chapterNumber: 2,
    characterPosition: 4800,
    textPassage: "A single daffodil bloomed defiantly among the failures.",
    description: "One brilliant golden daffodil flower glowing softly in darkness - luminescent petals radiating warm light, surrounded by shadows and dead plant matter, a solitary beacon of successful life",
    id: "ch2-daffodil"
  },
  // Chapter 3 - The storm at paragraph breaks
  {
    chapterNumber: 3,
    characterPosition: 3600,
    textPassage: "Mountains rose from the once-flat sea, gargantuan mounds topped by epic monoliths.",
    description: "Towering mountains of cosmic dust rising from a gray sea - massive angular formations reaching upward, illuminated by intense light from above, deep valleys between monuments creating dramatic shadows",
    id: "ch3-mountains"
  },
  // Chapter 4 - The egg at sentence breaks
  {
    chapterNumber: 4,
    characterPosition: 4200,
    textPassage: "There waited an egg, partially submerged in a pool of ochre soup.",
    description: "A pale organic egg floating in thick amber liquid - smooth shell surface with a hairline crack spiraling around its circumference, murky golden broth gently rippling, dim chamber lighting",
    id: "ch4-egg"
  },
  {
    chapterNumber: 4,
    characterPosition: 6800,
    textPassage: "The crack widened and a pale appendage emerged.",
    description: "A translucent appendage pushing through cracked eggshell - delicate pale limb testing the air, fragments of shell falling into ochre liquid below, moment of emergence frozen in time",
    id: "ch4-hatching"
  },
  // Chapter 5 - Destruction at paragraph breaks
  {
    chapterNumber: 5,
    characterPosition: 3000,
    textPassage: "The faces of daffodils peeked out from behind shattered clay pieces.",
    description: "Yellow daffodil flowers buried under broken pottery shards and dust hills - golden petals struggling through debris, an upside-down oak tree with roots exposed to air and branches buried in chaos",
    id: "ch5-destruction"
  },
  // Chapter 6 - The pearl at sentence end
  {
    chapterNumber: 6,
    characterPosition: 4400,
    textPassage: "The pearl gleamed in the low light, shifting colors as it caught illumination.",
    description: "An iridescent pearl held in cupped hands - opalescent surface shifting between blue, green, and purple hues, catching rays of dim light, colors dancing across the smooth spherical surface like oil on water",
    id: "ch6-pearl"
  },
  // Chapter 7 - Companionship at natural breaks
  {
    chapterNumber: 7,
    characterPosition: 3600,
    textPassage: "Hands running along stems and leaves, checking each plant carefully.",
    description: "Gentle hands tending to plant stems in a greenhouse - fingers carefully examining leaves and stems, checking for signs of health, tender care being given to growing vegetation in dim light",
    id: "ch7-evan"
  },
  {
    chapterNumber: 7,
    characterPosition: 6200,
    textPassage: "Their hands touched as they reached for the same stem.",
    description: "Two hands meeting on a single plant stem - fingers touching as they both reach for the same green shoot, moment of connection among the plants, gentle overlap of reaching gestures",
    id: "ch7-connection"
  },
  // Chapter 8 - Fire at paragraph break
  {
    chapterNumber: 8,
    characterPosition: 4000,
    textPassage: "With a momentous crash, a life crumbled to ash in twilit breaths of dawn.",
    description: "A structure collapsing into flames at dawn - building silhouette disintegrating into ash and embers, twilight sky with first light breaking, debris falling through smoke and fire",
    id: "ch8-fire"
  },
  // Chapter 9 - Drowning at sentence end
  {
    chapterNumber: 9,
    characterPosition: 3200,
    textPassage: "Floating in the viscous gray, suspended between drowning and breathing.",
    description: "A figure suspended in thick gray liquid - weightless body floating in viscous fog-like fluid, neither sinking nor rising, caught in liminal space between substance and void",
    id: "ch9-drowning"
  },
  // Chapter 10 - Together at paragraph break
  {
    chapterNumber: 10,
    characterPosition: 4800,
    textPassage: "They stood together at the edge, looking out at the horizon.",
    description: "Two silhouettes standing at the edge of a platform - figures side by side looking toward a gray horizon where dust meets sky, vastness stretching before them, shared contemplation",
    id: "ch10-threshold"
  },
  // Chapter 11 - The encounter at sentence break
  {
    chapterNumber: 11,
    characterPosition: 3800,
    textPassage: "Eyes held galaxies within them, reflecting the dancing stars above.",
    description: "Close view of eyes filled with starlight - pupils containing swirling galaxies, stars reflected in the iris, cosmic patterns dancing within the gaze, deep space contained in human eyes",
    id: "ch11-stranger"
  },
  // Chapter 12 - Transformation at paragraph break
  {
    chapterNumber: 12,
    characterPosition: 5200,
    textPassage: "The ship trembled with anticipation, systems coming online one by one.",
    description: "A spherical spacecraft awakening - control panels lighting up in sequence, energy flowing through the ship's systems, gentle vibration of machinery coming to life, glow of activation spreading across surfaces",
    id: "ch12-transformation"
  }
];
